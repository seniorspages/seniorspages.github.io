import { supabase } from "./supabase";

export async function checkIsAdmin(userId?: string): Promise<boolean> {
  try {
    // 1. Try the SECURITY DEFINER RPC function
    const { data, error } = await supabase.rpc("is_admin");
    if (!error && typeof data === "boolean") {
      return data;
    }
  } catch {
    // Fall back to direct table query
  }

  // 2. Fallback: query admins table directly
  const targetUserId =
    userId ?? (await supabase.auth.getSession()).data.session?.user.id;

  if (!targetUserId) {
    return false;
  }

  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", targetUserId)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function signInAdmin(
  email: string,
  password: string,
): Promise<boolean> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("No user returned from login.");
  }

  const isAdmin = await checkIsAdmin(data.user.id);
  if (!isAdmin) {
    await supabase.auth.signOut();
    throw new Error(
      "Unauthorized: This account does not have admin privileges.",
    );
  }

  return true;
}

export async function signOutAdmin(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
