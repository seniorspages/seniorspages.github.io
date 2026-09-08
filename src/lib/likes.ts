import { supabase } from "./supabase";
import { getVisitorId } from "./visitor";

export async function getLikedPhotoIds(): Promise<Set<string>> {
  const visitorId = getVisitorId();

  const { data, error } = await supabase
    .from("photo_likes")
    .select("photo_id")
    .eq("visitor_id", visitorId);

  if (error) {
    console.error("Failed to load liked photos:", error);
    return new Set<string>();
  }

  return new Set<string>((data || []).map((row) => row.photo_id));
}

export async function likePhoto(photoId: string): Promise<boolean> {
  const visitorId = getVisitorId();

  const { error } = await supabase.from("photo_likes").insert({
    photo_id: photoId,
    visitor_id: visitorId,
  });

  if (error?.code === "23505") {
    // Already liked (unique constraint violation)
    return false;
  }

  if (error) {
    throw error;
  }

  return true;
}

export async function unlikePhoto(photoId: string): Promise<void> {
  const visitorId = getVisitorId();

  const { error } = await supabase
    .from("photo_likes")
    .delete()
    .eq("photo_id", photoId)
    .eq("visitor_id", visitorId);

  if (error) {
    throw error;
  }
}

export async function hasLikedPhoto(photoId: string): Promise<boolean> {
  const visitorId = getVisitorId();

  const { data, error } = await supabase
    .from("photo_likes")
    .select("id")
    .eq("photo_id", photoId)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}
