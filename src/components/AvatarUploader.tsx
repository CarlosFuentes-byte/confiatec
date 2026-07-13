"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/initials";

export default function AvatarUploader({
  userId,
  fullName,
  avatarUrl,
}: {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    setUploading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setPreview(publicUrl);
    router.refresh();
  };

  return (
    <div className="avatar-uploader">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={fullName} className="avatar-uploader-preview" />
      ) : (
        <div className="avatar-uploader-preview">{getInitials(fullName)}</div>
      )}
      <div>
        <label className="btn btn-ghost btn-sm" htmlFor="avatarInput">
          {uploading ? "Subiendo..." : "Cambiar foto"}
        </label>
        <input
          ref={inputRef}
          id="avatarInput"
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={handleFileChange}
        />
        {error && (
          <p className="location-error" style={{ marginTop: "8px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
