"use client";
import { useState } from "react";
import { DocNavigation } from "./DocNavigation";
import { Demolecture } from "./Demolecture";
import { Demobooks } from "./Demobooks";

export const Documentation = () => {
  const [activeSection, setActiveSection] = useState("lecture"); // "lecture" or "book"

  return (
    <div>
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md p-6 lg:pt-44 pt-16">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar navigation */}
          <div className="lg:col-span-3 col-span-12 lg:block hidden">
            <DocNavigation
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-9 col-span-12">
            {activeSection === "lecture" && <Demolecture />}
            {activeSection === "book" && <Demobooks />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
