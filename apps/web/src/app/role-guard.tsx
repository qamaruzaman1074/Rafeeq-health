import { useSyncExternalStore } from "react";
import { Navigate, Outlet, redirect } from "react-router";
import {
  canAccess,
  getSessionRole,
  isSupabaseAuthenticated,
  restoreGuestSessionFromCookie,
  subscribeSession,
  type GuardRole,
} from "@/app/session";
import { isSupabaseConfigured, restoreSupabaseSession } from "@/features/auth/supabase-auth";

export function roleGuardLoader(allow: readonly GuardRole[]) {
  return async () => {
    restoreGuestSessionFromCookie();
    if (canAccess(getSessionRole(), allow)) {
      return null;
    }
    if (getSessionRole() === null && !isSupabaseAuthenticated() && isSupabaseConfigured()) {
      await restoreSupabaseSession();
    }
    return canAccess(getSessionRole(), allow) ? null : redirect("/");
  };
}

export function RoleGuard({ allow }: { allow: readonly GuardRole[] }) {
  const role = useSyncExternalStore(subscribeSession, getSessionRole, getSessionRole);
  if (!canAccess(role, allow)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
