/** Primary public site navigation — single source for header and footer. */
export const publicNavPrimary = [
  { path: "/about", labelKey: "nav.about" },
  { path: "/problem-solution", labelKey: "nav.problemSolution" },
  { path: "/how-it-works", labelKey: "nav.howItWorks" },
  { path: "/understanding-genetic-risk", labelKey: "nav.risk" },
  { path: "/inherited-conditions", labelKey: "nav.conditions" },
  { path: "/genetic-counselling", labelKey: "nav.counselling" },
  { path: "/trust", labelKey: "nav.trustPrivacy" },
  { path: "/faq", labelKey: "nav.faq" },
] as const;

export const publicNavFooterGroups = [
  {
    headingKey: "footer.platformHeading",
    links: [
      { path: "/about", labelKey: "footer.about" },
      { path: "/problem-solution", labelKey: "footer.problemSolution" },
      { path: "/how-it-works", labelKey: "footer.howItWorks" },
      { path: "/genetic-counselling", labelKey: "footer.counselling" },
      { path: "/contact", labelKey: "footer.contact" },
    ],
  },
  {
    headingKey: "footer.learnHeading",
    links: [
      { path: "/understanding-genetic-risk", labelKey: "footer.risk" },
      { path: "/informed-choices", labelKey: "footer.informedChoices" },
      { path: "/screening-pathways", labelKey: "footer.screeningPathways" },
      { path: "/inherited-conditions", labelKey: "footer.conditions" },
      { path: "/faq", labelKey: "footer.faq" },
    ],
  },
  {
    headingKey: "footer.privacyHeading",
    links: [
      { path: "/trust", labelKey: "footer.trust" },
      { path: "/privacy-policy", labelKey: "footer.privacyPolicy" },
      { path: "/terms", labelKey: "footer.terms" },
    ],
  },
] as const;

export const publicSitePaths = new Set([
  "/",
  "/about",
  "/problem-solution",
  "/how-it-works",
  "/understanding-genetic-risk",
  "/informed-choices",
  "/screening-pathways",
  "/inherited-conditions",
  "/genetic-counselling",
  "/contact",
  "/faq",
  "/trust",
  "/demo",
  "/privacy-policy",
  "/terms",
  "/legal",
]);
