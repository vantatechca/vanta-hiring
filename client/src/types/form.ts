export interface ApplicationFormData {
  full_name: string;
  phone: string;
  date_of_birth: string;
  marital_status: string;
  available_weekends: boolean;
  available_evenings: boolean;
  on_call_emergencies: boolean;
  has_drivers_license: boolean;
  startup_mindset: boolean;
  has_second_job: boolean;
  second_job_details: string;
  other_commitments: string;
  commitment_level: string;
  nda_agreed: boolean;
}

export interface ValidationError {
  field: keyof ApplicationFormData | "id_image";
  message: string;
}

export const MARITAL_OPTIONS = [
  "Single",
  "Married",
  "Separated",
  "Widowed",
  "Prefer not to say",
] as const;

export const COMMITMENT_LEVELS = [
  { value: "none", label: "None", sub: "Fully available" },
  { value: "minor", label: "Minor", sub: "Rarely conflicts" },
  { value: "moderate", label: "Moderate", sub: "Some fixed hours" },
  { value: "major", label: "Major", sub: "Significant limits" },
] as const;

export const initialFormData: ApplicationFormData = {
  full_name: "",
  phone: "",
  date_of_birth: "",
  marital_status: "",
  available_weekends: false,
  available_evenings: false,
  on_call_emergencies: false,
  has_drivers_license: false,
  startup_mindset: false,
  has_second_job: false,
  second_job_details: "",
  other_commitments: "",
  commitment_level: "",
  nda_agreed: false,
};
