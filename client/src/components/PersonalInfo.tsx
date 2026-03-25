import { ApplicationFormData as FormData, MARITAL_OPTIONS, ValidationError } from "../types/form";
import shared from "../styles/shared.module.css";

interface PersonalInfoProps {
  form: FormData;
  onChange: (key: keyof FormData, value: string) => void;
  errors: ValidationError[];
}

function fieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

export default function PersonalInfo({ form, onChange, errors }: PersonalInfoProps) {
  const nameError = fieldError(errors, "full_name");
  const phoneError = fieldError(errors, "phone");
  const dobError = fieldError(errors, "date_of_birth");

  return (
    <div className={shared.section}>
      <div className={shared.sectionLabel}>
        Personal Information
        <div className={shared.sectionLabelLine} />
      </div>
      <div className={shared.grid}>
        <div className={shared.fieldGroupFull}>
          <label htmlFor="full_name" className={shared.label}>
            Full Name <span className={shared.labelRequired}>*</span>
          </label>
          <input
            id="full_name"
            className={`${shared.input} ${nameError ? shared.inputError : ""}`}
            type="text"
            placeholder="e.g. Maria Santos"
            value={form.full_name}
            onChange={(e) => onChange("full_name", e.target.value)}
            aria-required="true"
            aria-invalid={!!nameError}
            aria-describedby={nameError ? "full_name_error" : undefined}
            autoComplete="name"
          />
          {nameError && (
            <span id="full_name_error" className={shared.fieldError} role="alert">
              {nameError}
            </span>
          )}
        </div>
        <div className={shared.fieldGroup}>
          <label htmlFor="phone" className={shared.label}>
            Phone Number <span className={shared.labelRequired}>*</span>
          </label>
          <input
            id="phone"
            className={`${shared.input} ${phoneError ? shared.inputError : ""}`}
            type="tel"
            placeholder="e.g. +1 416 555 0192"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            aria-required="true"
            aria-invalid={!!phoneError}
            aria-describedby={phoneError ? "phone_error" : undefined}
            autoComplete="tel"
          />
          {phoneError && (
            <span id="phone_error" className={shared.fieldError} role="alert">
              {phoneError}
            </span>
          )}
        </div>
        <div className={shared.fieldGroup}>
          <label htmlFor="date_of_birth" className={shared.label}>
            Date of Birth <span className={shared.labelRequired}>*</span>
          </label>
          <input
            id="date_of_birth"
            className={`${shared.input} ${dobError ? shared.inputError : ""}`}
            type="date"
            value={form.date_of_birth}
            onChange={(e) => onChange("date_of_birth", e.target.value)}
            aria-required="true"
            aria-invalid={!!dobError}
            aria-describedby={dobError ? "dob_error" : undefined}
            autoComplete="bday"
          />
          {dobError && (
            <span id="dob_error" className={shared.fieldError} role="alert">
              {dobError}
            </span>
          )}
        </div>
        <div className={shared.fieldGroup}>
          <label htmlFor="marital_status" className={shared.label}>
            Marital Status
          </label>
          <select
            id="marital_status"
            className={shared.select}
            value={form.marital_status}
            onChange={(e) => onChange("marital_status", e.target.value)}
          >
            <option value="">Select status...</option>
            {MARITAL_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
