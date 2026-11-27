import { PLACEHOLDERS, isPlaceholder } from "@/components/site/site-links";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Thrown when the Web3Forms access key hasn't been configured yet. */
export class Web3FormsNotConfiguredError extends Error {}

/**
 * Submits form data to Web3Forms, which delivers it as an email (in the
 * background, no email client popup) to the inbox tied to the access key.
 * Pass `file` to attach a single file (e.g. a video testimonial).
 */
export async function submitToWeb3Forms(
  subject: string,
  fields: Record<string, string>,
  file?: File | null,
) {
  const accessKey = PLACEHOLDERS.web3formsAccessKey;
  if (isPlaceholder(accessKey)) {
    throw new Web3FormsNotConfiguredError(
      "The email service isn't configured yet. Please contact the site owner.",
    );
  }

  const formData = new FormData();
  formData.append("access_key", accessKey);
  formData.append("subject", subject);
  formData.append("from_name", "Rita Sofio links page");
  for (const [label, value] of Object.entries(fields)) {
    formData.append(label, value);
  }
  if (file) formData.append("attachment", file);

  let response: Response;
  try {
    response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });
  } catch {
    throw new Error("Couldn't reach the email service. Check your connection and try again.");
  }

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Something went wrong while sending. Please try again.");
  }
}
