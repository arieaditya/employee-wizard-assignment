import { useState } from "react";
import { useRole } from "../hooks/useRole";
import BasicInfoStep from "../components/BasicInfoStep";
import type { BasicInfoForm } from "../types/employee";

const WizardPage = () => {
  const role = useRole();
  const [step, setStep] = useState<1 | 2>(role === "admin" ? 1 : 2);

  const [basicInfo, setBasicInfo] = useState<BasicInfoForm>({
    fullName: "",
    email: "",
    department: "",
  });

  const goNextFromStep1 = () => {
    if (role === "admin") setStep(2);
  };

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
        <section>
          <h2>Step 2 – Details & Submit</h2>
          {/* DetailsStep will go here soon */}
        </section>
      )}
    </main>
  );
};

export default WizardPage;
