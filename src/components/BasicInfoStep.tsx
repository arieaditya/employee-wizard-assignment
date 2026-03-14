import type { BasicInfoForm } from "../types/employee";

type Props = {
  value: BasicInfoForm;
  onChange: (value: BasicInfoForm) => void;
  onNext: () => void;
};

const BasicInfoStep = ({ value, onChange, onNext }: Props) => {
  const isValid =
    value.fullName.trim().length > 0 &&
    value.email.trim().length > 0 &&
    value.department.trim().length > 0;

  const handleChange =
    (field: keyof BasicInfoForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };

  return (
    <section>
      <h2>Step 1 – Basic Info</h2>

      <label>
        Full Name
        <input
          type="text"
          value={value.fullName}
          onChange={handleChange("fullName")}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={value.email}
          onChange={handleChange("email")}
        />
      </label>

      <label>
        Department
        <input
          type="text"
          value={value.department}
          onChange={handleChange("department")}
        />
      </label>

      <button onClick={onNext} disabled={!isValid}>
        Next
      </button>
    </section>
  );
};

export default BasicInfoStep;
