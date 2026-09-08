import { supabase } from "./supabase";
import type { Photo } from "../types/photo";
import { compressImage } from "../helpers/imageHelpers";

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

  return (data || []).map((photo) => {
    const { data: publicUrl } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(photo.storage_path);

    return {
      id: photo.id,
      url: publicUrl.publicUrl,
      storagePath: photo.storage_path,
      caption: photo.caption ?? "",
      uploadedBy: photo.uploaded_by ?? undefined,
      createdAt: photo.created_at,
      albumId: photo.album_id ?? undefined,
      likeCount: photo.like_count ?? 0,
    };
  });
}

export async function uploadPhoto(
  file: File,
  caption: string,
  albumId?: string,
): Promise<Photo> {
  const extension = file.name.split(".").pop() ?? "webp";
  const path = `${crypto.randomUUID()}.${extension}`;

  const compressed = await compressImage(file);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, {
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
      caption: caption.trim() || null,
      album_id: albumId || null,
    })
    .select()
    .single();

  if (error) {
    // Clean up uploaded file if DB insertion fails
    await supabase.storage.from(BUCKET).remove([path]);
    throw error;
  }

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    id: data.id,
    url: publicUrl.publicUrl,
    storagePath: data.storage_path,
    caption: data.caption ?? "",
    uploadedBy: data.uploaded_by ?? undefined,
    createdAt: data.created_at,
    albumId: data.album_id ?? undefined,
    likeCount: data.like_count ?? 0,
  };
}

export async function deletePhoto(photo: Photo): Promise<void> {
  // 1. Delete associated likes
  await supabase.from("photo_likes").delete().eq("photo_id", photo.id);

  // 2. Delete database record
  const { error: dbError } = await supabase
    .from("photos")
    .delete()
    .eq("id", photo.id);

  if (dbError) {
    throw dbError;
  }

  // 3. Delete file from Supabase Storage
  if (photo.storagePath) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([photo.storagePath]);

    if (storageError) {
      console.error("Failed to delete file from storage bucket:", storageError);
    }
  }
}
