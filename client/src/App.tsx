import { useState } from "react";
import { ApplicationFormData, ValidationError, initialFormData } from "./types/form";
import { validateForm } from "./utils/validation";
import PersonalInfo from "./components/PersonalInfo";
import IdUpload from "./components/IdUpload";
import Availability from "./components/Availability";
import Commitments from "./components/Commitments";
import NDASection from "./components/NDASection";
import SubmitSection from "./components/SubmitSection";
import SuccessPage from "./components/SuccessPage";
import styles from "./styles/App.module.css";

export default function App() {
  const [form, setForm] = useState<ApplicationFormData>(initialFormData);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationError[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof ApplicationFormData, val: ApplicationFormData[keyof ApplicationFormData]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setError("");
    const errors = validateForm(form, idFile);
    setFieldErrors(errors);

    if (errors.length > 0) {
      setError(errors[0].message);
      const firstErrorField = document.getElementById(errors[0].field);
      firstErrorField?.focus();
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, String(v)));
      if (idFile) data.append("id_image", idFile);

      const res = await fetch("/api/apply", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <SuccessPage />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.badge}>Hiring Application</div>
        <h1 className={styles.title}>Let's get to know you</h1>
        <p className={styles.subtitle}>
          Please fill out this form carefully and honestly. All information is kept confidential and
          used only for employment screening.
        </p>
      </header>

      <main className={styles.card} role="form" aria-label="Hiring application form">
        <PersonalInfo form={form} onChange={set} errors={fieldErrors} />
        <IdUpload idFile={idFile} onFileChange={setIdFile} onError={setError} />
        <Availability form={form} onChange={set} />
        <Commitments form={form} onChange={set} />
        <NDASection agreed={form.nda_agreed} onChange={(v) => set("nda_agreed", v)} errors={fieldErrors} />
        <SubmitSection loading={loading} error={error} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
