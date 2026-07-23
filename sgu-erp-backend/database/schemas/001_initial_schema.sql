-- ═══════════════════════════════════════════════════════════════════
-- SGU ERP - PostgreSQL Database Schema
-- Al-Salihiyah New University - Production Database
-- Supports: 100,000+ concurrent users
-- ═══════════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For indexing

-- ═══════════════════════════════════════════════════════════════════
-- 1. CORE TABLES
-- ═══════════════════════════════════════════════════════════════════

-- Universities (Multi-tenancy support)
CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    abbreviation VARCHAR(10) NOT NULL,
    logo_url TEXT,
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Egypt',
    timezone VARCHAR(50) DEFAULT 'Africa/Cairo',
    currency VARCHAR(10) DEFAULT 'EGP',
    established_year INTEGER,
    accreditation_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Campuses
CREATE TABLE IF NOT EXISTS campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL,
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(university_id, code)
);

-- ═══════════════════════════════════════════════════════════════════
-- 2. USER MANAGEMENT & AUTHENTICATION
-- ═══════════════════════════════════════════════════════════════════

-- Roles & Permissions (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name_ar VARCHAR(200),
    display_name_en VARCHAR(200),
    description TEXT,
    level INTEGER DEFAULT 1, -- 1=Student, 10=Admin, 100=SuperAdmin
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    resource VARCHAR(100) NOT NULL, -- e.g., 'students', 'grades'
    action VARCHAR(50) NOT NULL, -- e.g., 'read', 'write', 'delete'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    conditions JSONB DEFAULT '{}', -- e.g., {"campus_id": "..."}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Users (Base table for all user types)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES universities(id),
    campus_id UUID REFERENCES campuses(id),
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    password_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Profile
    first_name_ar VARCHAR(100),
    last_name_ar VARCHAR(100),
    first_name_en VARCHAR(100),
    last_name_en VARCHAR(100),
    full_name_ar VARCHAR(200) GENERATED ALWAYS AS (
        COALESCE(first_name_ar, '') || ' ' || COALESCE(last_name_ar, '')
    ) STORED,
    full_name_en VARCHAR(200) GENERATED ALWAYS AS (
        COALESCE(first_name_en, '') || ' ' || COALESCE(last_name_en, '')
    ) STORED,
    
    -- Identity
    national_id VARCHAR(20) UNIQUE,
    passport_number VARCHAR(50),
    nationality VARCHAR(100) DEFAULT 'Egyptian',
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    birth_date DATE,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    
    -- Avatar & Documents
    avatar_url TEXT,
    signature_url TEXT, -- Electronic signature
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    two_factor_backup_codes TEXT[],
    
    -- Login tracking
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    last_login_device TEXT,
    login_count INTEGER DEFAULT 0,
    failed_login_count INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);

-- User Roles (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id),
    department_id UUID,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, role_id, campus_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- 3. COLLEGES & DEPARTMENTS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES universities(id),
    campus_id UUID REFERENCES campuses(id),
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL,
    abbreviation VARCHAR(10),
    dean_id UUID REFERENCES users(id),
    vice_dean_id UUID REFERENCES users(id),
    established_year INTEGER,
    accreditation_status VARCHAR(50),
    accreditation_body VARCHAR(100), -- NAQAAE, ABET, etc.
    accreditation_valid_until DATE,
    total_credit_hours INTEGER,
    description TEXT,
    vision TEXT,
    mission TEXT,
    goals JSONB DEFAULT '[]',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    logo_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(university_id, code)
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL,
    head_id UUID REFERENCES users(id),
    established_year INTEGER,
    description TEXT,
    research_areas JSONB DEFAULT '[]',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(college_id, code)
);

-- Programs (Majors/Specializations)
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL,
    degree_type VARCHAR(50) NOT NULL, -- bachelor, master, phd, diploma
    total_credit_hours INTEGER NOT NULL,
    duration_years INTEGER NOT NULL,
    description TEXT,
    objectives JSONB DEFAULT '[]',
    outcomes JSONB DEFAULT '[]',
    accreditation_status VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, code)
);

