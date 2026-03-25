import styles from "../styles/Toggle.module.css";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  sub?: string;
  id?: string;
}

export default function Toggle({ checked, onChange, label, sub, id }: ToggleProps) {
  return (
    <div
      className={`${styles.toggle} ${checked ? styles.toggleChecked : ""}`}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      tabIndex={0}
      id={id}
    >
      <div className={`${styles.toggleBox} ${checked ? styles.toggleBoxChecked : ""}`}>
        {checked && <span className={styles.toggleCheck} aria-hidden="true">✓</span>}
      </div>
      <div>
        <div className={`${styles.toggleLabel} ${checked ? styles.toggleLabelChecked : ""}`}>
          {label}
        </div>
        {sub && <div className={styles.toggleSub}>{sub}</div>}
      </div>
    </div>
  );
}
