export const CONTACT_EMAIL = "help@rafeeq.health";

export type ContactPhone = { display: string; tel: string; placeholder: boolean };

/** UAE-format placeholders until real, verified numbers are provided. */
export const CONTACT_PHONES: readonly ContactPhone[] = [
  { display: "+971 50 000 0000", tel: "+971500000000", placeholder: true },
  { display: "+971 55 000 0000", tel: "+971550000000", placeholder: true },
];

export function mailtoHref(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replaceAll("+", "%20");
  return `mailto:${CONTACT_EMAIL}${query ? `?${query}` : ""}`;
}
