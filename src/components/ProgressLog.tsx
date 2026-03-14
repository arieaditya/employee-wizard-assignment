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
    <div style={{ marginTop: 16 }}>
      {basicInfo !== "idle" && (
        <div>
          {basicInfo === "pending" && "⏳ Submitting basicInfo…"}
          {basicInfo === "success" && "✅ basicInfo saved!"}
        </div>
      )}

      {details !== "idle" && (
        <div>
          {details === "pending" && "⏳ Submitting details…"}
          {details === "success" && "✅ details saved!"}
        </div>
      )}

      {done && !error && <div>🎉 All data processed successfully!</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default ProgressLog;
