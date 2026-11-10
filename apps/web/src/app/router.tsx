import { createBrowserRouter, RouterProvider } from "react-router";
import { appRoutes } from "@/app/routes";

export const router = createBrowserRouter(appRoutes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
