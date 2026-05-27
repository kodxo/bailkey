export {};

export type Roles = "super_admin" | "agent" | "owner" | "tenant" | "admin" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
      dbId?: string;
      onboardingComplete?: boolean;
    };
  }
}
