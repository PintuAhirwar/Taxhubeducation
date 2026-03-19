"use client";
import { useEffect, useState, useRef } from "react";
import { apiGet } from "@/lib/api";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getImagePrefix } from "@/utils/util";

function getImageUrl(img) {
  if (!img || img === "null" || img === "undefined") return "/images/placeholder.jpg";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  const base = getImagePrefix().replace(/\/$/, "");
  const path = img.startsWith("/") ? img : `/${img}`;
  return `${base}${path}`;
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon={
            star <= Math.floor(rating)
              ? "tabler:star-filled"
              : star === Math.ceil(rating) && rating % 1 >= 0.5
              ? "tabler:star-half-filled"
              : "tabler:star"
          }
          className={`text-base ${star <= Math.ceil(rating) ? "text-amber-400" : "text-slate-300"}`}
        />
      ))}
      <span className="text-xs text-slate-400 ml-1 font-medium">{rating?.toFixed(1)}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/6" />
      </div>
    </div>
  );
}

const Testimonial = () => {
  const [testimonial, setTestimonial] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeIdx, setActiveIdx]     = useState(0);
  const trackRef    = useRef(null);
  const isDragging  = useRef(false);
  const dragStartX  = useRef(null);
  const scrollStart = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX   = useRef(null);

  useEffect(() => {
    setLoading(true);
    apiGet("/testimonial/")
      .then((data) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setTestimonial(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Active card detection on scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleScroll = () => {
      const cards = track.querySelectorAll(".testi-card");
      const cx    = track.scrollLeft + track.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((c, i) => {
        const dist = Math.abs((c.offsetLeft + c.offsetWidth / 2) - cx);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIdx(closest);
    };
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [testimonial]);

  // Mouse drag
  const handleMouseDown = (e) => {
    isDragging.current  = true;
    dragStartX.current  = e.clientX;
    scrollStart.current = trackRef.current?.scrollLeft || 0;
    if (trackRef.current) trackRef.current.style.cursor = "grabbing";
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStart.current - (e.clientX - dragStartX.current);
  };
  const handleMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  // Touch swipe
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove  = (e) => { touchEndX.current   = e.touches[0].clientX; };
  const handleTouchEnd   = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40)
      trackRef.current?.scrollBy({ left: diff > 0 ? 320 : -320, behavior: "smooth" });
    touchStartX.current = null;
    touchEndX.current   = null;
  };

  const scroll = (dir) =>
    trackRef.current?.scrollBy({ left: dir === "next" ? 320 : -320, behavior: "smooth" });

  return (
    <section id="testimonial" className="py-16 bg-deepSlate">
      <div className="container mx-auto lg:max-w-screen-xl px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold">
              What students<br />say about us.
            </h2>
            {!loading && testimonial.length > 0 && (
              <p className="text-slate-500 text-sm mt-2">
                {testimonial.length} student{testimonial.length !== 1 ? "s" : ""} shared their experience
              </p>
            )}
          </div>
          {/* Desktop arrows */}
          {!loading && testimonial.length > 3 && (
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scroll("prev")}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center
                           justify-center text-slate-600 hover:border-primary hover:text-primary
                           transition-all duration-200"
              >
                <Icon icon="mdi:chevron-left" className="text-xl" />
              </button>
              <button
                onClick={() => scroll("next")}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center
                           justify-center text-slate-600 hover:border-primary hover:text-primary
                           transition-all duration-200"
              >
                <Icon icon="mdi:chevron-right" className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* Slider track */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-4 overflow-x-auto pb-4 select-none"
          style={{
            scrollbarWidth:  "none",
            msOverflowStyle: "none",
            cursor:          "grab",
            scrollSnapType:  "x mandatory",
          }}
        >
          <style>{`
            section#testimonial div[style] ::-webkit-scrollbar { display: none; }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(14px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : testimonial.map((item, i) => (
                <div
                  key={item.id || i}
                  className="testi-card flex-shrink-0 w-72 sm:w-80"
                  style={{
                    scrollSnapAlign: "start",
                    animation: `fadeInUp 0.4s ease ${Math.min(i * 60, 360)}ms both`,
                  }}
                >
                  <div className={`bg-white rounded-2xl p-5 h-full flex flex-col border
                                   transition-all duration-300
                                   ${i === activeIdx
                                     ? "border-primary/20 shadow-lg shadow-primary/5 -translate-y-1"
                                     : "border-slate-100 hover:shadow-md hover:-translate-y-0.5"}`}>

                    {/* User info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 ring-2 ring-white shadow-sm">
                        <Image
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          width={48} height={48}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "/images/placeholder.jpg"; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                        {item.course && (
                          <p className="text-xs text-slate-400 truncate">{item.course}</p>
                        )}
                      </div>
                      {/* Quote icon */}
                      <div className="ml-auto flex-shrink-0">
                        <Icon icon="mdi:format-quote-close" className="text-2xl text-primary/20" />
                      </div>
                    </div>

                    {/* Feedback */}
                    <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-4">
                      {item.feedback}
                    </p>

                    {/* Rating */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <StarRating rating={item.rating || 5} />
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Mobile swipe hint */}
        {!loading && testimonial.length > 2 && (
          <p className="sm:hidden text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
            <Icon icon="mdi:gesture-swipe-horizontal" className="text-base" />
            Swipe to read more
          </p>
        )}

      </div>
    </section>
  );
};

export default Testimonial;