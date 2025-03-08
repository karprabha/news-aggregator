import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleToggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={`px-3 py-2 text-sm font-medium ${
          isActive("/")
            ? "rounded-md bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        }`}
        aria-current={isActive("/") ? "page" : undefined}
        onClick={handleCloseMenu}
      >
        Home
      </Link>
      <Link
        href="/search"
        className={`px-3 py-2 text-sm font-medium ${
          isActive("/search")
            ? "rounded-md bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        }`}
        aria-current={isActive("/search") ? "page" : undefined}
        onClick={handleCloseMenu}
      >
        Search
      </Link>
      <Link
        href="/preferences"
        className={`px-3 py-2 text-sm font-medium ${
          isActive("/preferences")
            ? "rounded-md bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        }`}
        aria-current={isActive("/preferences") ? "page" : undefined}
        onClick={handleCloseMenu}
      >
        Preferences
      </Link>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <Link
            href="/"
            className="text-xl font-bold"
            aria-label="Go to homepage"
          >
            NewsAggregator
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-4">
            <NavLinks />
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500 md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
            onClick={handleToggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            {/* Icon when menu is closed */}
            <svg
              className={`h-6 w-6 ${mobileMenuOpen ? "hidden" : "block"}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            {/* Icon when menu is open */}
            <svg
              className={`h-6 w-6 ${mobileMenuOpen ? "block" : "hidden"}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          id="mobile-menu"
          className={`fixed inset-y-0 right-0 z-50 w-64 transform overflow-y-auto bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out dark:bg-neutral-900 md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Menu</span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              aria-label="Close menu"
              onClick={handleCloseMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="mt-6 flex flex-col space-y-3">
            <NavLinks />
          </nav>
        </div>

        {/* Overlay that appears when mobile menu is open */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
            aria-hidden="true"
            onClick={handleCloseMenu}
          ></div>
        )}
      </header>

      <main className="flex-1 bg-neutral-50 px-4 py-8 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      <footer className="border-t border-neutral-200 bg-white py-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            © {new Date().getFullYear()} NewsAggregator. All rights reserved.
          </p>
          <p className="mt-2">
            Powered by NewsAPI, The Guardian, and The New York Times
          </p>
        </div>
      </footer>
    </div>
  );
};
