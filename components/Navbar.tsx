"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: "rgba(3,7,18,0.85)", backdropFilter: "blur(16px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center glow-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#030712" strokeWidth="2"/>
                <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" fill="#030712"/>
              </svg>
            </div>
            <span className="font-display text-2xl tracking-wider text-white">
              MATCH<span className="text-brand-400">PULSE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#partidos" className="text-sm text-slate-400 hover:text-white transition-colors">Partidos</Link>
            <Link href="/#como-funciona" className="text-sm text-slate-400 hover:text-white transition-colors">Cómo funciona</Link>
            <Link href="/#precios" className="text-sm text-slate-400 hover:text-white transition-colors">Precios</Link>
            <Link href="/matches" className="text-sm text-slate-400 hover:text-white transition-colors">Ver Todo</Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/premium"
              className="px-4 py-2 text-sm font-medium text-dark-900 bg-brand-500 hover:bg-brand-400 rounded-lg transition-all duration-200 glow-green">
              Acceso Premium
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/5 mt-2 pt-4 space-y-3">
            <Link href="/#partidos" className="block text-sm text-slate-400 hover:text-white px-2 py-1" onClick={() => setMenuOpen(false)}>Partidos</Link>
            <Link href="/#como-funciona" className="block text-sm text-slate-400 hover:text-white px-2 py-1" onClick={() => setMenuOpen(false)}>Cómo funciona</Link>
            <Link href="/#precios" className="block text-sm text-slate-400 hover:text-white px-2 py-1" onClick={() => setMenuOpen(false)}>Precios</Link>
            <Link href="/matches" className="block text-sm text-slate-400 hover:text-white px-2 py-1" onClick={() => setMenuOpen(false)}>Ver Todo</Link>
            <Link href="/premium"
              className="block w-full text-center px-4 py-2 text-sm font-medium text-dark-900 bg-brand-500 rounded-lg mt-2"
              onClick={() => setMenuOpen(false)}>
              Acceso Premium
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
