import { ApplicationFormData as FormData, ValidationError } from "../types/form";

const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'.,-]{2,100}$/;

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  const now = new Date();
  const age = now.getFullYear() - date.getFullYear();
  const monthDiff = now.getMonth() - date.getMonth();
  const dayDiff = now.getDate() - date.getDate();
  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

  return actualAge >= 16 && actualAge <= 120;
}

export function validateForm(
  form: FormData,
  idFile: File | null
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!form.full_name.trim()) {
    errors.push({ field: "full_name", message: "Full name is required." });
  } else if (!NAME_REGEX.test(form.full_name.trim())) {
    errors.push({
      field: "full_name",
      message: "Please enter a valid name (letters, spaces, hyphens only).",
    });
  }

  if (!form.phone.trim()) {
    errors.push({ field: "phone", message: "Phone number is required." });
  } else if (!PHONE_REGEX.test(form.phone.trim())) {
    errors.push({
      field: "phone",
      message:
        "Please enter a valid phone number (7-20 digits, may include +, spaces, dashes).",
    });
  }

  if (!form.date_of_birth) {
    errors.push({
      field: "date_of_birth",
      message: "Date of birth is required.",
    });
  } else if (!isValidDate(form.date_of_birth)) {
    errors.push({
      field: "date_of_birth",
      message: "Please enter a valid date of birth (applicant must be 16-120).",
    });
  }

  if (idFile && idFile.size > 5 * 1024 * 1024) {
    errors.push({ field: "id_image", message: "Image must be under 5MB." });
  }

  if (!form.nda_agreed) {
    errors.push({
      field: "nda_agreed",
      message: "You must agree to the NDA terms to continue.",
    });
  }

  return errors;
}

export function validatePhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

export function validateName(name: string): boolean {
  return NAME_REGEX.test(name.trim());
}