-- ═══════════════════════════════════════════════════════════════════
-- 4. ACADEMIC CALENDAR
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES universities(id),
    year_name VARCHAR(50) NOT NULL, -- e.g., "2025-2026"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    hijri_year VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    semester_name VARCHAR(50) NOT NULL, -- First, Second, Summer
    semester_number INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    add_drop_start DATE,
    add_drop_end DATE,
    withdrawal_deadline DATE,
    exam_start_date DATE,
    exam_end_date DATE,
    status VARCHAR(20) DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 5. STUDENTS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    student_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Academic Info
    college_id UUID NOT NULL REFERENCES colleges(id),
    department_id UUID REFERENCES departments(id),
    program_id UUID REFERENCES programs(id),
    academic_year_id UUID REFERENCES academic_years(id),
    semester_id UUID REFERENCES semesters(id),
    level INTEGER DEFAULT 1, -- 1-12 for medicine, 1-4 for CS, etc.
    
    -- Enrollment
    enrollment_date DATE,
    expected_graduation DATE,
    actual_graduation DATE,
    graduation_status VARCHAR(50) DEFAULT 'active',
    
    -- Academic Performance
    gpa DECIMAL(3,2) DEFAULT 0.00,
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    total_earned_credits INTEGER DEFAULT 0,
    total_required_credits INTEGER,
    academic_standing VARCHAR(50) DEFAULT 'good', -- good, probation, dismissal
    
    -- Financial
    tuition_fees DECIMAL(12,2) DEFAULT 0.00,
    paid_amount DECIMAL(12,2) DEFAULT 0.00,
    remaining_amount DECIMAL(12,2) DEFAULT 0.00,
    scholarship_id UUID,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Personal Info
    blood_type VARCHAR(10),
    medical_conditions TEXT,
    disabilities TEXT,
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    
    -- Guardian Info
    guardian_name VARCHAR(200),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(255),
    guardian_relation VARCHAR(50),
    guardian_job VARCHAR(200),
    guardian_address TEXT,
    
    -- High School
    high_school_name VARCHAR(200),
    high_school_governorate VARCHAR(100),
    high_school_percentage DECIMAL(5,2),
    high_school_year INTEGER,
    thanaweya_type VARCHAR(50), -- general, al-azhar, etc.
    
    -- Electronic Signature
    electronic_signature_id VARCHAR(255),
    electronic_signature_verified BOOLEAN DEFAULT false,
    electronic_signature_verified_at TIMESTAMP WITH TIME ZONE,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 6. PROFESSORS & STAFF
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS professors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Academic Info
    college_id UUID NOT NULL REFERENCES colleges(id),
    department_id UUID REFERENCES departments(id),
    specialization VARCHAR(200),
    sub_specialization VARCHAR(200),
    academic_rank VARCHAR(50), -- professor, associate, assistant, lecturer
    degree VARCHAR(100),
    phd_thesis_title TEXT,
    phd_year INTEGER,
    phd_university VARCHAR(200),
    
    -- Employment
    hire_date DATE,
    contract_type VARCHAR(50), -- full_time, part_time, visiting
    employment_status VARCHAR(50) DEFAULT 'active',
    
    -- Research
    research_interests JSONB DEFAULT '[]',
    publications_count INTEGER DEFAULT 0,
    citations_count INTEGER DEFAULT 0,
    h_index INTEGER DEFAULT 0,
    orcid_id VARCHAR(50),
    google_scholar_id VARCHAR(50),
    
    -- Teaching
    max_weekly_hours INTEGER DEFAULT 12,
    current_weekly_hours INTEGER DEFAULT 0,
    
    -- Office
    office_location VARCHAR(200),
    office_hours JSONB DEFAULT '[]',
    
    -- Salary
    base_salary DECIMAL(12,2),
    bonus DECIMAL(12,2) DEFAULT 0.00,
    total_salary DECIMAL(12,2) GENERATED ALWAYS AS (COALESCE(base_salary, 0) + COALESCE(bonus, 0)) STORED,
    bank_name VARCHAR(100),
    bank_account VARCHAR(100),
    iban VARCHAR(50),
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff (Administrative)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    
    department VARCHAR(100), -- HR, Finance, IT, etc.
    job_title VARCHAR(200),
    job_grade VARCHAR(50),
    
    hire_date DATE,
    contract_type VARCHAR(50),
    employment_status VARCHAR(50) DEFAULT 'active',
    
    base_salary DECIMAL(12,2),
    bonus DECIMAL(12,2) DEFAULT 0.00,
    bank_name VARCHAR(100),
    bank_account VARCHAR(100),
    
    supervisor_id UUID REFERENCES users(id),
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 7. COURSES
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES colleges(id),
    department_id UUID REFERENCES departments(id),
    program_id UUID REFERENCES programs(id),
    
    course_code VARCHAR(50) NOT NULL,
    course_name_ar VARCHAR(200) NOT NULL,
    course_name_en VARCHAR(200) NOT NULL,
    description TEXT,
    objectives JSONB DEFAULT '[]',
    outcomes JSONB DEFAULT '[]',
    
    -- Credits & Hours
    credit_hours INTEGER NOT NULL,
    lecture_hours INTEGER DEFAULT 0,
    lab_hours INTEGER DEFAULT 0,
    tutorial_hours INTEGER DEFAULT 0,
    total_weekly_hours INTEGER GENERATED ALWAYS AS (lecture_hours + lab_hours + tutorial_hours) STORED,
    
    -- Level & Semester
    level INTEGER NOT NULL,
    semester_offered INTEGER NOT NULL, -- 1, 2, or 3 (summer)
    
    -- Prerequisites
    prerequisites JSONB DEFAULT '[]', -- Array of course_ids
    corequisites JSONB DEFAULT '[]',
    
    -- Settings
    max_students INTEGER DEFAULT 50,
    min_students INTEGER DEFAULT 10,
    is_elective BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Materials
    syllabus_url TEXT,
    textbook TEXT,
    references JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(college_id, course_code)
);

