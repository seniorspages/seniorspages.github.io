import { supabase } from "./supabase";
import type { Photo } from "../types/photo";

const BUCKET = "gallery";

export async function getPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data.map((photo) => {
    const { data: publicUrl } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(photo.storage_path);

    return {
      id: photo.id,
      url: publicUrl.publicUrl,
      caption: photo.caption ?? "",
      uploadedBy: photo.uploaded_by ?? undefined,
      createdAt: photo.created_at,
    };
  });
}

export async function uploadPhoto(file: File, caption: string): Promise<Photo> {
  const extension = file.name.split(".").pop() ?? "webp";

  const path = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data, error } = await supabase
    .from("photos")
    .insert({
      storage_path: path,
      caption,
    })
    .select()
    .single();

  if (error) {
    // Try to clean up the uploaded file if DB insertion fails.
    await supabase.storage.from(BUCKET).remove([path]);

    throw error;
  }

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    id: data.id,
    url: publicUrl.publicUrl,
    caption: data.caption ?? "",
    uploadedBy: data.uploaded_by ?? undefined,
    createdAt: data.created_at,
  };
}
