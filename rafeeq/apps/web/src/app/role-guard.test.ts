import { afterEach, describe, expect, it } from "vitest";
import { createMemoryRouter, type RouteObject } from "react-router";
import { appRoutes } from "@/app/routes";
import { productRoutes } from "@/app/route-table";
import { canAccess, effectiveRole, setSessionRole, type SessionRole } from "@/app/session";

function collectPaths(routes: readonly RouteObject[]): string[] {
  const found: string[] = [];
  for (const route of routes) {
    if (typeof route.path === "string") {
      found.push(route.path);
    }
    if (route.children) {
      found.push(...collectPaths(route.children));
    }
  }
  return found;
}

const requiredPaths = [
  "/",
  "/trust",
  "/demo",
  "/app",
  "/app/result",
  "/app/couple",
  "/app/learn",
  "/app/check",
  "/app/ask",
  "/app/privacy",
  "/app/care",
  "/app/settings",
  "/clinic",
  "/clinic/queue",
  "/clinic/case/:id",
  "/clinic/audit",
  "/insights",
  "/admin",
  "/legal",
];

async function locationFor(path: string): Promise<string> {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  router.initialize();
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error(`navigation did not settle for ${path}`));
    }, 2000);
    const finish = () => {
      if (!router.state.initialized || router.state.navigation.state !== "idle") {
        return;
      }
      clearTimeout(timer);
      unsubscribe();
      resolve();
    };
    const unsubscribe = router.subscribe(() => {
      finish();
    });
    finish();
  });
  expect(router.state.errors).toBeNull();
  return router.state.location.pathname;
}

describe("role guard", () => {
  afterEach(() => {
    setSessionRole(null);
  });

  it("registers every planning route and keeps the styleguide", () => {
    expect(productRoutes.map((route) => route.path)).toEqual(requiredPaths);
    expect(collectPaths(appRoutes).sort()).toEqual([...requiredPaths, "/dev/styleguide"].sort());
  });

  it("treats guest as couple and leaves other roles unchanged", () => {
    expect(effectiveRole(null)).toBeNull();
    expect(effectiveRole("guest")).toBe("couple");
    expect(effectiveRole("couple")).toBe("couple");
    expect(effectiveRole("counsellor")).toBe("counsellor");
    expect(canAccess("guest", ["couple"])).toBe(true);
    expect(canAccess("guest", ["counsellor"])).toBe(false);
    expect(canAccess(null, ["couple"])).toBe(false);
  });

  it("redirects an unauthorised route to /", async () => {
    const cases: { role: SessionRole | null; path: string; expected: string }[] = [
      { role: null, path: "/app", expected: "/" },
      { role: null, path: "/app/result", expected: "/" },
      { role: null, path: "/clinic", expected: "/" },
      { role: null, path: "/clinic/queue", expected: "/" },
      { role: null, path: "/insights", expected: "/" },
      { role: null, path: "/admin", expected: "/" },
      { role: null, path: "/", expected: "/" },
      { role: null, path: "/trust", expected: "/trust" },
      { role: null, path: "/demo", expected: "/demo" },
      { role: null, path: "/legal", expected: "/legal" },
      { role: null, path: "/dev/styleguide", expected: "/dev/styleguide" },
      { role: "guest", path: "/app", expected: "/app" },
      { role: "guest", path: "/app/settings", expected: "/app/settings" },
      { role: "guest", path: "/app/couple", expected: "/app/couple" },
      { role: "guest", path: "/clinic", expected: "/" },
      { role: "guest", path: "/insights", expected: "/" },
      { role: "guest", path: "/admin", expected: "/" },
      { role: "couple", path: "/app/result", expected: "/app/result" },
      { role: "couple", path: "/clinic/queue", expected: "/" },
      { role: "couple", path: "/admin", expected: "/" },
      { role: "counsellor", path: "/clinic", expected: "/clinic" },
      { role: "counsellor", path: "/clinic/queue", expected: "/clinic/queue" },
      { role: "counsellor", path: "/clinic/case/example", expected: "/clinic/case/example" },
      { role: "counsellor", path: "/clinic/audit", expected: "/clinic/audit" },
      { role: "counsellor", path: "/app", expected: "/" },
      { role: "counsellor", path: "/insights", expected: "/" },
      { role: "analyst", path: "/insights", expected: "/insights" },
      { role: "analyst", path: "/clinic", expected: "/" },
      { role: "analyst", path: "/app", expected: "/" },
      { role: "admin", path: "/admin", expected: "/admin" },
      { role: "admin", path: "/insights", expected: "/" },
      { role: "admin", path: "/clinic/audit", expected: "/" },
    ];

    for (const item of cases) {
      setSessionRole(item.role);
      const location = await locationFor(item.path);
      expect(location, `${item.role ?? "none"} ${item.path}`).toBe(item.expected);
    }
  });
});
