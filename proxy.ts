import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Définition précise des groupes de routes (Matchers)
const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/pricing(.*)",
  "/contact(.*)",
  "/solutions(.*)",
  "/careers(.*)",
  "/partners(.*)",
  "/posts(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const isOnboardingRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/api/onboarding(.*)",
]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isLocataireRoute = createRouteMatcher(["/locataire(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const authObject = await auth();
  const isAuthenticated: boolean = !!authObject.userId;
  const sessionClaims = authObject.sessionClaims;

  // 1. Si la route est publique (marketing, auth ou webhooks), on laisse passer
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Si l'utilisateur n'est pas connecté et tente d'accéder à une route privée, redirection vers login
  if (!isAuthenticated) {
    return authObject.redirectToSignIn({ returnBackUrl: req.url });
  }

  // === À partir d'ici, l'utilisateur est connecté (isAuthenticated === true) ===
  const metadata = sessionClaims?.metadata;
  const onboardingComplete: boolean = !!metadata?.onboardingComplete;
  const role = metadata?.role;

  // 3. Gestion du flux d'Onboarding
  if (isOnboardingRoute(req)) {
    // S'il a déjà fini l'onboarding, on le redirige vers son espace légitime
    if (onboardingComplete) {
      if (role === "tenant") {
        return NextResponse.redirect(new URL("/locataire/dashboard", req.url));
      }
      if (role === "super_admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Sinon, on le laisse continuer son onboarding
    return NextResponse.next();
  }

  // 4. Si l'utilisateur n'a pas terminé son onboarding et tente d'accéder à une route protégée
  if (!onboardingComplete) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // 5. Vérification des accès par rôle (Contrôle d'accès RBAC)
  // A. Routes Super Admin
  if (isAdminRoute(req) && role !== "super_admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // B. Routes Portail Locataire
  if (isLocataireRoute(req) && role !== "tenant") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // C. Routes Espace Gestion / Agence (Dashboard)
  if (
    isDashboardRoute(req) &&
    role !== "agent" &&
    role !== "owner" &&
    role !== "super_admin"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};