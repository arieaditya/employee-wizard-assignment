type Props<T> = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  displayKey: keyof T;
  suggestions: T[];
  loading: boolean;
  error: string | null;
  onQueryChange: (value: string) => void;
};

function AsyncAutocomplete<T>({
  label,
  value,
  onChange,
  displayKey,
  suggestions,
  loading,
  error,
  onQueryChange,
}: Props<T>) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    onChange(next);
    onQueryChange(next);
  };

  return (
    <div>
      <label>
        {label}
        <input value={value} onChange={handleInputChange} />
      </label>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {suggestions && suggestions.length > 0 && (
        <ul style={{ border: "1px solid #ccc", marginTop: 4 }}>
          {suggestions.map((item, idx) => {
            const text = String(item[displayKey]);
            return (
              <li
                key={idx}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onChange(text);
                  onQueryChange(text);
                }}>
                {text}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AsyncAutocomplete;
