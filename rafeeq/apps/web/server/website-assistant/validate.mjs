import {
  MESSAGE_MAX,
  MESSAGE_MIN,
  RAFeeq_TOPIC_PATTERN,
  SENSITIVE_GENETIC_PATTERN,
} from "./constants.mjs";

export function normalizeMessage(raw) {
  if (typeof raw !== "string") {
    return { ok: false, code: "invalid_body", messageKey: "invalidMessage" };
  }
  const message = raw.trim();
  if (message.length < MESSAGE_MIN) {
    return { ok: false, code: "empty_message", messageKey: "emptyMessage" };
  }
  if (message.length > MESSAGE_MAX) {
    return { ok: false, code: "message_too_long", messageKey: "messageTooLong" };
  }
  if (SENSITIVE_GENETIC_PATTERN.test(message)) {
    return { ok: false, code: "sensitive_genetic", messageKey: "noPersonalGenetic" };
  }
  if (!RAFeeq_TOPIC_PATTERN.test(message)) {
    return { ok: false, code: "off_topic", messageKey: "offTopic" };
  }
  return { ok: true, message };
}
