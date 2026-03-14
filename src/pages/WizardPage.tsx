import { useState } from "react";
import { useRole } from "../hooks/useRole";

const WizardPage = () => {
  const role = useRole();
  const [step, setStep] = useState<1 | 2>(role === "admin" ? 1 : 2);

  const goNext = () => {
    if (role === "admin" && step === 1) setStep(2);
  };

  return (
    <main>
      <h1>Employee Wizard ({role})</h1>
      {role === "admin" && step === 1 && (
        <section>
          <h2>Step 1 – Basic Info</h2>
          {/* BasicInfoStep will go here */}
          <button onClick={goNext}>Next</button>
        </section>
      )}
      {step === 2 && (
        <section>
          <h2>Step 2 – Details & Submit</h2>
          {/* DetailsStep will go here */}
        </section>
      )}
    </main>
  );
};

export default WizardPage;
