"use client";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const stats = [
  { value: "90%",  label: "Course completion rate" },
  { value: "9/10", label: "Better learning outcomes" },
  { value: "50K+", label: "Active learners" },
  { value: "4.9★", label: "Average course rating" },
];

const reasons = [
  {
    icon:  "solar:verified-check-bold",
    title: "Expert Mentors",
    desc:  "Learn directly from CA rankers and industry professionals with years of teaching experience. Our mentors have helped thousands of students clear their exams with top scores.",
  },
  {
    icon:  "solar:play-circle-bold",
    title: "Flexible Learning",
    desc:  "Study at your own pace with recorded lectures, live sessions, and downloadable study material. Access your content anytime, anywhere — mobile, tablet, or desktop.",
  },
  {
    icon:  "solar:diploma-bold",
    title: "Exam-Focused Content",
    desc:  "Curriculum designed around ICAI patterns — every topic mapped to exam relevance. We cover exactly what you need, nothing more, nothing less.",
  },
  {
    icon:  "solar:chart-2-bold",
    title: "Track Your Progress",
    desc:  "Detailed analytics, test series, and performance reports to keep you on track. Know exactly where you stand and what needs more attention.",
  },
  {
    icon:  "solar:headphones-round-bold",
    title: "Doubt Support",
    desc:  "Get your doubts resolved quickly through dedicated support channels and live Q&A sessions. No question goes unanswered.",
  },
  {
    icon:  "solar:shield-check-bold",
    title: "Trusted Platform",
    desc:  "Thousands of students have cleared their exams using our structured learning system. Join a community that celebrates success together.",
  },
];

const WhyChooseUs = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="why-us" className="py-20">
      <div className="container mx-auto lg:max-w-screen-xl px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
            Why Choose Us
          </p>
          <h2 className="text-midnight_text text-3xl sm:text-4xl lg:text-5xl font-semibold">
            Everything you need<br className="hidden sm:block" /> to succeed.
          </h2>
          <p className="text-slate-500 text-base mt-4 max-w-xl mx-auto leading-relaxed">
            From expert mentors to exam-focused content — we have built the complete
            learning ecosystem for CA aspirants.
          </p>
        </div>

        {/* Main grid — accordion left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center mb-16">

          {/* LEFT — accordion */}
          <div className="flex flex-col gap-3">
            {reasons.map((r, i) => {
              const isOpen = activeIdx === i;
              return (
                <div
                  key={r.title}
                  onClick={() => setActiveIdx(isOpen ? -1 : i)}
                  className={`rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden
                    ${isOpen
                      ? "border-primary/20 bg-primary/4 shadow-md shadow-primary/8"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"}`}
                >
                  {/* Row */}
                  <div className="flex items-center gap-4 p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                    transition-colors duration-300
                                    ${isOpen ? "bg-primary" : "bg-primary/10"}`}>
                      <Icon icon={r.icon}
                        className={`text-xl transition-colors duration-300
                          ${isOpen ? "text-white" : "text-primary"}`} />
                    </div>
                    <h3 className={`flex-1 font-semibold text-base transition-colors duration-200
                                    ${isOpen ? "text-primary" : "text-midnight_text"}`}>
                      {r.title}
                    </h3>
                    <Icon
                      icon="solar:alt-arrow-down-bold"
                      className={`text-lg flex-shrink-0 transition-all duration-300
                        ${isOpen ? "rotate-180 text-primary" : "text-slate-400"}`}
                    />
                  </div>

                  {/* Expandable content */}
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden
                                   ${isOpen ? "max-h-40" : "max-h-0"}`}>
                    <p className="text-slate-500 text-sm leading-relaxed px-4 pb-4 pl-[72px]">
                      {r.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT — image */}
          <div className="relative flex justify-center items-center order-first lg:order-last">
            {/* BG circle */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-primary/6" />

            {/* Main image */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white">
              <Image
                src="/images/about-main.jpg"
                alt="Student learning"
                width={480}
                height={540}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
              {/* Fallback */}
              <div className="w-full h-[420px] bg-gradient-to-br from-primary/15 via-primary/8 to-transparent
                              items-center justify-center hidden">
                <Icon icon="solar:user-rounded-bold" className="text-primary/30 text-9xl" />
              </div>
            </div>

            {/* Floating stat badges */}
            <div className="absolute top-6 left-0 z-20 bg-white rounded-2xl shadow-lg px-4 py-3
                            ring-1 ring-slate-100">
              <p className="text-primary text-2xl font-black leading-none">50K+</p>
              <p className="text-slate-500 text-xs font-medium mt-0.5">Active<br/>Learners</p>
            </div>

            <div className="absolute bottom-6 right-0 z-20 bg-white rounded-2xl shadow-lg px-4 py-3
                            ring-1 ring-slate-100">
              <p className="text-primary text-2xl font-black leading-none">4.9★</p>
              <p className="text-slate-500 text-xs font-medium mt-0.5">Average<br/>Rating</p>
            </div>

            {/* Spinning ring */}
            <div className="absolute bottom-16 left-4 w-14 h-14 rounded-full
                            border-4 border-dashed border-primary/20 animate-spin"
                 style={{ animationDuration: "12s" }} />
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <div
              key={s.value}
              className="bg-white px-6 py-8 text-center"
              style={{ animation: `fadeInUp 0.4s ease ${i * 80}ms both` }}
            >
              <p className="text-primary text-3xl sm:text-4xl font-black leading-none">{s.value}</p>
              <p className="text-midnight_text text-sm font-semibold mt-2">{s.label}</p>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;