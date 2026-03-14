import type { BasicInfoForm } from "../types/employee";
import { useAutocomplete } from "../hooks/useAutoComplete";
import { fetchDepartments } from "../services/basicInfoApi";
import AsyncAutocomplete from "../components/AsyncAutoComplete";
import s from "./BasicInfoStep.module.css";

type Department = { id: number; name: string };

type Props = {
  value: BasicInfoForm;
  onChange: (value: BasicInfoForm) => void;
  onNext: () => void;
};

const BasicInfoStep = ({ value, onChange, onNext }: Props) => {
  const { setQuery, results, loading, error } =
    useAutocomplete<Department>(fetchDepartments);

  const isValid =
    value.fullName.trim().length > 0 &&
    value.email.trim().length > 0 &&
    value.department.trim().length > 0;

  const handleFieldChange =
    (field: keyof BasicInfoForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };

  const handleDepartmentChange = (deptName: string) => {
    onChange({ ...value, department: deptName });
  };

  return (
    <section className={s["c-basicInfo"]}>
      <h2 className={s["c-basicInfo__heading"]}>Step 1 – Basic Info</h2>

      <div className={s["c-basicInfo__fields"]}>
        <label>
          Full Name
          <input
            type="text"
            value={value.fullName}
            onChange={handleFieldChange("fullName")}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={value.email}
            onChange={handleFieldChange("email")}
          />
        </label>

        <AsyncAutocomplete<Department>
          label="Department"
          value={value.department}
          onChange={handleDepartmentChange}
          displayKey="name"
          suggestions={results}
          loading={loading}
          error={error}
          onQueryChange={setQuery}
        />
      </div>

      <button
        className={s["c-basicInfo__next"]}
        onClick={onNext}
        disabled={!isValid}>
        Next
      </button>
    </section>
  );
};

export default BasicInfoStep;
