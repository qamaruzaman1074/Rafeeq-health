export type ContactDraft = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type ContactErrors = Partial<Record<"name" | "email" | "message", true>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function validateContact(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {};
  if (draft.name.trim().length === 0) {
    errors.name = true;
  }
  if (!EMAIL.test(draft.email.trim())) {
    errors.email = true;
  }
  if (draft.message.trim().length < 10) {
    errors.message = true;
  }
  return errors;
}
