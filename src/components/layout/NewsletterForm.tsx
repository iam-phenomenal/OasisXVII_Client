"use client";

import { useId, useState } from "react";
import { isValidEmail } from "@/lib/email";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isSubmitting = status === "submitting";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = email.trim();

    if (!isValidEmail(trimmed)) {
      setStatus("error");
      setMessage("Enter a valid email address");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const body = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus("error");
        setMessage(body?.error ?? "Something went wrong. Try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>

      <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-2 transition-colors duration-300 focus-within:border-on-surface-primary/60">
        <input
          id={inputId}
          type="email"
          // Distinct from the checkout form's `email` field, which renders on
          // the same page — a shared name makes the pair ambiguous to autofill
          // and to any form tooling that queries by name.
          name="newsletter-email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            // Clear a stale verdict the moment the shopper starts fixing it,
            // so the message never contradicts what is in the field.
            if (status !== "idle") {
              setStatus("idle");
              setMessage("");
            }
          }}
          disabled={isSubmitting}
          placeholder="Email address"
          autoComplete="email"
          aria-invalid={status === "error"}
          className="min-w-0 flex-1 bg-transparent py-1 font-body text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Subscribe"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-on-tertiary transition-[opacity,transform] duration-300 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-[14px] w-[14px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        // Reserves the line so a verdict does not shove the bottom bar down.
        className={`mt-3 min-h-4 font-body text-xs ${
          status === "error" ? "text-error" : "text-on-surface-primary"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
