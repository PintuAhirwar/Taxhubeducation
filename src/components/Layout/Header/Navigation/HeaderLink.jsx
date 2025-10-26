"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderLink = ({ item, hrefOverride }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();
  const [isActive, setIsActive] = useState(false);

  if (!item) return null;

  const linkHref = hrefOverride || item.href || "/";

  useEffect(() => {
    const isLinkActive =
      path === linkHref ||
      (item.submenu && Array.isArray(item.submenu) && item.submenu.some(subItem => path === subItem.href)) ||
      false;
    setIsActive(isLinkActive);
  }, [path, item, linkHref]);

  const handleMouseEnter = () => item.submenu && setSubmenuOpen(true);
  const handleMouseLeave = () => setSubmenuOpen(false);

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        href={linkHref.startsWith("/") ? linkHref : `/${linkHref}`}
        className={`text-lg flex hover:text-black capitalize relative ${
          isActive
            ? "text-black after:absolute after:w-8 after:h-1 after:bg-primary after:rounded-full after:-bottom-1"
            : "text-grey"
        }`}
      >
        {item.label}
        {item.submenu && (
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m7 10l5 5l5-5"
            />
          </svg>
        )}
      </Link>

      {submenuOpen && item.submenu && (
        <div className="absolute py-2 left-0 mt-0.5 w-60 bg-white dark:bg-darklight dark:text-white shadow-lg rounded-lg">
          {item.submenu.map((subItem, index) => {
            const isSubItemActive = path === subItem.href;
            return (
              <Link
                key={index}
                href={subItem.href.startsWith("/") ? subItem.href : `/${subItem.href}`}
                className={`block px-4 py-2 ${
                  isSubItemActive
                    ? "bg-primary text-white"
                    : "text-black dark:text-white hover:bg-primary"
                }`}
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
