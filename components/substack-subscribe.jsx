"use client";

import { useId, useState } from "react";

import { SUBSTACK_FORM_ACTION } from "@/lib/site";

export function SubstackForm() {
  const generatedId = useId().replaceAll(":", "");
  const emailId = `newsletter-email-${generatedId}`;
  const statusId = `newsletter-status-${generatedId}`;
  const iframeName = `substack-newsletter-frame-${generatedId}`;
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  function handleSubmit(event) {
    const form = event.currentTarget;
    const input = form.elements.email;

    if (!input || !input.checkValidity()) {
      event.preventDefault();
      setStatus("Enter a valid email address.");
      input?.reportValidity();
      return;
    }

    setStatus("Sending your note to Substack...");
    setIsSending(true);

    window.setTimeout(() => {
      setStatus("Check your inbox for the Substack confirmation.");
      setIsSending(false);
      form.reset();
    }, 1400);
  }

  return (
    <div className="newsletter-panel-inner">
      <form className="newsletter-form" action={SUBSTACK_FORM_ACTION} method="post" target={iframeName} onSubmit={handleSubmit}>
        <input type="hidden" name="source" value="embed" />
        <label className="sr-only" htmlFor={emailId}>
          Email address
        </label>
        <div className="newsletter-input-row">
          <input className="newsletter-input" id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@example.com" aria-describedby={statusId} />
          <button className="newsletter-submit" type="submit" disabled={isSending}>
            {isSending ? "Sending" : "Subscribe"}
          </button>
        </div>
        <p className="newsletter-fine-print">One quiet dispatch when a new comic or source note is ready.</p>
        <p className="newsletter-status" id={statusId} aria-live="polite">
          {status}
        </p>
        <iframe className="newsletter-post-target" name={iframeName} title="Newsletter signup response" hidden />
      </form>
    </div>
  );
}

export function SubstackSubscribe({ page = false }) {
  return (
    <section className={page ? "newsletter-panel newsletter-panel-page" : "newsletter-signup"} aria-labelledby={page ? "newsletter-page-heading" : "newsletter-heading"}>
      {!page ? (
        <div className="newsletter-copy">
          <div className="kicker">Newsletter</div>
          <h2 id="newsletter-heading">Borrowed Time Dispatch</h2>
          <p>Get the next obituary comic by email.</p>
        </div>
      ) : null}
      <SubstackForm />
    </section>
  );
}