-- Course Sections (Groups)
CREATE TABLE IF NOT EXISTS course_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id),
    
    section_number VARCHAR(20) NOT NULL,
    professor_id UUID REFERENCES professors(id),
    assistant_id UUID REFERENCES professors(id),
    
    max_capacity INTEGER DEFAULT 30,
    current_enrolled INTEGER DEFAULT 0,
    waitlist_count INTEGER DEFAULT 0,
    
    schedule_days INTEGER[] DEFAULT '{}', -- [1,3,5] for Sun,Tue,Thu
    start_time TIME,
    end_time TIME,
    room_id UUID,
    
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, semester_id, section_number)
);

-- ═══════════════════════════════════════════════════════════════════
-- 8. ENROLLMENTS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id),
    section_id UUID REFERENCES course_sections(id),
    semester_id UUID NOT NULL REFERENCES semesters(id),
    
    enrollment_date DATE DEFAULT CURRENT_DATE,
    enrollment_type VARCHAR(50) DEFAULT 'regular', -- regular, repeat, improvement
    status VARCHAR(55) DEFAULT 'active', -- active, dropped, withdrawn, completed
    
    -- Grades
    grade VARCHAR(5), -- A+, A, B+, etc.
    grade_points DECIMAL(3,2),
    numeric_grade DECIMAL(5,2),
    
    -- Attendance
    attendance_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Drop/Withdrawal
    dropped_date DATE,
    drop_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, semester_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- 9. GRADES
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS grade_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Midterm, Final, Practical, etc.
    name_ar VARCHAR(100),
    weight DECIMAL(5,2) NOT NULL, -- percentage (e.g., 30.00 for 30%)
    max_marks DECIMAL(5,2) NOT NULL,
    min_passing_marks DECIMAL(5,2),
    is_required BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    component_id UUID REFERENCES grade_components(id),
    
    marks_obtained DECIMAL(5,2),
    percentage DECIMAL(5,2),
    grade VARCHAR(5),
    
    entered_by UUID REFERENCES professors(id),
    entered_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES professors(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    
    notes TEXT,
    is_appealed BOOLEAN DEFAULT false,
    appeal_status VARCHAR(50), -- pending, approved, rejected
    appeal_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GPA History
CREATE TABLE IF NOT EXISTS gpa_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id),
    
    gpa DECIMAL(3,2),
    cgpa DECIMAL(3,2),
    total_credits_attempted INTEGER,
    total_credits_earned INTEGER,
    total_quality_points DECIMAL(8,2),
    
    academic_standing VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, semester_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- 10. ATTENDANCE
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    section_id UUID REFERENCES course_sections(id),
    semester_id UUID NOT NULL REFERENCES semesters(id),
    
    session_date DATE NOT NULL,
    session_number INTEGER,
    week_number INTEGER,
    
    start_time TIME,
    end_time TIME,
    topic TEXT,
    
    method VARCHAR(50) DEFAULT 'manual', -- manual, qr, nfc, face, gps
    qr_code VARCHAR(255),
    qr_expires_at TIMESTAMP WITH TIME ZONE,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    
    status VARCHAR(50) NOT NULL, -- present, absent, late, excused
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    
    -- Verification
    verification_method VARCHAR(50), -- qr, nfc, face, gps, manual
    verification_data JSONB DEFAULT '{}', -- {qr_code: "...", location: {...}}
    device_info TEXT,
    ip_address INET,
    
    notes TEXT,
    modified_by UUID REFERENCES users(id),
    modified_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, student_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- 11. EXAMS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    section_id UUID REFERENCES course_sections(id),
    semester_id UUID NOT NULL REFERENCES semesters(id),
    
    exam_type VARCHAR(50) NOT NULL, -- quiz, midterm, practical, oral, final
    exam_title VARCHAR(200),
    
    scheduled_date DATE,
    start_time TIME,
    end_time TIME,
    duration_minutes INTEGER,
    
    room_id UUID,
    supervisor_id UUID REFERENCES professors(id),
    
    total_marks DECIMAL(5,2),
    passing_marks DECIMAL(5,2),
    
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
    
    -- Proctoring (AI)
    ai_proctoring_enabled BOOLEAN DEFAULT false,
    proctoring_settings JSONB DEFAULT '{}',
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Question Bank
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    professor_id UUID REFERENCES professors(id),
    
    question_type VARCHAR(50) NOT NULL, -- mcq, true_false, essay, coding, matching
    question_text TEXT NOT NULL,
    question_text_ar TEXT,
    
    options JSONB, -- For MCQ: [{text: "...", is_correct: true}, ...]
    correct_answer TEXT,
    explanation TEXT,
    
    difficulty VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
    marks DECIMAL(5,2) DEFAULT 1.00,
    
    tags JSONB DEFAULT '[]',
    usage_count INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exam Questions
