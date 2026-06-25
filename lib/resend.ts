import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export function canSendEmail() {
  return resend !== null && resendApiKey !== "__REDACTED_SECRET__set_in_env_not_source";
}
