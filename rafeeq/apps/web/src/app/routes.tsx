import { type RouteObject } from "react-router";
import { RoleGuard, roleGuardLoader } from "@/app/role-guard";
import { guardRoles, productRoutes, type RouteAccess } from "@/app/route-table";
import { AppShell } from "@/components/app-shell";

function pagesFor(access: RouteAccess): RouteObject[] {
  return productRoutes
    .filter((route) => route.access === access)
    .map((route) => ({ path: route.path, lazy: route.load }));
}

function guarded(access: Exclude<RouteAccess, "public">): RouteObject {
  return {
    loader: roleGuardLoader(guardRoles[access]),
    element: <RoleGuard allow={guardRoles[access]} />,
    children: pagesFor(access),
  };
}

export const appRoutes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      ...pagesFor("public"),
      guarded("couple"),
      guarded("counsellor"),
      guarded("analyst"),
      guarded("admin"),
    ],
  },
  {
    path: "/dev/styleguide",
    lazy: async () => {
      const module = await import("@/pages/dev/styleguide-page");
      return { Component: module.StyleguidePage };
    },
  },
];
