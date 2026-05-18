import type { OnboardingRequestDTO, OnboardingResponseDTO } from "@/lib/types/dto";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const onboardingService = {
  async completeOnboarding(
    data: OnboardingRequestDTO
  ): Promise<OnboardingResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: unknown = await res.json();

      if (result && typeof result === "object" && "success" in result) {
        return result as OnboardingResponseDTO;
      }

      return {
        success: false,
        error: "Format de réponse du serveur invalide.",
      };
    } catch (error: unknown) {
      console.error("Erreur réseau onboardingService:", error);
      return {
        success: false,
        error: "Erreur réseau lors de la communication avec le serveur.",
      };
    }
  },
};
