import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCapIcon,
  GlobeIcon,
  LinkIcon,
  CodeIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  UsersIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  MenuIcon,
  XIcon,
  CheckCircle2Icon,
  StarIcon,
  QuoteIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from 'lucide-react'

/* ───────────────────────────────────────────────
   NAVBAR
   ─────────────────────────────────────────────── */
function LandingNavbar({ setPage }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Roles', href: '#roles' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="bg-uni-600 p-2 rounded-xl group-hover:bg-uni-500 transition-colors">
              <GraduationCapIcon className="w-6 h-6 text-white" />
            </div>
            <span
              className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'
                }`}
            >
              SmartUni
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-uni-500 ${isScrolled ? 'text-gray-600' : 'text-white/90'
                  }`}
              >
                {link.name}
              </a>
            ))}

            <motion.button
              onClick={() => setPage('login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${isScrolled
                ? 'bg-uni-600 text-white hover:bg-uni-700 shadow-md'
                : 'bg-white text-uni-600 hover:bg-gray-50'
                }`}
            >
              Get Started
            </motion.button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XIcon
                className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'
                  }`}
              />
            ) : (
              <MenuIcon
                className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'
                  }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-uni-600 hover:bg-uni-50 rounded-lg"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 px-3">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setPage('login'); }}
                  className="block w-full text-center px-5 py-3 rounded-xl text-base font-semibold bg-uni-600 text-white hover:bg-uni-700 shadow-md cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}