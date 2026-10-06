"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/LinkButton";
import { navigation } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && menuRef.current) {
        const links = Array.from(
          menuRef.current.querySelectorAll<HTMLAnchorElement>("a"),
        );
        const first = triggerRef.current;
        const last = links.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 900) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="site-header">
      <Link
        href="/"
        className="brand"
        aria-label="Domiorum Architects home"
        onClick={() => setOpen(false)}
      >
        <Image
          src="/brand/domiorum-banner.webp"
          alt="Domiorum Architects"
          width={1000}
          height={280}
          preload
        />
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <LinkButton href="/book-consultation" light className="header-cta">
        Let’s talk
      </LinkButton>
      <button
        ref={triggerRef}
        className="menu-trigger"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div
        id="mobile-navigation"
        ref={menuRef}
        className="mobile-navigation"
        hidden={!open}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              <span className="menu-number">0{index + 1}</span>
              {link.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link href="/book-consultation" onClick={() => setOpen(false)}>
            <span className="menu-number">05</span>Let’s talk
            <span aria-hidden="true">↗</span>
          </Link>
        </nav>
        <p>Architecture & interiors · Dhaka</p>
      </div>
    </header>
  );
}
