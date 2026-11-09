import {
  demoPartnerFindings,
  demoReport,
  type DemoScreeningFinding,
} from "@/features/demo-report/demo-report";

export type InvitationStatus = "none" | "pending" | "accepted" | "declined" | "cancelled";

export const CONSENT_CATEGORIES = ["carrierFindings", "reportInfo", "referralInfo"] as const;
export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

export type ConsentRecord = { granted: boolean; changedAt: string | null };

export type AuditEventType =
  | "inviteCreated"
  | "inviteCancelled"
  | "inviteAccepted"
  | "inviteDeclined"
  | "consentGranted"
  | "consentRevoked"
  | "partnerConsentGranted"
  | "reset";

export type AuditEvent = {
  id: string;
  type: AuditEventType;
  category?: ConsentCategory;
  at: string;
  synthetic: true;
};

export type PartnerDemoState = {
  invitation: { status: InvitationStatus; code: string | null; createdAt: string | null };
  mine: Record<ConsentCategory, ConsentRecord>;
  partner: Record<ConsentCategory, ConsentRecord>;
  events: AuditEvent[];
};

export type PartnerAction =
  | { type: "invite"; code: string }
  | { type: "cancel" }
  | { type: "simulateAccept" }
  | { type: "simulateDecline" }
  | { type: "grant"; category: ConsentCategory }
  | { type: "revoke"; category: ConsentCategory }
  | { type: "simulatePartnerGrant"; category: ConsentCategory }
  | { type: "reset" };

function emptyConsents(): Record<ConsentCategory, ConsentRecord> {
  return {
    carrierFindings: { granted: false, changedAt: null },
    reportInfo: { granted: false, changedAt: null },
    referralInfo: { granted: false, changedAt: null },
  };
}

export function initialPartnerState(): PartnerDemoState {
  return {
    invitation: { status: "none", code: null, createdAt: null },
    mine: emptyConsents(),
    partner: emptyConsents(),
    events: [],
  };
}

function log(
  state: PartnerDemoState,
  type: AuditEventType,
  at: string,
  category?: ConsentCategory,
): AuditEvent[] {
  const event: AuditEvent = {
    id: `${type}-${state.events.length + 1}`,
    type,
    at,
    synthetic: true,
    ...(category === undefined ? {} : { category }),
  };
  return [event, ...state.events];
}

/**
 * Applies an action. Invalid transitions return the same state object, so callers can
 * detect a rejected action with `next === state`.
 */
export function partnerReducer(
  state: PartnerDemoState,
  action: PartnerAction,
  now: string,
): PartnerDemoState {
  const status = state.invitation.status;
  switch (action.type) {
    case "invite":
      if (status === "pending" || status === "accepted") return state;
      return {
        ...state,
        invitation: { status: "pending", code: action.code, createdAt: now },
        events: log(state, "inviteCreated", now),
      };
    case "cancel":
      if (status !== "pending") return state;
      return {
        ...state,
        invitation: { ...state.invitation, status: "cancelled" },
        events: log(state, "inviteCancelled", now),
      };
    case "simulateAccept":
      if (status !== "pending") return state;
      return {
        ...state,
        invitation: { ...state.invitation, status: "accepted" },
        events: log(state, "inviteAccepted", now),
      };
    case "simulateDecline":
      if (status !== "pending") return state;
      return {
        ...state,
        invitation: { ...state.invitation, status: "declined" },
        events: log(state, "inviteDeclined", now),
      };
    case "grant":
      if (status !== "accepted" || state.mine[action.category].granted) return state;
      return {
        ...state,
        mine: { ...state.mine, [action.category]: { granted: true, changedAt: now } },
        events: log(state, "consentGranted", now, action.category),
      };
    case "revoke":
      if (!state.mine[action.category].granted) return state;
      return {
        ...state,
        mine: { ...state.mine, [action.category]: { granted: false, changedAt: now } },
        events: log(state, "consentRevoked", now, action.category),
      };
    case "simulatePartnerGrant":
      if (status !== "accepted" || state.partner[action.category].granted) return state;
      return {
        ...state,
        partner: { ...state.partner, [action.category]: { granted: true, changedAt: now } },
        events: log(state, "partnerConsentGranted", now, action.category),
      };
    case "reset":
      return { ...initialPartnerState(), events: log(initialPartnerState(), "reset", now) };
  }
}

/** Only findings covered by an active consent leave a person's private report. */
export function sharedFindings(
  findings: readonly DemoScreeningFinding[],
  consents: Record<ConsentCategory, ConsentRecord>,
): DemoScreeningFinding[] {
  return findings.filter((finding) => {
    if (finding.status === "carrier_finding") return consents.carrierFindings.granted;
    if (finding.status === "inconclusive") return consents.reportInfo.granted;
    return false;
  });
}

export type SharedRiskState =
  | { kind: "noPartner" }
  | { kind: "pending" }
  | { kind: "noSharedFindings" }
  | { kind: "example"; genes: string[] }
  | { kind: "insufficient" };

/**
 * Couple-level explanation. It never estimates risk from one person's findings,
 * from the relationship alone, or across different genes.
 */
export function sharedRiskState(
  state: PartnerDemoState,
  myFindings: readonly DemoScreeningFinding[] = demoReport.findings,
  partnerFindings: readonly DemoScreeningFinding[] = demoPartnerFindings,
): SharedRiskState {
  const status = state.invitation.status;
  if (status === "pending") return { kind: "pending" };
  if (status !== "accepted") return { kind: "noPartner" };

  const mine = sharedFindings(myFindings, state.mine);
  const theirs = sharedFindings(partnerFindings, state.partner);
  if (mine.length === 0 || theirs.length === 0) return { kind: "noSharedFindings" };

  const isRecessiveCarrier = (finding: DemoScreeningFinding) =>
    finding.status === "carrier_finding" && finding.inheritancePattern === "autosomal_recessive";
  const genes = mine
    .filter(isRecessiveCarrier)
    .map((finding) => finding.gene)
    .filter((gene) => theirs.some((other) => isRecessiveCarrier(other) && other.gene === gene));
  const uniqueGenes = [...new Set(genes)];
  if (uniqueGenes.length > 0) return { kind: "example", genes: uniqueGenes };
  return { kind: "insufficient" };
}
