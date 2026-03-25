import { ApplicationFormData as FormData } from "../types/form";
import Toggle from "./Toggle";
import shared from "../styles/shared.module.css";
import toggleStyles from "../styles/Toggle.module.css";

interface AvailabilityProps {
  form: FormData;
  onChange: (key: keyof FormData, value: boolean) => void;
}

export default function Availability({ form, onChange }: AvailabilityProps) {
  return (
    <div className={shared.section}>
      <div className={shared.sectionLabel}>
        Availability &amp; Qualifications
        <div className={shared.sectionLabelLine} />
      </div>
      <div className={toggleStyles.togglesGrid}>
        <Toggle
          checked={form.available_weekends}
          onChange={(v) => onChange("available_weekends", v)}
          label="Available Weekends"
          sub="Sat & Sun when needed"
          id="available_weekends"
        />
        <Toggle
          checked={form.available_evenings}
          onChange={(v) => onChange("available_evenings", v)}
          label="Available Evenings"
          sub="After 6pm weekdays"
          id="available_evenings"
        />
        <Toggle
          checked={form.on_call_emergencies}
          onChange={(v) => onChange("on_call_emergencies", v)}
          label="On-Call for Emergencies"
          sub="Reachable outside hours"
          id="on_call_emergencies"
        />
        <Toggle
          checked={form.has_drivers_license}
          onChange={(v) => onChange("has_drivers_license", v)}
          label="Valid Driver's License"
          sub="Current & active"
          id="has_drivers_license"
        />
        <div className={toggleStyles.togglesGridFull}>
          <Toggle
            checked={form.startup_mindset}
            onChange={(v) => onChange("startup_mindset", v)}
            label="Comfortable in a fast-changing startup environment"
            sub="Priorities shift quickly — sometimes within the same day"
            id="startup_mindset"
          />
        </div>
      </div>
    </div>
  );
}
