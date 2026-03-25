import { ApplicationFormData as FormData, COMMITMENT_LEVELS } from "../types/form";
import Toggle from "./Toggle";
import shared from "../styles/shared.module.css";
import styles from "../styles/Commitments.module.css";

interface CommitmentsProps {
  form: FormData;
  onChange: (key: keyof FormData, value: string | boolean) => void;
}

const LEVEL_CLASS_MAP: Record<string, string> = {
  none: styles.levelNone,
  minor: styles.levelMinor,
  moderate: styles.levelModerate,
  major: styles.levelMajor,
};

export default function Commitments({ form, onChange }: CommitmentsProps) {
  return (
    <div className={shared.section}>
      <div className={shared.sectionLabel}>
        Other Commitments &amp; Second Job
        <div className={shared.sectionLabelLine} />
      </div>

      <div className={styles.toggleWrapper}>
        <Toggle
          checked={form.has_second_job}
          onChange={(v) => onChange("has_second_job", v)}
          label="Currently has a second job or freelance work"
          sub="Employment, contract, or regular paid side work"
          id="has_second_job"
        />
      </div>

      {form.has_second_job && (
        <div className={styles.detailsWrapper}>
          <div className={shared.fieldGroup}>
            <label htmlFor="second_job_details" className={shared.label}>
              Describe the second job / freelance work
            </label>
            <textarea
              id="second_job_details"
              rows={2}
              placeholder="e.g. Part-time cashier at 7-Eleven, Fri–Sat evenings / Freelance graphic design on weekends"
              value={form.second_job_details}
              onChange={(e) => onChange("second_job_details", e.target.value)}
              className={shared.textarea}
            />
          </div>
        </div>
      )}

      <div className={styles.detailsWrapper}>
        <div className={shared.fieldGroup}>
          <label htmlFor="other_commitments" className={shared.label}>
            Other commitments (school, caregiving, regular events, etc.)
          </label>
          <textarea
            id="other_commitments"
            rows={2}
            placeholder="e.g. Enrolled in online course Mon & Wed evenings / Primary caregiver for parent on weekends"
            value={form.other_commitments}
            onChange={(e) => onChange("other_commitments", e.target.value)}
            className={shared.textarea}
          />
        </div>
      </div>

      <div className={shared.fieldGroup}>
        <label className={shared.label} id="commitment_level_label">
          Overall, how would you rate your outside commitments?
        </label>
        <div
          className={styles.levelGrid}
          role="radiogroup"
          aria-labelledby="commitment_level_label"
        >
          {COMMITMENT_LEVELS.map(({ value, label, sub }) => {
            const active = form.commitment_level === value;
            return (
              <div
                key={value}
                onClick={() => onChange("commitment_level", value)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    onChange("commitment_level", value);
                  }
                }}
                className={`${styles.levelOption} ${active ? LEVEL_CLASS_MAP[value] : ""}`}
                role="radio"
                aria-checked={active}
                tabIndex={0}
                aria-label={`${label}: ${sub}`}
              >
                <div className={styles.levelOptionLabel}>{label}</div>
                <div className={styles.levelOptionSub}>{sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
