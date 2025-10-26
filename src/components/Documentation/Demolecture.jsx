"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dialog } from "@headlessui/react";
import { DocNavigation } from "./DocNavigation";

export const Demolecture = () => {
  const [docNavbarOpen, setDocNavbarOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lecture, setDemolecture] = useState([]);

  useEffect(() => {
    apiGet("/demolecture/")
      .then(setDemolecture)
      .catch(console.error);
  }, []);

  // ✅ Function to get embeddable URLs
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube long link
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // YouTube short link
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Google Drive PDF (view only)
    if (url.includes("drive.google.com") && url.includes("/view")) {
      return url.replace("/view", "/preview");
    }

    // Direct PDF
    if (url.endsWith(".pdf")) {
      return url + "#view=FitH";
    }

    return url; // default
  };

  return (
    <>
      <section id="lectures" className="md:scroll-m-[180px] scroll-m-28">
        {docNavbarOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
            onClick={() => setDocNavbarOpen(false)}
          />
        )}

        {/* Header */}
        <div className="sm:flex justify-between items-center mb-10">
          <h3 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">
            Demo Lectures.
          </h3>
          <button onClick={() => setDocNavbarOpen(true)} className="p-0">
            <Icon icon="gg:menu-right" className="text-3xl lg:hidden block" />
          </button>
        </div>
                {/* Footer Note */}
        <div className="mt-10">
          <p className="text-base font-medium text-black text-opacity-60">
            These demo lectures are provided for preview purposes. Access full lectures in the course.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          {lecture.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-course-shadow overflow-hidden h-full flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-w-16 aspect-h-9 bg-black">
                {getEmbedUrl(item.url) && (
                  <iframe
                    src={getEmbedUrl(item.url)}
                    title={item.title}
                    allowFullScreen
                    className="w-full h-full pointer-events-none"
                  />
                )}
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col flex-grow">
                <h5 className="text-xl font-bold text-black mb-3 line-clamp-1">
                  {item.title}
                </h5>
                <p className="text-base text-black/70 line-clamp-2 flex-grow">
                  {item.description}
                </p>

                <button
                  onClick={() => setSelectedLecture(item)}
                  className="mt-4 text-primary text-sm font-medium hover:tracking-wide duration-300 self-start"
                >
                  ▶ Watch & Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video / PDF Modal */}
      <Dialog
        open={!!selectedLecture}
        onClose={() => setSelectedLecture(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 mx-4 z-50">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
            onClick={() => setSelectedLecture(null)}
          >
            ✕
          </button>

          {selectedLecture && getEmbedUrl(selectedLecture.url) && (
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden mb-6">
              <iframe
                src={getEmbedUrl(selectedLecture.url)}
                title={selectedLecture.title}
                allowFullScreen
                className="w-full h-96"
              />
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 text-black">
            {selectedLecture?.title}
          </h3>

          {/* Full Description */}
          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
            {selectedLecture?.description}
          </p>
        </div>
      </Dialog>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden block fixed top-0 right-0 h-full w-full bg-white dark:bg-dark shadow-lg transform transition-transform duration-300 max-w-xs ${
          docNavbarOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold text-midnight_text dark:text-black">
            Docs Menu
          </h2>
          <button
            onClick={() => setDocNavbarOpen(false)}
            aria-label="Close mobile menu"
          >
            <Icon icon="mdi:close" className="text-2xl" />
          </button>
        </div>
        <nav className="px-4">
          <DocNavigation />
        </nav>
      </div>
    </>
  );
};
