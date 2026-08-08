import type { NextAuthConfig } from "next-auth";

const STAFF_ROLES = new Set(["ADMIN", "EDITOR"]);

// Edge-safe config (no Prisma / bcrypt here) — used by the proxy/middleware.
export default {
  pages: {
    signIn: "/kirish",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const role = (auth?.user as { role?: string } | undefined)?.role;
      const isStaff = !!role && STAFF_ROLES.has(role);
      const { pathname } = request.nextUrl;
      const isAdminLoginPage = pathname === "/admin/login";
      const isAdminRoute = pathname.startsWith("/admin");

      if (isAdminLoginPage) {
        if (isStaff) return Response.redirect(new URL("/admin", request.nextUrl));
        return true;
      }

      if (isAdminRoute) {
        if (isStaff) return true;
        return Response.redirect(new URL("/admin/login", request.nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
