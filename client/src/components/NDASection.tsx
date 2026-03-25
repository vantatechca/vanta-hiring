import { ValidationError } from "../types/form";
import shared from "../styles/shared.module.css";
import styles from "../styles/NDA.module.css";

interface NDASectionProps {
  agreed: boolean;
  onChange: (value: boolean) => void;
  errors: ValidationError[];
}

export default function NDASection({ agreed, onChange, errors }: NDASectionProps) {
  const ndaError = errors.find((e) => e.field === "nda_agreed")?.message;

  return (
    <div className={shared.sectionLast}>
      <div className={shared.sectionLabel}>
        Confidentiality Agreement
        <div className={shared.sectionLabelLine} />
      </div>
      <div
        className={`${styles.ndaBox} ${agreed ? styles.ndaBoxChecked : ""}`}
        onClick={() => onChange(!agreed)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!agreed);
          }
        }}
        role="checkbox"
        aria-checked={agreed}
        aria-required="true"
        aria-invalid={!!ndaError}
        aria-describedby={ndaError ? "nda_error" : undefined}
        aria-label="NDA agreement"
        tabIndex={0}
      >
        <div className={`${styles.ndaCheckBox} ${agreed ? styles.ndaCheckBoxChecked : ""}`}>
          {agreed && (
            <span className={styles.ndaCheckMark} aria-hidden="true">
              ✓
            </span>
          )}
        </div>
        <div className={styles.ndaText}>
          <span className={styles.ndaTextStrong}>
            I agree to sign a Non-Disclosure Agreement (NDA)
          </span>{" "}
          if offered employment. I understand that all business information, client data, product
          details, and internal operations I become aware of are strictly confidential and must not
          be shared with any third party, during or after employment.
        </div>
      </div>
      {ndaError && (
        <span id="nda_error" className={shared.fieldError} role="alert">
          {ndaError}
        </span>
      )}
    </div>
  );
}
