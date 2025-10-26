"use client";

export const DocNavigation = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="flex justify-center gap-6 py-4">
      <button
        className={`transition-all duration-300 ${
          activeSection === "lecture"
            ? "hidden lg:block bg-primary text-white hover:bg-primary/15 hover:text-primary px-8 py-3 rounded-full text-lg font-medium"
            : "bg-primary/15 text-primary hover:bg-primary hover:text-white px-16 py-5 rounded-full text-lg font-medium"
        }`}
        onClick={() => onSectionChange("lecture")}
      >
        Lectures
      </button>

      <button
        className={`transition-all duration-300 ${
          activeSection === "book"
            ? "hidden lg:block bg-primary text-white hover:bg-primary/15 hover:text-primary px-8 py-3 rounded-full text-lg font-medium"
            : "bg-primary/15 text-primary hover:bg-primary hover:text-white px-16 py-5 rounded-full text-lg font-medium"
        }`}
        onClick={() => onSectionChange("book")}
      >
        Books
      </button>
    </nav>
  );
};
