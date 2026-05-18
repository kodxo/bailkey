import { auth, clerkClient } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { prisma } from "@/lib/db";
import type {
  OnboardingRequestDTO,
  OnboardingResponseDTO,
} from "@/lib/types/dto";

export async function completeOnboardingDal(
  data: OnboardingRequestDTO,
): Promise<OnboardingResponseDTO> {
  const authObject = await auth();
  const userId = authObject.userId;

  if (!userId) {
    return { success: false, error: "Utilisateur non authentifié." };
  }

  try {
    const orgId = authObject.orgId;
    const organizationId = orgId || `org_${userId}`;

    let dbId = "";
    const type = data.operationType === "company" ? "COMPANY" : "INDIVIDUAL";

    if (data.role === "owner") {
      // Vérification d'existence pour éviter les collisions de clé unique sur clerkUserId
      const existingOwner = await prisma.owner.findUnique({
        where: { clerkUserId: userId },
      });

      if (existingOwner) {
        const updatedOwner = await prisma.owner.update({
          where: { id: existingOwner.id },
          data: {
            organizationId,
            type,
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            identityDocument: data.idNumber || null,
            companyName: data.companyName || null,
            registrationNumber: data.rccm || null,
            taxNumber: data.niu || null,
            phone: data.phone || null,
            address: data.address || null,
          },
        });
        dbId = updatedOwner.id;
      } else {
        const newOwner = await prisma.owner.create({
          data: {
            clerkUserId: userId,
            organizationId,
            type,
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            identityDocument: data.idNumber || null,
            companyName: data.companyName || null,
            registrationNumber: data.rccm || null,
            taxNumber: data.niu || null,
            phone: data.phone || null,
            address: data.address || null,
          },
        });
        dbId = newOwner.id;
      }
    } else {
      // Vérification d'existence pour le locataire (Tenant)
      const existingTenant = await prisma.tenant.findUnique({
        where: { clerkUserId: userId },
      });

      if (existingTenant) {
        const updatedTenant = await prisma.tenant.update({
          where: { id: existingTenant.id },
          data: {
            organizationId,
            type,
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            identityDocument: data.idNumber || null,
            companyName: data.companyName || null,
            registrationNumber: data.rccm || null,
            taxNumber: data.niu || null,
            phone: data.phone || null,
            address: data.address || null,
          },
        });
        dbId = updatedTenant.id;
      } else {
        const newTenant = await prisma.tenant.create({
          data: {
            clerkUserId: userId,
            organizationId,
            type,
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            identityDocument: data.idNumber || null,
            companyName: data.companyName || null,
            registrationNumber: data.rccm || null,
            taxNumber: data.niu || null,
            phone: data.phone || null,
            address: data.address || null,
          },
        });
        dbId = newTenant.id;
      }
    }

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: data.role,
        dbId,
        onboardingComplete: true,
      },
    });

    const redirectUrl =
      data.role === "tenant" ? "/locataire/dashboard" : "/dashboard";

    return {
      success: true,
      message: "Configuration finalisée avec succès.",
      redirectUrl,
    };
  } catch (error: unknown) {
    console.error("Erreur détaillée DAL completeOnboardingDal:", error);

    // 1. Gestion spécifique de l'erreur ClerkAPIResponseError
    if (isClerkAPIResponseError(error)) {
      const messages = error.errors
        .map(
          (e) =>
            e.longMessage ||
            e.message ||
            "Erreur du service d'authentification",
        )
        .join(", ");
      return {
        success: false,
        error: `Erreur du service d'authentification : ${messages}`,
      };
    }

    // Fallback de sécurité si l'erreur Clerk n'est pas reconnue par le helper
    if (
      typeof error === "object" &&
      error !== null &&
      ("clerkError" in error || "errors" in error)
    ) {
      const clerkErrors = (
        error as { errors?: Array<{ longMessage?: string; message?: string }> }
      ).errors;
      if (Array.isArray(clerkErrors) && clerkErrors.length > 0) {
        const messages = clerkErrors
          .map((e) => e.longMessage || e.message || "Erreur d'authentification")
          .join(", ");
        return {
          success: false,
          error: `Erreur d'authentification : ${messages}`,
        };
      }
    }

    // 2. Gestion de l'erreur standard
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur inconnue en base de données.";
    return {
      success: false,
      error: `Erreur serveur : ${errorMessage}`,
    };
  }
}
