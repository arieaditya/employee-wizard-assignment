import { useRef } from "react";
import { fileToBase64 } from "../utils/file";
import s from "./PhotoUpload.module.css";

type Props = {
  value: string; // base64
  onChange: (base64: string) => void;
};

const PhotoUpload = ({ value, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      onChange(base64);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={s["c-photo"]}>
      <span className={s["c-photo__label"]}>Photo</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={s["c-photo__input"]}
        onChange={handleFileChange}
        aria-label="Photo"
      />
      <label
        className={s["c-photo__button"]}
        onClick={() => inputRef.current?.click()}>
        Choose file
      </label>

      {value && (
        <div className={s["c-photo__preview"]}>
          <img src={value} alt="Preview" className={s["c-photo__image"]} />
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
