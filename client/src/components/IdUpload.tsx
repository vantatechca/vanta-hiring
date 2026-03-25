import { useRef, useState } from "react";
import shared from "../styles/shared.module.css";
import styles from "../styles/IdUpload.module.css";

interface IdUploadProps {
  idFile: File | null;
  onFileChange: (file: File | null) => void;
  onError: (message: string) => void;
}

export default function IdUpload({ idFile, onFileChange, onError }: IdUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onError("Image must be under 5MB.");
      return;
    }
    onFileChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const zoneClass = [
    styles.uploadZone,
    isDragging ? styles.uploadZoneDragging : "",
    idFile ? styles.uploadZoneHasFile : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shared.section}>
      <div className={shared.sectionLabel}>
        Government ID — Background Check
        <div className={shared.sectionLabelLine} />
      </div>
      <div
        className={zoneClass}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            fileRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={idFile ? `Government ID uploaded: ${idFile.name}` : "Upload government ID"}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={shared.srOnly}
          onChange={(e) => handleFile(e.target.files?.[0])}
          aria-label="Choose government ID image"
          tabIndex={-1}
        />
        <span className={styles.uploadIcon} aria-hidden="true">
          {idFile ? "🪪" : "📎"}
        </span>
        {idFile ? (
          <>
            <div className={styles.uploadFileAttached}>File attached</div>
            <div className={styles.uploadFileName}>{idFile.name}</div>
          </>
        ) : (
          <div className={styles.uploadText}>
            Drag &amp; drop your government-issued ID here, or{" "}
            <strong className={styles.uploadTextBrowse}>click to browse</strong>
            <br />
            <span className={styles.uploadTextHint}>JPG, PNG, WEBP — max 5MB</span>
          </div>
        )}
      </div>
      {idFile && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFileChange(null);
          }}
          className={styles.removeBtn}
          aria-label="Remove uploaded file"
        >
          × Remove file
        </button>
      )}
    </div>
  );
}
