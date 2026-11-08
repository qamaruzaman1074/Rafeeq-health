import { useSyncExternalStore } from "react";
import { Navigate, Outlet, redirect } from "react-router";
import { canAccess, getSessionRole, subscribeSession, type GuardRole } from "@/app/session";

export function roleGuardLoader(allow: readonly GuardRole[]) {
  return () => {
    if (!canAccess(getSessionRole(), allow)) {
      return redirect("/");
    }
    return null;
  };
}

export function RoleGuard({ allow }: { allow: readonly GuardRole[] }) {
  const role = useSyncExternalStore(subscribeSession, getSessionRole, getSessionRole);
  if (!canAccess(role, allow)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
