# Legal review

Internal tracking for the public legal pages. These notes were removed from the visible Terms of Use and Privacy Policy pages so the site reads as user-facing copy. Nothing here has been reviewed by a lawyer.

## Before publication

- [ ] Legal review of the Terms of Use (`public.json` → `terms`).
- [ ] Review the Privacy Policy against the deployed infrastructure and applicable privacy law (`public.json` → `privacyPolicy`).
- [ ] Add a real "Last updated" date to both pages once reviewed.
- [ ] Confirm the governing law, jurisdiction, legal entity name and official contact details.
- [ ] Draft the limitation of liability clause.
- [ ] Confirm retention periods and automated deletion in backend infrastructure (the product design states guest sessions are deleted after 24 hours; not verified).
- [ ] Identify any external services that process user information.
- [ ] Define the process for access, correction, consent withdrawal and deletion requests.
- [ ] Replace the placeholder telephone numbers on the Contact page (`src/config/contact.ts`).

## Removed notices (original wording)

- `terms.draftNotice`: Draft — requires legal review before publication.
- `terms.lastUpdated`: Last updated: To be completed before publication.
- `privacyPolicy.draftNotice`: Draft — requires review against actual production infrastructure and applicable privacy law.
- `privacyPolicy.lastUpdated`: Last updated: To be completed before publication.

## Clauses rewritten for public display (original wording)

### `terms.sections.liability`

> Any limitation of liability must be drafted and reviewed in accordance with applicable law. Do not rely on this draft as a final legal clause — LEGAL_REVIEW.

### `terms.sections.governing`

> The applicable jurisdiction, legal organisation name and official contact details must be confirmed before publication — OPEN_QUESTION.

### `privacyPolicy.sections.collect`

> Depending on the features used, information may include basic account or profile information; information voluntarily entered by a user; genetic screening information provided by a user; information related to consent and sharing preferences; and technical information necessary to operate the service.
>
> In this browser preview, language, theme, literacy mode and numeral preferences may be stored in localStorage. Guest demo sessions use in-memory role state and synthetic persona fixtures. Only describe information that the deployed service actually collects.

### `privacyPolicy.sections.access`

> Access should be limited according to actual user roles, permissions and service functionality. Couple, counsellor, analyst and admin routes are guarded by in-app role in this preview. Do not assume that all users, family members or healthcare professionals can access another person's results.

### `privacyPolicy.sections.storage`

> Information security depends on the actual systems, infrastructure and safeguards deployed by RAFEEQ. Do not interpret this policy as a guarantee of encryption, secure hosting or regulatory certification unless independently verified and documented. This preview runs as a static web app with mocks.

### `privacyPolicy.sections.retention`

> Retention periods and deletion procedures must be defined according to the actual service implementation and applicable legal requirements. Trust centre copy states guest sessions are deleted after 24 hours in the product design; automated deletion in backend infrastructure has not been verified here — LEGAL_REVIEW.

### `privacyPolicy.sections.thirdParty`

> Fonts are self-hosted in this preview. Any external services that process user information should be identified transparently in the production policy — OPEN_QUESTION.

### `privacyPolicy.sections.rights`

> Users should be informed about available rights and procedures concerning access, correction, consent withdrawal and deletion, subject to applicable law and technical limitations. Contact and process are OPEN_QUESTION for product owner.
