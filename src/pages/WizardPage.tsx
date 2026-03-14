import { useEffect, useState } from "react";
import { useRole } from "../hooks/useRole";
import BasicInfoStep from "../components/BasicInfoStep";
import type { BasicInfoForm } from "../types/employee";
import type { DetailsForm } from "../types/employee";
import DetailsStep from "../components/DetailsStep";
import { generateEmployeeId } from "../utils/employeeId";
import { countEmployeesByDepartment } from "../services/basicInfoApi";

const WizardPage = () => {
  const role = useRole();
  const [step, setStep] = useState<1 | 2>(role === "admin" ? 1 : 2);

  const [basicInfo, setBasicInfo] = useState<BasicInfoForm>({
    fullName: "",
    email: "",
    department: "",
  });

  const [details, setDetails] = useState<DetailsForm>({
    role: "",
    employeeId: "",
    employmentType: "",
    location: "",
    photoBase64: "",
    notes: "",
  });

  const handleSubmit = () => {
    // will later call POST basicInfo/details and redirect
    console.log("submit clicked");
  };

  const goNextFromStep1 = () => {
    if (role === "admin") setStep(2);
  };

  useEffect(() => {
    const dept = basicInfo.department.trim();
    if (!dept) return;

    let cancelled = false;

    const run = async () => {
      try {
        const count = await countEmployeesByDepartment(dept);
        if (!cancelled) {
          const id = generateEmployeeId(dept, count);
          setDetails((prev) => ({ ...prev, employeeId: id }));
        }
      } catch (e) {
        console.error(e);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [basicInfo.department]);

  return (
    <main>
      <h1>Employee Wizard ({role})</h1>

      {role === "admin" && step === 1 && (
        <BasicInfoStep
          value={basicInfo}
          onChange={setBasicInfo}
          onNext={goNextFromStep1}
        />
      )}

      {step === 2 && (
        <DetailsStep
          basicInfo={basicInfo}
          value={details}
          onChange={setDetails}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
};

export default WizardPage;
