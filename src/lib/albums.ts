import { supabase } from "./supabase";
import type { Album } from "../types/photo";

export async function getAlbums(): Promise<Album[]> {
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((album) => ({
    id: album.id,
    name: album.name,
    description: album.description ?? undefined,
    coverPhotoId: album.cover_photo_id ?? undefined,
    createdAt: album.created_at,
  }));
}

export async function createAlbum(
  name: string,
  description?: string,
): Promise<Album> {
  const { data, error } = await supabase
    .from("albums")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? undefined,
    coverPhotoId: data.cover_photo_id ?? undefined,
    createdAt: data.created_at,
  };
}

export async function deleteAlbum(albumId: string): Promise<void> {
  // First, unlink photos from this album so photos are preserved in the general gallery
  const { error: unlinkError } = await supabase
    .from("photos")
    .update({ album_id: null })
    .eq("album_id", albumId);

  if (unlinkError) {
    throw unlinkError;
  }

  // Delete the album record
  const { error } = await supabase.from("albums").delete().eq("id", albumId);

  if (error) {
    throw error;
  }
}
