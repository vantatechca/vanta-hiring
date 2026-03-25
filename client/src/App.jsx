import { useState, useRef } from "react";

const MARITAL_OPTIONS = ["Single", "Married", "Separated", "Widowed", "Prefer not to say"];

const styles = {
  page: {
    minHeight: "100vh",
    padding: "48px 20px 80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    maxWidth: 640,
    marginBottom: 40,
  },
  badge: {
    display: "inline-block",
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--accent)",
    background: "var(--accent-light)",
    border: "1px solid #f2c4ba",
    borderRadius: 4,
    padding: "3px 10px",
    marginBottom: 16,
  },
  title: {
    fontFamily: "var(--sans)",
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: 700,
    lineHeight: 1.15,
    color: "var(--text)",
    marginBottom: 10,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 15,
    color: "var(--text2)",
    lineHeight: 1.6,
    maxWidth: 520,
  },
  card: {
    width: "100%",
    maxWidth: 640,
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    boxShadow: "var(--shadow)",
    overflow: "hidden",
  },
  section: {
    padding: "28px 32px",
    borderBottom: "1px solid var(--border)",
  },
  sectionLast: {
    padding: "28px 32px",
  },
  sectionLabel: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--text3)",
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  sectionLabelLine: {
    flex: 1,
    height: 1,
    background: "var(--border)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  fieldGroupFull: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    gridColumn: "1 / -1",
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text2)",
    letterSpacing: "0.02em",
  },
  labelRequired: {
    color: "var(--accent)",
    marginLeft: 2,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    fontFamily: "var(--sans)",
    background: "var(--bg)",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    outline: "none",
    transition: "border-color .15s, box-shadow .15s",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    fontFamily: "var(--sans)",
    background: "var(--bg)",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239e9890' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
  },
  uploadZone: (isDragging, hasFile) => ({
    border: `2px dashed ${isDragging ? "var(--accent)" : hasFile ? "#2d6a4f" : "var(--border2)"}`,
    borderRadius: "var(--radius)",
    padding: "24px 20px",
    textAlign: "center",
    background: isDragging ? "var(--accent-light)" : hasFile ? "var(--green-light)" : "var(--bg)",
    cursor: "pointer",
    transition: "all .2s",
    position: "relative",
  }),
  uploadIcon: {
    fontSize: 28,
    marginBottom: 8,
    display: "block",
  },
  uploadText: {
    fontSize: 13,
    color: "var(--text2)",
    lineHeight: 1.5,
  },
  uploadFileName: {
    fontFamily: "var(--mono)",
    fontSize: 12,
    color: "var(--green)",
    fontWeight: 500,
    marginTop: 4,
  },
  togglesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  toggle: (checked) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 14px",
    border: `1.5px solid ${checked ? "#2d6a4f" : "var(--border)"}`,
    borderRadius: "var(--radius)",
    background: checked ? "var(--green-light)" : "var(--bg)",
    cursor: "pointer",
    transition: "all .15s",
    userSelect: "none",
  }),
  toggleBox: (checked) => ({
    width: 18,
    height: 18,
    border: `2px solid ${checked ? "var(--green)" : "var(--border2)"}`,
    borderRadius: 4,
    background: checked ? "var(--green)" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
    transition: "all .15s",
  }),
  toggleCheck: {
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
  },
  toggleLabel: (checked) => ({
    fontSize: 13,
    fontWeight: 500,
    color: checked ? "var(--green)" : "var(--text)",
    lineHeight: 1.4,
  }),
  toggleSub: {
    fontSize: 11,
    color: "var(--text3)",
    marginTop: 1,
  },
  ndaBox: (checked) => ({
    padding: "16px 18px",
    border: `1.5px solid ${checked ? "#c84b31" : "var(--border)"}`,
    borderRadius: "var(--radius)",
    background: checked ? "var(--accent-light)" : "var(--bg)",
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    cursor: "pointer",
    transition: "all .15s",
    userSelect: "none",
  }),
  ndaCheckBox: (checked) => ({
    width: 20,
    height: 20,
    border: `2px solid ${checked ? "var(--accent)" : "var(--border2)"}`,
    borderRadius: 4,
    background: checked ? "var(--accent)" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
    transition: "all .15s",
  }),
  ndaText: {
    fontSize: 13,
    color: "var(--text2)",
    lineHeight: 1.55,
  },
  ndaTextStrong: {
    fontWeight: 600,
    color: "var(--text)",
  },
  submitArea: {
    padding: "24px 32px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    background: "#fafaf9",
  },
  submitNote: {
    fontSize: 12,
    color: "var(--text3)",
    lineHeight: 1.5,
    flex: 1,
  },
  submitBtn: (loading) => ({
    fontFamily: "var(--sans)",
    fontWeight: 600,
    fontSize: 14,
    padding: "12px 32px",
    background: loading ? "var(--border2)" : "var(--text)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius)",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all .15s",
    letterSpacing: "-0.2px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
  }),
  errorBox: {
    padding: "12px 16px",
    background: "var(--accent-light)",
    border: "1px solid #f2c4ba",
    borderRadius: "var(--radius)",
    fontSize: 13,
    color: "var(--accent)",
    marginBottom: 16,
  },
  successPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    textAlign: "center",
  },
  successIcon: {
    width: 72,
    height: 72,
    background: "var(--green-light)",
    border: "2px solid var(--green)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: "var(--sans)",
    fontSize: 28,
    fontWeight: 700,
    color: "var(--text)",
    marginBottom: 12,
    letterSpacing: "-0.3px",
  },
  successSub: {
    fontSize: 15,
    color: "var(--text2)",
    maxWidth: 400,
    lineHeight: 1.6,
  },
};

