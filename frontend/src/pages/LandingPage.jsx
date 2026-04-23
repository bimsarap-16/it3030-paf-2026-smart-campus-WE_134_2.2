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

/* ───────────────────────────────────────────────
   ROLE SECTION
   ─────────────────────────────────────────────── */
function RoleSection({
  id,
  title,
  description,
  features,
  icon: Icon,
  imagePosition,
  illustration,
  bgClass = 'bg-white',
}) {
  const isLeft = imagePosition === 'left'

  return (
    <section id={id} className={`py-24 overflow-hidden ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
            } gap-16 items-center`}
        >
          {/* Illustration Side */}
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full lg:w-1/2"
          >
            <div className="relative">
              {/* Decorative background blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-uni-50 rounded-full blur-3xl -z-10"></div>
              {illustration}
            </div>
          </motion.div>

          {/* Text Content Side */}
          <motion.div
            initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-uni-100 text-uni-600 mb-2 shadow-sm">
              <Icon className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                {title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
                >
                  <CheckCircle2Icon className="w-6 h-6 text-uni-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-md"
            >
              Learn more about {title}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────
   TESTIMONIALS SECTION
   ─────────────────────────────────────────────── */
const testimonials = [
  {
    quote:
      'SmartUni has completely transformed how we manage our daily operations. The admin dashboard is incredibly intuitive.',
    name: 'Dr. Sarah Jenkins',
    role: 'University Administrator',
    avatar: 'SJ',
  },
  {
    quote:
      'As a lecturer, tracking student progress and managing assignments has never been easier. It saves me hours every week.',
    name: 'Prof. Michael Chen',
    role: 'Computer Science Dept.',
    avatar: 'MC',
  },
  {
    quote:
      'The student portal is clean and fast. I can always find my course materials and check my grades instantly.',
    name: 'Emily Rodriguez',
    role: 'Senior Student',
    avatar: 'ER',
  },
]

function TestimonialsSection() {
  return (
    <section className="py-24 bg-uni-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-uni-200 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Trusted by Universities Worldwide
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            See what administrators, lecturers, and students are saying about
            their experience with SmartUni.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-xl transition-all border border-gray-100 relative group"
            >
              <QuoteIcon className="absolute top-6 right-6 w-10 h-10 text-uni-100 group-hover:text-uni-200 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 fill-uni-400 text-uni-400"
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-8 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-uni-100 text-uni-700 flex items-center justify-center font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────
   FOOTER
   ─────────────────────────────────────────────── */
function LandingFooter() {
  return (
    <footer
      id="contact"
      className="bg-gray-900 text-gray-300 pt-20 pb-10 border-t border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-1 space-y-6">
            <a href="#home" className="flex items-center gap-2">
              <div className="bg-uni-600 p-2 rounded-xl">
                <GraduationCapIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                SmartUni
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering educational institutions with intelligent management
              tools for a brighter future.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-uni-600 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-uni-600 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-uni-600 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#features"
                  className="hover:text-uni-400 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#roles"
                  className="hover:text-uni-400 transition-colors"
                >
                  Roles &amp; Solutions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-uni-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-uni-400 transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="hover:text-uni-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-uni-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-uni-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-uni-400 transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MailIcon className="w-5 h-5 text-uni-500 mt-0.5" />
                <span>hello@smartuni.edu</span>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon className="w-5 h-5 text-uni-500 mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-uni-500 mt-0.5" />
                <span>
                  123 Innovation Drive
                  <br />
                  Tech District, CA 94103
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Smart University System. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}