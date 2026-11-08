import { useTranslation } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router";

function RootRoute() {
  const { t } = useTranslation();
  return <main>{t("app.placeholder")}</main>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
