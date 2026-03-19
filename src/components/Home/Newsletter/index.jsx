"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { API_BASE } from "@/lib/api";
import { toast } from "react-toastify";

const SUBJECTS = [
  "Course Enquiry",
  "Demo Request",
  "Fee Structure",
  "Admission Query",
  "Technical Support",
  "Other",
];

const Newsletter = () => {
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm]           = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_BASE}/enquiry/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      toast.success("Enquiry submitted! We'll get back to you soon. 📩", {
        position: "bottom-center",
        autoClose: 3000,
      });
    } catch {
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto lg:max-w-screen-xl px-4">

        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
            Contact Us
          </p>
          <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold">
            Get In Touch
          </h2>
          <p className="text-slate-500 text-base mt-3 max-w-md mx-auto leading-relaxed">
            Have questions about our courses? We're here to help you make the right choice.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">

            {/* LEFT — Contact info panel */}
            <div className="bg-primary p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-44 h-44 bg-white/10 rounded-full translate-x-12 translate-y-12" />
              <div className="absolute bottom-12 right-8 w-28 h-28 bg-white/10 rounded-full" />

              <div className="relative z-10">
                <h3 className="text-white text-xl font-bold mb-3">Contact Information</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-10">
                  Fill up the form and our team will get back to you within 24 hours.
                </p>

                <div className="flex flex-col gap-6">
                  {[
                    { icon: "solar:phone-bold",     text: "+91 88713 09015"              },
                    { icon: "solar:letter-bold",    text: "classroomeducation@gmail.com" },
                    { icon: "solar:map-point-bold", text: "Indore (M.P.) 452010"         },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon icon={icon} className="text-white text-base" />
                      </div>
                      <span className="text-white/85 text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-3 mt-10">
                {[
                  { icon: "mdi:instagram", href: "#" },
                  { icon: "mdi:youtube",   href: "#" },
                  { icon: "mdi:whatsapp",  href: "#" },
                ].map(({ icon, href }) => (
                  <a key={icon} href={href}
                    className="w-8 h-8 bg-white/15 hover:bg-white/30 rounded-full
                               flex items-center justify-center transition-colors duration-200">
                    <Icon icon={icon} className="text-white text-sm" />
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT — Form — same style as AuthPage */}
            <div className="p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
                    <Icon icon="solar:check-circle-bold" className="text-4xl text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="text-sm text-primary font-semibold hover:underline underline-offset-4"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Send an Enquiry</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Fill in your details and we'll respond shortly.
                    </p>
                  </div>

                  <form onSubmit={handleEnquiry} className="space-y-4">

                    {/* Name + Phone */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5
                  focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
    <Icon icon="mdi:account-outline" className="text-slate-400 text-lg flex-shrink-0" />
    <input
      type="text" name="name" placeholder="Full name"
      value={form.name} onChange={handleChange} required
      className="flex-1 py-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400
                 focus:outline-none"
    />
  </div>
  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5
                  focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
    <Icon icon="mdi:phone-outline" className="text-slate-400 text-lg flex-shrink-0" />
    <input
      type="tel" name="phone" placeholder="Phone number"
      value={form.phone} onChange={handleChange} required
      className="flex-1 py-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400
                 focus:outline-none"
    />
  </div>
</div>

{/* Email */}
<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5
                focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
  <Icon icon="mdi:email-outline" className="text-slate-400 text-lg flex-shrink-0" />
  <input
    type="email" name="email" placeholder="Email address"
    value={form.email} onChange={handleChange} required
    className="flex-1 py-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400
               focus:outline-none"
  />
</div>

{/* Subject */}
<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5
                focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
  <Icon icon="mdi:tag-outline" className="text-slate-400 text-lg flex-shrink-0" />
  <select
    name="subject" value={form.subject} onChange={handleChange} required
    className="flex-1 py-3 bg-transparent text-sm text-slate-700 focus:outline-none
               appearance-none cursor-pointer"
  >
    <option value="" disabled>Select subject</option>
    {SUBJECTS.map((s) => (
      <option key={s} value={s}>{s}</option>
    ))}
  </select>
  <Icon icon="mdi:chevron-down" className="text-slate-400 text-base flex-shrink-0 pointer-events-none" />
</div>

{/* Message */}
<div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3
                focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
  <Icon icon="mdi:message-outline" className="text-slate-400 text-lg flex-shrink-0 mt-0.5" />
  <textarea
    name="message" placeholder="Write your message here..."
    rows={4} value={form.message} onChange={handleChange} required
    className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400
               focus:outline-none resize-none"
  />
</div>

                    <button
                      type="submit" disabled={loading}
                      className="flex items-center gap-2 bg-primary text-white hover:bg-primary/15 hover:text-primary px-8 py-3 rounded-full text-lg font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                    >
                      {loading
                        ? <><Icon icon="mdi:loading" className="animate-spin text-lg" /> Sending…</>
                        : <><Icon icon="solar:paper-plane-bold" className="text-base" /> Send Message</>
                      }
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;