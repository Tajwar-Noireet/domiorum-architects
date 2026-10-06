"use client";
import { useState } from "react";
import { FlowButton, FlowButtonContent } from "@/components/ui/FlowButton";
import { site } from "@/content/site";

export function EnquiryForm({
  consultation = false,
}: {
  consultation?: boolean;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  function prepare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `${consultation ? "Consultation request" : "Project enquiry"}\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone") || "Not provided"}\nInterest: ${data.get("service")}\nLocation: ${data.get("location") || "To discuss"}\n\n${data.get("message")}`;
    setDraft(message);
    setCopied(false);
    setCopyError(false);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft!);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <form className="enquiry-form" onSubmit={prepare}>
      <div className="form-heading">
        <h2>
          {consultation
            ? "Request a consultation"
            : "Tell us about your project"}
        </h2>
        <p>A few details are enough to start a conversation.</p>
      </div>
      <div className="form-row">
        <label>
          Your name <span aria-hidden="true">*</span>
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Full name"
          />
        </label>
        <label>
          Email address <span aria-hidden="true">*</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={150}
            placeholder="you@example.com"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Phone <span className="optional">optional</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder="Your contact number"
          />
        </label>
        <label>
          Project location <span className="optional">optional</span>
          <input name="location" maxLength={150} placeholder="Area or city" />
        </label>
      </div>
      <label>
        I’m interested in
        <select
          name="service"
          defaultValue={
            consultation ? "Initial consultation" : "Interior design"
          }
        >
          <option>Interior design</option>
          <option>Residential architecture</option>
          <option>Renovation or extension</option>
          <option>Technical & delivery support</option>
          <option>Initial consultation</option>
          <option>Something else</option>
        </select>
      </label>
      <label>
        A little about your project <span aria-hidden="true">*</span>
        <textarea
          name="message"
          rows={5}
          required
          maxLength={4000}
          placeholder="What would you like to create or change? You can include the approximate size, timeline or budget if you know them."
        />
      </label>
      <p className="form-explanation">
        This prepares an email for you to review and send. Your details are not
        submitted or stored on this website.{" "}
        <a href="/privacy">Privacy details</a>
      </p>
      <FlowButton type="submit">Prepare my enquiry</FlowButton>
      {draft !== null ? (
        <div className="email-draft" role="status">
          <h3>Your enquiry is ready to send</h3>
          <p>
            Open it in your email app, or copy the text and email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <textarea
            aria-label="Prepared enquiry text"
            readOnly
            value={draft}
            rows={8}
          />
          <div className="draft-actions">
            <a
              className="button flow-button"
              href={`mailto:${site.email}?subject=${encodeURIComponent(consultation ? "Consultation request — Domiorum" : "Project enquiry — Domiorum")}&body=${encodeURIComponent(draft)}`}
            >
              <FlowButtonContent>Open email app</FlowButtonContent>
            </a>
            <button className="text-button" onClick={copy} type="button">
              {copied ? "Copied" : "Copy enquiry"}
            </button>
          </div>
          <p className="small-note">
            Please send the email to complete your enquiry.
          </p>
          {copyError ? <p>Select the text above to copy it manually.</p> : null}
        </div>
      ) : null}
    </form>
  );
}
