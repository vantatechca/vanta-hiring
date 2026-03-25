import styles from "../styles/Success.module.css";

export default function SuccessPage() {
  return (
    <div className={styles.successPage} role="status" aria-live="polite">
      <div className={styles.successIcon} aria-hidden="true">
        ✓
      </div>
      <h1 className={styles.successTitle}>Application received!</h1>
      <p className={styles.successSub}>
        Thank you for completing the form. We'll review your information and reach out to you
        shortly.
      </p>
    </div>
  );
}
