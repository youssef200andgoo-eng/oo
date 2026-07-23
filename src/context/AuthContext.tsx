import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { defaultStudent } from "../mockData";

export interface StudentProfile {
  id: string;
  nationalId: string;
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
  level: string;
  totalGPA: number;
  completedHours: number;
  requiredHours: number;
  avatarUrl: string;
}

export type UserRole = "student" | "faculty" | "employee" | "admin" | "applicant" | "parent";
export type EmployeeSubRole = "registrar" | "student_affairs" | "finance_officer";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  employeeRole: EmployeeSubRole;
  setEmployeeRole: (role: EmployeeSubRole) => void;
  student: StudentProfile;
  setStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
  activeSegment: string;
  setActiveSegment: (seg: any) => void;
  subTab: string;
  setSubTab: (tab: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("sgu_is_logged_in") === "true";
  });

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem("sgu_user_role") as UserRole) || "student";
  });

  const [employeeRole, setEmployeeRoleState] = useState<EmployeeSubRole>(() => {
    return (localStorage.getItem("sgu_employee_role") as EmployeeSubRole) || "registrar";
  });

  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem("u_student");
      if (!saved || saved === "undefined" || saved === "null") return defaultStudent;
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse saved student state, using defaultStudent:", e);
      return defaultStudent;
    }
  });

  const [activeSegment, setActiveSegment] = useState<string>("student");
  
  const [subTab, setSubTab] = useState<string>(() => {
    const savedRole = localStorage.getItem("sgu_user_role") || "student";
    return savedRole === "student" ? "college_portal" : "overview";
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem("sgu_user_role", role);
  };

  const setEmployeeRole = (role: EmployeeSubRole) => {
    setEmployeeRoleState(role);
    localStorage.setItem("sgu_employee_role", role);
  };

  useEffect(() => {
    localStorage.setItem("sgu_is_logged_in", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("u_student", JSON.stringify(student));
  }, [student]);

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("sgu_is_logged_in");
    localStorage.removeItem("sgu_user_role");
    localStorage.removeItem("u_student");
    localStorage.removeItem("sgu_employee_role");
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userRole,
        setUserRole,
        employeeRole,
        setEmployeeRole,
        student,
        setStudent,
        activeSegment,
        setActiveSegment,
        subTab,
        setSubTab,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
