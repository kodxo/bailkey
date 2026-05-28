export {};

export type Roles = "super_admin" | "agent" | "owner" | "tenant" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
      dbId?: string;
      onboardingComplete?: boolean;
    };
  }
}
