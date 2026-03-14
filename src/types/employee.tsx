export type Role = "Ops" | "Admin" | "Engineer" | "Finance";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Intern";

export interface BasicInfoForm {
  fullName: string;
  email: string;
  department: string;
}

export interface DetailsForm {
  role: Role | "";
  employeeId: string;
  employmentType: EmploymentType | "";
  location: string;
  photoBase64: string;
  notes: string;
}
