import styles from "../styles/Submit.module.css";

interface SubmitSectionProps {
  loading: boolean;
  error: string;
  onSubmit: () => void;
}

export default function SubmitSection({ loading, error, onSubmit }: SubmitSectionProps) {
  return (
    <div className={styles.submitArea}>
      <div className={styles.submitNote}>
        {error ? (
          <span className={styles.errorText} role="alert">
            ⚠ {error}
          </span>
        ) : (
          "By submitting, you confirm all information provided is accurate and truthful."
        )}
      </div>
      <button
        className={`${styles.submitBtn} ${loading ? styles.submitBtnLoading : ""}`}
        onClick={onSubmit}
        disabled={loading}
        aria-busy={loading}
        type="button"
      >
        {loading ? (
          <>
            <span className={styles.spinner} aria-hidden="true">
              ⟳
            </span>
            Submitting…
          </>
        ) : (
          "Submit Application →"
        )}
      </button>
    </div>
  );
}