CREATE TABLE IF NOT EXISTS exam_questions (
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    order_number INTEGER,
    marks DECIMAL(5,2),
    PRIMARY KEY (exam_id, question_id)
);

-- Student Exam Attempts
CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id),
    student_id UUID NOT NULL REFERENCES students(id),
    
    started_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER,
    
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, submitted, auto_submitted
    
    -- AI Proctoring
    proctoring_flags JSONB DEFAULT '[]', -- [{type: "face_absent", timestamp: "..."}, ...]
    proctoring_score DECIMAL(5,2), -- 0-100, lower is better
    
    total_marks DECIMAL(5,2),
    obtained_marks DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_id, student_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- 12. FINANCE
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS fee_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES universities(id),
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT true,
    frequency VARCHAR(50) DEFAULT 'semester', -- semester, year, one_time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_type_id UUID NOT NULL REFERENCES fee_types(id),
    semester_id UUID REFERENCES semesters(id),
    
    amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    penalty_amount DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) GENERATED ALWAYS AS (amount - discount_amount + penalty_amount) STORED,
    
    due_date DATE,
    paid_amount DECIMAL(12,2) DEFAULT 0.00,
    remaining_amount DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    
    status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid, waived
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_fee_id UUID NOT NULL REFERENCES student_fees(id),
    
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- fawry, paymob, stripe, bank_transfer, cash
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(255),
    
    -- Card/Payment Details (encrypted)
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    
    paid_at TIMESTAMP WITH TIME ZONE,
    receipt_number VARCHAR(100),
    
    -- Gateway Response
    gateway_response JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 13. LIBRARY
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    isbn VARCHAR(20) UNIQUE,
    title_ar VARCHAR(500),
    title_en VARCHAR(500) NOT NULL,
    author_ar VARCHAR(200),
    author_en VARCHAR(200),
    publisher VARCHAR(200),
    publish_year INTEGER,
    edition VARCHAR(50),
    
    category VARCHAR(100),
    subject VARCHAR(100),
    keywords JSONB DEFAULT '[]',
    
    copies_total INTEGER DEFAULT 1,
    copies_available INTEGER DEFAULT 1,
    
    shelf_location VARCHAR(100),
    digital_url TEXT,
    
    status VARCHAR(50) DEFAULT 'available', -- available, borrowed, lost, damaged
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS library_borrowing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES library_books(id),
    borrower_type VARCHAR(50) NOT NULL, -- student, professor, staff
    borrower_id UUID NOT NULL,
    
    borrow_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    
    renewal_count INTEGER DEFAULT 0,
    
    fine_amount DECIMAL(8,2) DEFAULT 0.00,
    fine_paid BOOLEAN DEFAULT false,
    
    status VARCHAR(50) DEFAULT 'borrowed', -- borrowed, returned, overdue, lost
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 14. BUILDINGS & ROOMS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID NOT NULL REFERENCES campuses(id),
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL,
    
    building_type VARCHAR(50), -- academic, admin, dorm, clinic, library
    floors INTEGER DEFAULT 1,
    
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campus_id, code)
);

CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    floor INTEGER DEFAULT 1,
    
    room_type VARCHAR(50), -- lecture, lab, meeting, office, exam
    capacity INTEGER DEFAULT 30,
    
    has_projector BOOLEAN DEFAULT false,
    has_smart_board BOOLEAN DEFAULT false,
    has_ac BOOLEAN DEFAULT false,
    has_internet BOOLEAN DEFAULT true,
    
    equipment JSONB DEFAULT '[]',
    
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(building_id, room_number)
);

-- ═══════════════════════════════════════════════════════════════════
-- 15. DORMS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS dormitories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID NOT NULL REFERENCES campuses(id),
    building_id UUID REFERENCES buildings(id),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL,
    
    dorm_type VARCHAR(50), -- male, female, mixed
    room_count INTEGER,
    bed_count INTEGER,
    
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dorm_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dormitory_id UUID NOT NULL REFERENCES dormitories(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    
    capacity INTEGER DEFAULT 2,
    current_occupants INTEGER DEFAULT 0,
    
    room_type VARCHAR(50), -- single, double, triple, quad
    amenities JSONB DEFAULT '[]',
    
    status VARCHAR(20) DEFAULT 'available', -- available, occupied, maintenance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dorm_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    dorm_room_id UUID NOT NULL REFERENCES dorm_rooms(id),
    
    assignment_date DATE DEFAULT CURRENT_DATE,
    expected_end_date DATE,
    actual_end_date DATE,
    
    fee_amount DECIMAL(10,2),
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    
    status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 16. TRANSPORT
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS buses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID NOT NULL REFERENCES campuses(id),
    
    plate_number VARCHAR(50) NOT NULL UNIQUE,
    model VARCHAR(100),
    capacity INTEGER DEFAULT 50,
    
    gps_device_id VARCHAR(100),
    gps_enabled BOOLEAN DEFAULT false,
    
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bus_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID NOT NULL REFERENCES campuses(id),
    
    route_name VARCHAR(200) NOT NULL,
    route_code VARCHAR(50) NOT NULL,
    
    start_location VARCHAR(200),
    end_location VARCHAR(200),
    stops JSONB DEFAULT '[]',
    
    departure_time TIME,
    arrival_time TIME,
    
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bus_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_id UUID NOT NULL REFERENCES buses(id),
    route_id UUID NOT NULL REFERENCES bus_routes(id),
    
    schedule_date DATE,
    day_of_week INTEGER, -- 0=Sunday, 6=Saturday
    
    driver_id UUID REFERENCES staff(id),
    
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 17. CLINIC
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_type VARCHAR(50) NOT NULL, -- student, professor, staff
    
    blood_type VARCHAR(10),
    allergies TEXT,
    chronic_diseases TEXT,
    medications TEXT,
    
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    
    insurance_provider VARCHAR(200),
    insurance_number VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID NOT NULL REFERENCES medical_records(id),
    
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visit_type VARCHAR(50), -- routine, emergency, follow_up
    
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    
    prescribed_medications JSONB DEFAULT '[]',
    
    doctor_id UUID REFERENCES staff(id),
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 18. SECURITY & VISITORS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS access_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    
    card_number VARCHAR(100) NOT NULL UNIQUE,
    card_type VARCHAR(50), -- nfc, rfid, barcode
    
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    last_used_at TIMESTAMP WITH TIME ZONE,
    last_used_location VARCHAR(200),
    
    status VARCHAR(20) DEFAULT 'active', -- active, expired, lost, blocked
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    full_name VARCHAR(200) NOT NULL,
    national_id VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    
    visit_purpose TEXT,
    host_name VARCHAR(200),
    host_department VARCHAR(200),
    
    entry_time TIMESTAMP WITH TIME ZONE,
    exit_time TIMESTAMP WITH TIME ZONE,
    
    vehicle_plate VARCHAR(50),
    
    status VARCHAR(20) DEFAULT 'pending', -- pending, checked_in, checked_out, denied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 19. ALUMNI
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS alumni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL UNIQUE REFERENCES students(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    graduation_year INTEGER,
    graduation_semester_id UUID REFERENCES semesters(id),
    
    final_gpa DECIMAL(3,2),
    degree_classification VARCHAR(50), -- excellent, very_good, good, pass
    
    -- Employment
    current_employer VARCHAR(200),
    job_title VARCHAR(200),
    industry VARCHAR(100),
    employment_status VARCHAR(50), -- employed, self_employed, unemployed, studying
    
    -- Contact
    work_email VARCHAR(255),
    work_phone VARCHAR(20),
    linkedin_url VARCHAR(255),
    
    -- Alumni Network
    is_donor BOOLEAN DEFAULT false,
    total_donations DECIMAL(12,2) DEFAULT 0.00,
    
    -- Mentorship
    is_mentor BOOLEAN DEFAULT false,
    mentorship_areas JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 20. AUDIT & LOGS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID REFERENCES users(id),
    user_type VARCHAR(50),
    
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, etc.
    entity_type VARCHAR(100) NOT NULL, -- students, grades, etc.
    entity_id UUID,
    
    old_values JSONB,
    new_values JSONB,
    
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    
    -- Risk scoring
    risk_score INTEGER DEFAULT 0, -- 0-100
    is_suspicious BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Login History
CREATE TABLE IF NOT EXISTS login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    login_method VARCHAR(50), -- password, oauth, 2fa, biometric
    
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    device_type VARCHAR(50), -- desktop, mobile, tablet
    browser VARCHAR(100),
    os VARCHAR(100),
    
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    
    status VARCHAR(50), -- success, failed, blocked
    failure_reason VARCHAR(200),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- ═══════════════════════════════════════════════════════════════════
-- 21. NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    recipient_type VARCHAR(50) NOT NULL, -- student, professor, all
    recipient_id UUID,
    
    title_ar VARCHAR(500),
    title_en VARCHAR(500) NOT NULL,
    body_ar TEXT,
    body_en TEXT,
    
    notification_type VARCHAR(50), -- academic, financial, general, emergency
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Delivery
    channels JSONB DEFAULT '["in_app"]', -- in_app, email, sms, push
    
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    sms_sent BOOLEAN DEFAULT false,
    sms_sent_at TIMESTAMP WITH TIME ZONE,
    push_sent BOOLEAN DEFAULT false,
    push_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Read status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Action
    action_url VARCHAR(500),
    action_type VARCHAR(50),
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════
-- 22. SCHOLARSHIPS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES universities(id),
    
    name VARCHAR(200) NOT NULL,
    provider VARCHAR(200),
    type VARCHAR(50), -- merit, need, athletic, research, external
    
    amount DECIMAL(12,2),
    percentage DECIMAL(5,2),
    
    requirements JSONB DEFAULT '{}',
    
    start_date DATE,
    end_date DATE,
    
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    scholarship_id UUID NOT NULL REFERENCES scholarships(id),
    
    awarded_at DATE DEFAULT CURRENT_DATE,
    amount_awarded DECIMAL(12,2),
    
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, revoked, completed
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, scholarship_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE (100k+ users)
-- ═══════════════════════════════════════════════════════════════════

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_national_id ON users(national_id);
CREATE INDEX idx_users_status ON users(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_university ON users(university_id);

-- Students
CREATE INDEX idx_students_number ON students(student_number);
CREATE INDEX idx_students_college ON students(college_id);
CREATE INDEX idx_students_status ON students(graduation_status);

-- Enrollments
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_semester ON enrollments(semester_id);

-- Grades
CREATE INDEX idx_grades_enrollment ON grades(enrollment_id);
CREATE INDEX idx_grades_entered_by ON grades(entered_by);

-- Attendance
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_status ON attendance(status);

-- Notifications
CREATE INDEX idx_notifications_recipient ON notifications(recipient_type, recipient_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id, is_read) WHERE is_read = false;

-- Full-text search
CREATE INDEX idx_courses_name_trgm ON courses USING gin(course_name_ar gin_trgm_ops);
CREATE INDEX idx_books_title_trgm ON library_books USING gin(title_en gin_trgm_ops);

-- ═══════════════════════════════════════════════════════════════════
-- PARTITIONING FOR LARGE TABLES (100k+ records)
-- ═══════════════════════════════════════════════════════════════════

-- Partition audit_logs by month
CREATE TABLE IF NOT EXISTS audit_logs_2024_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE IF NOT EXISTS audit_logs_2024_02 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Partition login_history by month
CREATE TABLE IF NOT EXISTS login_history_2024_01 PARTITION OF login_history
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- ═══════════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professors_updated_at BEFORE UPDATE ON professors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate remaining_amount for student_fees
CREATE OR REPLACE FUNCTION calculate_remaining_amount()
RETURNS TRIGGER AS $$
BEGIN
    NEW.remaining_amount := NEW.total_amount - NEW.paid_amount;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_remaining_amount
    BEFORE INSERT OR UPDATE ON student_fees
    FOR EACH ROW EXECUTE FUNCTION calculate_remaining_amount();

-- ═══════════════════════════════════════════════════════════════════
-- INITIAL DATA
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO roles (name, display_name_ar, display_name_en, description, level, is_system) VALUES
('super_admin', 'مدير النظام الأعلى', 'Super Administrator', 'Full system access', 100, true),
('university_admin', 'مدير الجامعة', 'University Administrator', 'University-level administration', 90, true),
('dean', 'عميد الكلية', 'Dean', 'College dean', 80, true),
('department_head', 'رئيس القسم', 'Department Head', 'Department head', 70, true),
('professor', 'عضو هيئة التدريس', 'Professor', 'Teaching faculty', 60, true),
('student', 'طالب', 'Student', 'Student', 10, true),
('staff', 'موظف', 'Staff', 'Administrative staff', 50, true),
('librarian', 'أمين المكتبة', 'Librarian', 'Library staff', 40, true),
('accountant', 'محاسب', 'Accountant', 'Finance staff', 40, true),
('security', 'أمن', 'Security', 'Security personnel', 30, true),
('parent', 'ولي أمر', 'Parent', 'Parent/Guardian', 5, true),
('alumni', 'خريج', 'Alumni', 'Graduated student', 5, true)
ON CONFLICT (name) DO NOTHING;

-- Permissions
INSERT INTO permissions (name, resource, action, description) VALUES
('students.read', 'students', 'read', 'View student records'),
('students.write', 'students', 'write', 'Edit student records'),
('students.delete', 'students', 'delete', 'Delete student records'),
('grades.read', 'grades', 'read', 'View grades'),
('grades.write', 'grades', 'write', 'Enter/Edit grades'),
('grades.verify', 'grades', 'verify', 'Verify grades'),
('finance.read', 'finance', 'read', 'View financial records'),
('finance.write', 'finance', 'write', 'Manage financial records'),
('attendance.read', 'attendance', 'read', 'View attendance'),
('attendance.write', 'attendance', 'write', 'Manage attendance')
ON CONFLICT (name) DO NOTHING;

-- Default University (SGU)
INSERT INTO universities (name_ar, name_en, code, abbreviation, established_year, timezone, currency)
VALUES (
    'جامعة الصالحية الجديدة',
    'Al-Salihiyah New University',
    'SGU',
    'SGU',
    2024,
    'Africa/Cairo',
    'EGP'
)
ON CONFLICT (code) DO NOTHING;

-- Default Admin User (password: SGU@Admin2024!)
-- Hash: bcrypt of 'SGU@Admin2024!'
INSERT INTO users (university_id, email, password_hash, first_name_en, last_name_en, first_name_ar, last_name_ar, status, is_verified)
VALUES (
    (SELECT id FROM universities WHERE code = 'SGU'),
    'admin@sgu.edu.eg',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G',
    'System',
    'Administrator',
    'مدير',
    'النظام',
    'active',
    true
)
ON CONFLICT (email) DO NOTHING;

-- Assign Super Admin role
INSERT INTO user_roles (user_id, role_id, is_primary)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@sgu.edu.eg'),
    (SELECT id FROM roles WHERE name = 'super_admin'),
    true
)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- VIEWS
-- ═══════════════════════════════════════════════════════════════════

-- Student Full Info View
CREATE OR REPLACE VIEW v_student_full_info AS
SELECT 
    s.id,
    s.student_number,
    u.email,
    u.full_name_ar,
    u.full_name_en,
    u.phone,
    c.name_ar as college_name,
    d.name_ar as department_name,
    p.name_ar as program_name,
    s.level,
    s.gpa,
    s.cgpa,
    s.academic_standing,
    s.graduation_status
FROM students s
JOIN users u ON s.user_id = u.id
JOIN colleges c ON s.college_id = c.id
LEFT JOIN departments d ON s.department_id = d.id
LEFT JOIN programs p ON s.program_id = p.id
WHERE u.deleted_at IS NULL;

-- Course Enrollment Stats View
CREATE OR REPLACE VIEW v_course_enrollment_stats AS
SELECT 
    c.id,
    c.course_code,
    c.course_name_ar,
    c.course_name_en,
    COUNT(e.id) as total_enrolled,
    COUNT(CASE WHEN e.status = 'active' THEN 1 END) as active_enrolled,
    COUNT(CASE WHEN e.status = 'dropped' THEN 1 END) as dropped_count,
    AVG(e.numeric_grade) as average_grade
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id;

-- ═══════════════════════════════════════════════════════════════════
-- DONE
-- ═══════════════════════════════════════════════════════════════════

SELECT 'SGU ERP Database Schema Created Successfully!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';
