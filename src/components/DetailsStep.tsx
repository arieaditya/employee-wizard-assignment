import type { DetailsForm, BasicInfoForm } from "../types/employee";
import { ROLE_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from "../constants/options";
import { useAutocomplete } from "../hooks/useAutoComplete";
import { fetchLocations } from "../services/detailsApi";
import AsyncAutocomplete from "../components/AsyncAutoComplete";
import PhotoUpload from "./PhotoUpload";
import ProgressLog, { type SubmitState } from "./ProgressLog";
import s from "./DetailsStep.module.css";

type Props = {
  basicInfo: BasicInfoForm;
  value: DetailsForm;
  onChange: (value: DetailsForm) => void;
  onSubmit: () => void;
  submitState: SubmitState;
  submitting: boolean;
};

type Location = { id: number; name: string };

const DetailsStep = ({
  basicInfo,
  value,
  onChange,
  onSubmit,
  submitState,
  submitting,
}: Props) => {
  const email = basicInfo.email;
  const fullName = basicInfo.fullName;

  const { setQuery, results, loading, error } =
    useAutocomplete<Location>(fetchLocations);

  const handleChange =
    (field: keyof DetailsForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      onChange({ ...value, [field]: e.target.value });
    };

  const handleLocationChange = (loc: string) => {
    onChange({ ...value, location: loc });
  };

  const emailValid = /\S+@\S+\.\S+/.test(email);

  const isValid =
    fullName.trim().length > 0 &&
    emailValid &&
    value.role &&
    value.employmentType &&
    value.location.trim().length > 0;

  return (
    <section className={s["c-details"]}>
      <h2 className={s["c-details__heading"]}>Step 2 – Details</h2>

      <div className={s["c-details__identity"]}>
        <label>
          Full Name
          <input type="text" value={fullName} readOnly />
        </label>

        <label>
          Email
          <input type="email" value={email} readOnly />
          {!emailValid && (
            <span className={s["c-details__error"]}>Invalid email</span>
          )}
        </label>
      </div>

      <div className={s["c-details__grid"]}>
        <label>
          Role
          <select value={value.role} onChange={handleChange("role")}>
            <option value="">Select role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label>
          Employee ID
          <input type="text" value={value.employeeId} readOnly />
        </label>

        <label>
          Employment Type
          <select
            value={value.employmentType}
            onChange={handleChange("employmentType")}>
            <option value="">Select type</option>
            {EMPLOYMENT_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <AsyncAutocomplete<Location>
          label="Office Location"
          value={value.location}
          onChange={handleLocationChange}
          displayKey="name"
          suggestions={results}
          loading={loading}
          error={error}
          onQueryChange={setQuery}
        />
      </div>

      <PhotoUpload
        value={value.photoBase64}
        onChange={(base64) => onChange({ ...value, photoBase64: base64 })}
      />

      <label>
        Notes
        <textarea value={value.notes} onChange={handleChange("notes")} />
      </label>

      <button
        className={s["c-details__submit"]}
        onClick={onSubmit}
        disabled={!isValid || submitting}>
        {submitting ? "Submitting…" : "Submit"}
      </button>

      <ProgressLog state={submitState} />
    </section>
  );
};

export default DetailsStep;
