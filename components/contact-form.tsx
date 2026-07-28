"use client";

import Script from "next/script";
import { useState } from "react";

const initial = {
  name: "",
  company: "",
  role: "",
  email: "",
  phone: "",
  industry: "",
  location: "",
  message: "",
  preferredContact: "Email",
  turnstileToken: "",
  consent: false
};

export function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    if (!form.name || !form.company || !form.email || !form.industry || !form.message || !form.consent) {
      setStatus("error");
      setError("Please complete the required fields and confirm privacy consent.");
      return;
    }

    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setStatus("error");
      setError("We could not send the enquiry. Please try again or email hello@verifair.com.au.");
      return;
    }

    setForm(initial);
    setStatus("success");
  }

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <form onSubmit={submit} className="card grid gap-5 p-5 shadow-sm" noValidate>
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
          onReady={() => {
            window.onVerifAirTurnstile = (token: string) => setForm((current) => ({ ...current, turnstileToken: token }));
          }}
        />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" required value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Field label="Company" required value={form.company} onChange={(value) => setForm({ ...form, company: value })} />
        <Field label="Role" value={form.role} onChange={(value) => setForm({ ...form, role: value })} />
        <Field label="Email" required type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <Field label="Phone" type="tel" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
        <Field label="Project location" value={form.location} onChange={(value) => setForm({ ...form, location: value })} />
      </div>
      <label className="grid gap-2 text-sm font-bold">
        Industry
        <select required className="rounded-md border border-slate-300 px-3 py-3" value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })}>
          <option value="">Select industry</option>
          {["Healthcare", "Construction", "Infrastructure", "Government", "School or education", "Commercial property", "Industrial facility", "Other"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Preferred contact method
        <select className="rounded-md border border-slate-300 px-3 py-3" value={form.preferredContact} onChange={(event) => setForm({ ...form, preferredContact: event.target.value })}>
          <option>Email</option>
          <option>Phone</option>
          <option>Either</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Message
        <textarea required className="min-h-36 rounded-md border border-slate-300 px-3 py-3" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
      </label>
      <label className="flex gap-3 text-sm leading-6 text-slate-700">
        <input className="mt-1 h-5 w-5 rounded border-slate-300" type="checkbox" checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} />
        <span>I consent to VerifAir collecting and using this information to respond to my enquiry in accordance with the privacy policy.</span>
      </label>
      {turnstileSiteKey ? <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-callback="onVerifAirTurnstile" /> : null}
      {status === "error" ? <p className="rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
      {status === "success" ? <p className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">Thank you. Your enquiry has been received and the VerifAir team will respond with next steps.</p> : null}
      <button className="btn btn-primary justify-self-start" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Book demonstration"}
      </button>
    </form>
  );
}

declare global {
  interface Window {
    onVerifAirTurnstile?: (token: string) => void;
  }
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <input required={required} type={type} className="rounded-md border border-slate-300 px-3 py-3" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
