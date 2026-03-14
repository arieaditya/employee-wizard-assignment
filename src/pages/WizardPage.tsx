import { useEffect, useState } from "react";
import { useDraftAutosave, loadDraft, clearDraft } from "../hooks/useDraft";
import { type Role as UserRole, useRole } from "../hooks/useRole";
import BasicInfoStep from "../components/BasicInfoStep";
import type { BasicInfoForm } from "../types/employee";
import type { DetailsForm } from "../types/employee";
import DetailsStep from "../components/DetailsStep";
import { generateEmployeeId } from "../utils/employeeId";
import { countEmployeesByDepartment } from "../services/basicInfoApi";
import { useNavigate } from "react-router-dom";
import { postBasicInfo } from "../services/basicInfoApi";
import { postDetails } from "../services/detailsApi";
import { type SubmitState } from "../components/ProgressLog";

const WizardPage = () => {
  const navigate = useNavigate();
  const role = useRole();
  const [step, setStep] = useState<1 | 2>(role === "admin" ? 1 : 2);
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    basicInfo: "idle",
    details: "idle",
    done: false,
    error: null,
  });

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

  const goNextFromStep1 = () => {
    if (role === "admin") setStep(2);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitState({
      basicInfo: "pending",
      details: "idle",
      done: false,
      error: null,
    });

    try {
      // Build payloads
      const basicPayload = {
        fullName: basicInfo.fullName,
        email: basicInfo.email,
        department: basicInfo.department,
      };

      const detailsPayload = {
        email: basicInfo.email, // shared identifier (or use employeeId)
        role: details.role,
        employeeId: details.employeeId,
        employmentType: details.employmentType,
        location: details.location,
        photoBase64: details.photoBase64,
        notes: details.notes,
      };

      // 1) POST basicInfo (with internal ~3s delay in api helper)
      await postBasicInfo(basicPayload);
      setSubmitState((prev) => ({ ...prev, basicInfo: "success" }));

      // 2) POST details
      setSubmitState((prev) => ({ ...prev, details: "pending" }));
      await postDetails(detailsPayload);
      setSubmitState((prev) => ({ ...prev, details: "success", done: true }));

      // 3) Redirect to /employees
      setTimeout(() => navigate("/employees"), 500);
    } catch (e) {
      console.error(e);
      setSubmitState((prev) => ({
        ...prev,
        error: "Failed to submit data",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  // When component mounts or role changes, load draft
  useEffect(() => {
    const draft = loadDraft(role as UserRole) as {
      basicInfo: BasicInfoForm;
      details: DetailsForm;
    } | null;

    if (draft) {
      setBasicInfo(draft.basicInfo);
      setDetails(draft.details);
    }
  }, [role]);

  // Build combined object for autosave
  const combinedDraft = { basicInfo, details };

  // Hook to auto-save every 2 seconds of inactivity
  useDraftAutosave(role as UserRole, combinedDraft);

  const handleClearDraft = () => {
    clearDraft(role as UserRole);
    setBasicInfo({
      fullName: "",
      email: "",
      department: "",
    });
    setDetails({
      role: "",
      employeeId: "",
      employmentType: "",
      location: "",
      photoBase64: "",
      notes: "",
    });
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
          submitState={submitState}
          submitting={submitting}
        />
      )}

      <button type="button" onClick={handleClearDraft}>
        Clear Draft ({role})
      </button>
    </main>
  );
};

export default WizardPage;
