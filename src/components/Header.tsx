"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={closeMobileMenu}
        >
          <Image
            src="/QCS-O.webp"
            alt="QCS ABROAD logo"
            width={44}
            height={44}
            priority
            className="h-11 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="flex items-baseline gap-1 overflow-hidden">
            <span className="text-2xl font-bold tracking-tight text-[var(--color-primary)] transition-transform duration-300 group-hover:-translate-y-0.5">
              QCS
            </span>
            <span className="text-2xl font-light tracking-wide text-[var(--color-accent)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:tracking-wider">
              ABROAD
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[var(--color-accent)] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="btn btn-primary ml-2 text-sm px-5 py-2"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-muted)] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="border-t border-[var(--color-border-light)] bg-white px-6 pb-6 pt-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-muted)] hover:text-[var(--color-primary)] transition-colors"
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2">
            <Link
              href="/register"
              className="btn btn-outline w-full text-center"
              onClick={closeMobileMenu}
            >
              Register
            </Link>
            <Link
              href="/login"
              className="btn btn-primary w-full text-center"
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
