import { fileToBase64 } from "../utils/file";

type Props = {
  value: string; // base64
  onChange: (base64: string) => void;
};

const PhotoUpload = ({ value, onChange }: Props) => {
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
    <div>
      <label>
        Photo
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      {value && (
        <div style={{ marginTop: 8 }}>
          <div>Preview:</div>
          <img
            src={value}
            alt="Preview"
            style={{ maxWidth: 120, maxHeight: 120, objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
