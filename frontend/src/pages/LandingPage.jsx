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

/* ───────────────────────────────────────────────
   HERO SECTION
   ─────────────────────────────────────────────── */
function HeroSection({ setPage }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-uni-800 via-uni-600 to-uni-500"
    >
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 40L40 0H20L0 20M40 40V20L20 40"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-uni-300 animate-pulse"></span>
              New: AI-Powered Analytics
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Smart University <br className="hidden lg:block" />
              <span className="text-uni-200">System</span>
            </h1>

            <p className="text-lg sm:text-xl text-uni-50 mb-8 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Efficiently manage students, lecturers, administration, and
              technical operations in one intelligent, unified platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <motion.button
                onClick={() => setPage('login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-uni-700 font-semibold text-lg shadow-soft hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Started <ArrowRightIcon className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <PlayCircleIcon className="w-5 h-5" /> Explore Features
              </motion.button>
            </div>
          </motion.div>

          {/* Abstract Dashboard Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="relative w-full max-w-lg mx-auto"
            >
              {/* Main Dashboard Card */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: UsersIcon, color: 'text-teal-500', bg: 'bg-teal-50' },
                      { icon: BookOpenIcon, color: 'text-uni-500', bg: 'bg-uni-50' },
                      { icon: LayoutDashboardIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-gray-100 flex flex-col items-center gap-2"
                      >
                        <div className={`p-2 rounded-lg ${item.bg}`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="h-2 w-12 bg-gray-200 rounded-full"></div>
                        <div className="h-3 w-8 bg-gray-300 rounded-full"></div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-gray-200 rounded-full mb-4"></div>
                    <div className="flex items-end gap-2 h-32 pt-4 border-b border-gray-100">
                      {[40, 70, 45, 90, 65, 85, 55].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          className="flex-1 bg-uni-100 rounded-t-md relative group hover:bg-uni-200 transition-colors"
                        >
                          <div
                            className="absolute bottom-0 w-full bg-uni-500 rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ height: '40%' }}
                          ></div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-5, 5, -5], x: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">+85%</span>
                </div>
                <div>
                  <div className="h-2 w-16 bg-gray-200 rounded-full mb-2"></div>
                  <div className="h-2 w-10 bg-gray-100 rounded-full"></div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5], x: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -left-8 bottom-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-uni-600 flex items-center justify-center text-white text-xs font-bold">
                    A
                  </div>
                  <div className="h-3 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-32 bg-gray-100 rounded-full"></div>
                  <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 60C1200 60 1320 45 1380 37.5L1440 30V120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