function Toggle({ checked, onChange, label, sub }) {
  return (
    <div style={styles.toggle(checked)} onClick={() => onChange(!checked)}>
      <div style={styles.toggleBox(checked)}>
        {checked && <span style={styles.toggleCheck}>✓</span>}
      </div>
      <div>
        <div style={styles.toggleLabel(checked)}>{label}</div>
        {sub && <div style={styles.toggleSub}>{sub}</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({
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
  });
  const [idFile, setIdFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setIdFile(file);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.full_name.trim()) return setError("Full name is required.");
    if (!form.phone.trim()) return setError("Phone number is required.");
    if (!form.date_of_birth) return setError("Date of birth is required.");
    if (!form.nda_agreed) return setError("You must agree to the NDA terms to continue.");

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (idFile) data.append("id_image", idFile);

      const res = await fetch("/api/apply", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused) => ({
    ...styles.input,
    borderColor: focused ? "var(--text)" : "var(--border)",
    boxShadow: focused ? "0 0 0 3px rgba(26,23,20,0.06)" : "none",
  });

  if (submitted) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successIcon}>✓</div>
        <div style={styles.successTitle}>Application received!</div>
        <p style={styles.successSub}>
          Thank you for completing the form. We'll review your information and reach out to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.badge}>Hiring Application</div>
        <h1 style={styles.title}>Let's get to know you</h1>
        <p style={styles.subtitle}>
          Please fill out this form carefully and honestly. All information is kept confidential and used only for employment screening.
        </p>
      </div>

      <div style={styles.card}>
        {/* Personal Info */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>
            Personal Information
            <div style={styles.sectionLabelLine} />
          </div>
          <div style={styles.grid}>
            <div style={styles.fieldGroupFull}>
              <label style={styles.label}>Full Name <span style={styles.labelRequired}>*</span></label>
              <input
                style={inputStyle(false)}
                type="text"
                placeholder="e.g. Maria Santos"
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "var(--text)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Phone Number <span style={styles.labelRequired}>*</span></label>
              <input
                style={inputStyle(false)}
                type="tel"
                placeholder="e.g. +1 416 555 0192"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "var(--text)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Date of Birth <span style={styles.labelRequired}>*</span></label>
              <input
                style={inputStyle(false)}
                type="date"
                value={form.date_of_birth}
                onChange={(e) => set("date_of_birth", e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "var(--text)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Marital Status</label>
              <select
                style={styles.select}
                value={form.marital_status}
                onChange={(e) => set("marital_status", e.target.value)}
              >
                <option value="">Select status...</option>
                {MARITAL_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ID Upload */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>
            Government ID — Background Check
            <div style={styles.sectionLabelLine} />
          </div>
          <div
            style={styles.uploadZone(isDragging, !!idFile)}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <span style={styles.uploadIcon}>{idFile ? "🪪" : "📎"}</span>
            {idFile ? (
              <>
                <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                  File attached
                </div>
                <div style={styles.uploadFileName}>{idFile.name}</div>
              </>
            ) : (
              <div style={styles.uploadText}>
                Drag & drop your government-issued ID here, or{" "}
                <strong style={{ color: "var(--text)" }}>click to browse</strong>
                <br />
                <span style={{ fontSize: 12, color: "var(--text3)" }}>
                  JPG, PNG, WEBP — max 5MB
                </span>
              </div>
            )}
          </div>
          {idFile && (
            <button
              onClick={(e) => { e.stopPropagation(); setIdFile(null); }}
              style={{
                marginTop: 8, fontSize: 11, color: "var(--text3)", background: "none",
                border: "none", cursor: "pointer", fontFamily: "var(--mono)", padding: 0,
              }}
            >
              × Remove file
            </button>
          )}
        </div>

        {/* Availability & Qualifications */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>
            Availability & Qualifications
            <div style={styles.sectionLabelLine} />
          </div>
          <div style={styles.togglesGrid}>
            <Toggle
              checked={form.available_weekends}
              onChange={(v) => set("available_weekends", v)}
              label="Available Weekends"
              sub="Sat & Sun when needed"
            />
            <Toggle
              checked={form.available_evenings}
              onChange={(v) => set("available_evenings", v)}
              label="Available Evenings"
              sub="After 6pm weekdays"
            />
            <Toggle
              checked={form.on_call_emergencies}
              onChange={(v) => set("on_call_emergencies", v)}
              label="On-Call for Emergencies"
              sub="Reachable outside hours"
            />
            <Toggle
              checked={form.has_drivers_license}
              onChange={(v) => set("has_drivers_license", v)}
              label="Valid Driver's License"
              sub="Current & active"
            />
            <div style={{ gridColumn: "1 / -1" }}>
              <Toggle
                checked={form.startup_mindset}
                onChange={(v) => set("startup_mindset", v)}
                label="Comfortable in a fast-changing startup environment"
                sub="Priorities shift quickly — sometimes within the same day"
              />
            </div>
          </div>
        </div>

        {/* Other Commitments & Second Job */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>
            Other Commitments & Second Job
            <div style={styles.sectionLabelLine} />
          </div>

          {/* Second job toggle */}
          <div style={{ marginBottom: 14 }}>
            <Toggle
              checked={form.has_second_job}
              onChange={(v) => set("has_second_job", v)}
              label="Currently has a second job or freelance work"
              sub="Employment, contract, or regular paid side work"
            />
          </div>

          {/* Second job details — shown only if toggled on */}
          {form.has_second_job && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ ...styles.fieldGroup, marginBottom: 0 }}>
                <label style={styles.label}>Describe the second job / freelance work</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Part-time cashier at 7-Eleven, Fri–Sat evenings / Freelance graphic design on weekends"
                  value={form.second_job_details}
                  onChange={(e) => set("second_job_details", e.target.value)}
                  style={{
                    ...styles.input,
                    resize: "vertical",
                    minHeight: 64,
                    fontFamily: "var(--sans)",
                    lineHeight: 1.5,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--text)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>
          )}

          {/* Other commitments */}
          <div style={{ marginBottom: 14 }}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Other commitments (school, caregiving, regular events, etc.)</label>
              <textarea
                rows={2}
                placeholder="e.g. Enrolled in online course Mon & Wed evenings / Primary caregiver for parent on weekends"
                value={form.other_commitments}
                onChange={(e) => set("other_commitments", e.target.value)}
                style={{
                  ...styles.input,
                  resize: "vertical",
                  minHeight: 64,
                  fontFamily: "var(--sans)",
                  lineHeight: 1.5,
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--text)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          {/* Commitment level */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Overall, how would you rate your outside commitments?</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
              {[
                { value: "none", label: "None", sub: "Fully available" },
                { value: "minor", label: "Minor", sub: "Rarely conflicts" },
                { value: "moderate", label: "Moderate", sub: "Some fixed hours" },
                { value: "major", label: "Major", sub: "Significant limits" },
              ].map(({ value, label, sub }) => {
                const active = form.commitment_level === value;
                const colors = {
                  none: { bg: "#edf6f1", border: "#2d6a4f", text: "#2d6a4f" },
                  minor: { bg: "#fffbeb", border: "#d97706", text: "#92400e" },
                  moderate: { bg: "#fff7ed", border: "#ea580c", text: "#9a3412" },
                  major: { bg: "#fdf2f8", border: "#c026d3", text: "#86198f" },
                };
                const c = colors[value];
                return (
                  <div
                    key={value}
                    onClick={() => set("commitment_level", value)}
                    style={{
                      flex: "1 1 80px",
                      padding: "10px 12px",
                      border: `1.5px solid ${active ? c.border : "var(--border)"}`,
                      borderRadius: "var(--radius)",
                      background: active ? c.bg : "var(--bg)",
                      cursor: "pointer",
                      transition: "all .15s",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: active ? c.text : "var(--text)" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 11, color: active ? c.text : "var(--text3)", marginTop: 2, opacity: active ? 0.8 : 1 }}>
                      {sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* NDA */}
        <div style={styles.sectionLast}>
          <div style={styles.sectionLabel}>
            Confidentiality Agreement
            <div style={styles.sectionLabelLine} />
          </div>
          <div style={styles.ndaBox(form.nda_agreed)} onClick={() => set("nda_agreed", !form.nda_agreed)}>
            <div style={styles.ndaCheckBox(form.nda_agreed)}>
              {form.nda_agreed && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={styles.ndaText}>
              <span style={styles.ndaTextStrong}>I agree to sign a Non-Disclosure Agreement (NDA)</span> if offered employment.
              I understand that all business information, client data, product details, and internal operations
              I become aware of are strictly confidential and must not be shared with any third party, during or after employment.
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={styles.submitArea}>
          <div style={styles.submitNote}>
            {error ? (
              <span style={{ color: "var(--accent)", fontWeight: 500 }}>⚠ {error}</span>
            ) : (
              "By submitting, you confirm all information provided is accurate and truthful."
            )}
          </div>
          <button style={styles.submitBtn(loading)} onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
                Submitting…
              </>
            ) : (
              "Submit Application →"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
        @media (max-width: 560px) {
          .grid, .togglesGrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
