import s from "./ProgressLog.module.css";

type StepStatus = "idle" | "pending" | "success";

export type SubmitState = {
  basicInfo: StepStatus;
  details: StepStatus;
  done: boolean;
  error: string | null;
};

type Props = {
  state: SubmitState;
};

const ProgressLog = ({ state }: Props) => {
  const { basicInfo, details, done, error } = state;

  return (
    <div className={s["c-progress"]}>
      {basicInfo !== "idle" && (
        <div className={s["c-progress__item"]}>
          <span
            className={`${s["c-progress__icon"]} ${
              basicInfo === "pending"
                ? s["c-progress__icon--pending"]
                : s["c-progress__icon--success"]
            }`}>
            {basicInfo === "success" && "\u2713"}
          </span>
          <span
            className={`${s["c-progress__text"]} ${
              basicInfo === "success" ? s["c-progress__text--success"] : ""
            }`}>
            {basicInfo === "pending"
              ? "Submitting Basic Info\u2026"
              : "Basic Info saved!"}
          </span>
        </div>
      )}

      {details !== "idle" && (
        <div className={s["c-progress__item"]}>
          <span
            className={`${s["c-progress__icon"]} ${
              details === "pending"
                ? s["c-progress__icon--pending"]
                : s["c-progress__icon--success"]
            }`}>
            {details === "success" && "\u2713"}
          </span>
          <span
            className={`${s["c-progress__text"]} ${
              details === "success" ? s["c-progress__text--success"] : ""
            }`}>
            {details === "pending"
              ? "Submitting Details\u2026"
              : "Details saved!"}
          </span>
        </div>
      )}

      {done && !error && (
        <div className={s["c-progress__done"]}>
          All data processed successfully!
        </div>
      )}
      {error && <div className={s["c-progress__error"]}>{error}</div>}
    </div>
  );
};

export default ProgressLog;
