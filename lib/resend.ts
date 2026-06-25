import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export function canSendEmail() {
  return resend !== null && resendApiKey !== "re_placeholder_replace_with_real_key";
}
