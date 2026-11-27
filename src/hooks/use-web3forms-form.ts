import { useState } from "react";
import { submitToWeb3Forms } from "@/lib/web3forms";

type Status = "idle" | "loading" | "success";

/**
 * Shared submit lifecycle for the site's Web3Forms-backed forms (status,
 * error message, reset) — every form on the site follows the same
 * loading -> success/error pattern, previously duplicated in each one.
 */
export function useWeb3FormsForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function reset() {
    setStatus("idle");
    setErrorMessage(null);
  }

  /** Submits `fields` under `subject`, resets `form` and flips to "success" on success. Returns whether it succeeded. */
  async function submit(
    form: HTMLFormElement,
    subject: string,
    fields: Record<string, string>,
  ): Promise<boolean> {
    setStatus("loading");
    setErrorMessage(null);
    try {
      await submitToWeb3Forms(subject, fields);
      form.reset();
      setStatus("success");
      return true;
    } catch (err) {
      setStatus("idle");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      return false;
    }
  }

  return { status, errorMessage, submit, reset };
}
