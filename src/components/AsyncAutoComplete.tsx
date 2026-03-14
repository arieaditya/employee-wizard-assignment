import { useState } from "react";
import s from "./AsyncAutoComplete.module.css";

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
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    onChange(next);
    onQueryChange(next);
    setOpen(true);
  };

  const handleSelect = (text: string) => {
    onChange(text);
    setOpen(false);
  };

  return (
    <div className={s["c-autocomplete"]}>
      <label>
        {label}
        <input value={value} onChange={handleInputChange} />
      </label>

      {loading && <div className={s["c-autocomplete__loading"]}>Loading…</div>}
      {error && <div className={s["c-autocomplete__error"]}>{error}</div>}

      {open && suggestions && suggestions.length > 0 && (
        <ul className={s["c-autocomplete__dropdown"]}>
          {suggestions.map((item, idx) => {
            const text = String(item[displayKey]);
            return (
              <li
                key={idx}
                className={s["c-autocomplete__item"]}
                onClick={() => handleSelect(text)}
              >
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
