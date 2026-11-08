import { useTranslation } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router";
import { StyleguidePage } from "@/pages/dev/styleguide-page";

function RootRoute() {
  const { t } = useTranslation();
  return <main>{t("app.placeholder")}</main>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
  },
  {
    path: "/dev/styleguide",
    element: <StyleguidePage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
