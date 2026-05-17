"use server";

import { checkRole } from "@/lib/clerk/check-role";
import { clerkClient } from "@clerk/nextjs/server";
import { Roles } from "@/types/globals";

export async function setRole(formData: FormData) {
  const client = await clerkClient();

  if (!(await checkRole("admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") as Roles },
      },
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: String(err) };
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient();

  if (!(await checkRole("admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: null },
      },
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: String(err) };
  }
}
