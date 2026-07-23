export interface StudentProfile {
  id: string; // الرقم الجامعي
  nationalId: string; // الرقم القومي
  nameArabic: string;
  nameEnglish: string;
  birthDate: string;
  nationality: string;
  address: string;
  phone: string;
  email: string;
  guardianName: string;
  emergencyPhone: string;
  college: string;
  department: string;
  major: string;
  advisor: string;
  level: string; // المستوى أو الفرقة
  totalGPA: number;
  completedHours: number;
  requiredHours: number;
  avatarUrl: string;
}

export interface Course {
  code: string;
  name: string;
  description: string;
  prerequisites: string[];
  credits: number;
  finalGrade: number;
  status: "completed" | "registered" | "available" | "locked";
  gradeObtained?: string;
}

export interface College {
  id: string;
  name: string;
  departments: string[];
  programs: string[];
  hoursRequired: number;
}

export interface ScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  room: string;
  building: string;
  timeSlot: string; // e.g., "08:30 - 10:00"
  day: string; // e.g., "الأحد", "الاثنين"
}

export interface Exam {
  id: string;
  type: "Quiz" | "Midterm" | "Practical" | "Oral" | "Final";
  courseCode: string;
  courseName: string;
  dateTime: string;
  room: string;
  status: "scheduled" | "completed" | "missed";
  gradeMax: number;
  gradeScore?: number;
}

export interface AttendanceRecord {
  date: string;
  day: string;
  courseCode: string;
  courseName: string;
  status: "present" | "absent" | "late";
  method: "QR" | "RFID" | "Face" | "GPS" | "NFC";
  time: string;
}

export interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  submitted: boolean;
  fileSubmitted?: string;
  fileType?: string;
  grade?: string;
  feedback?: string;
}

export interface LectureMaterial {
  id: string;
  courseCode: string;
  title: string;
  type: "pdf" | "video" | "slide" | "zip";
  url: string;
  duration?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  department: string;
  journal: string;
  year: number;
  status: "Published" | "Under Review" | "Draft";
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  locationCode: string;
  borrowedDate?: string;
  dueDate?: string;
}

export interface DormRoom {
  id: string;
  buildingName: string;
  roomNo: string;
  bedNo: string;
  capacity: number;
  occupied: number;
  price: number;
  status: "available" | "full" | "maintenance";
}

export interface BusRoute {
  id: string;
  busNo: string;
  driverName: string;
  driverPhone: string;
  startPoint: string;
  endPoint: string;
  stops: string[];
  currentLocationName: string;
  status: "active" | "inactive";
}

export interface MedicalRecord {
  id: string;
  visitDate: string;
  reason: string;
  diagnosis: string;
  prescription: string;
  doctor: string;
}

export interface FinanceRecord {
  id: string;
  description: string;
  amount: number;
  category: "tuition" | "housing" | "lab" | "activity";
  dueDate: string;
  paid: boolean;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface AdmissionApplication {
  id: string;
  fullName: string;
  nationalId: string;
  highSchoolPercentage: number;
  wishes: string[];
  certificateFile: string;
  idCardFile: string;
  photoFile: string;
  paidFee: boolean;
  status: "pending" | "accepted" | "rejected" | "modify_required";
  adminFeedback?: string;
  electronicSignatureId?: string;
  electronicSignatureDate?: string;
  signatureConsent?: boolean;
  publicKey?: string;
  signatureValue?: string;
  documentDataHash?: string;
  isTampered?: boolean;
}
