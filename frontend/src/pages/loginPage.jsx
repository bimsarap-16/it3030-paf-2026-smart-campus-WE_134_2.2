import React, { useState } from 'react';
import {
  Wrench,
  Eye,
  EyeOff,
  LogIn,
  Building2,
  Monitor,
  Wifi,
  ShieldCheck,
  ChevronRight,
  X,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

// ── Tiny animated building illustration ────────────────────────────────────
const BuildingIllustration = () => (
  <svg viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
    {/* Ground */}
    <rect x="20" y="230" width="300" height="6" rx="3" fill="rgba(255,255,255,0.15)" />

    {/* Building A — left */}
    <rect x="30" y="100" width="90" height="132" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
    {/* Windows A */}
    {[0, 1, 2].map(row => [0, 1].map(col => (
      <rect key={`a-${row}-${col}`} x={46 + col * 32} y={116 + row * 32} width="18" height="20" rx="3"
        fill={row === 2 && col === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)'}
        stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    )))}
    {/* Door A */}
    <rect x="60" y="196" width="20" height="36" rx="3" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

    {/* Building B — center-tall */}
    <rect x="135" y="60" width="80" height="172" rx="6" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    {/* Windows B */}
    {[0, 1, 2, 3].map(row => [0, 1].map(col => (
      <rect key={`b-${row}-${col}`} x={148 + col * 28} y={76 + row * 32} width="16" height="18" rx="3"
        fill={row === 1 && col === 1 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)'}
        stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    )))}
    {/* Roof accent */}
    <rect x="145" y="52" width="60" height="14" rx="4" fill="rgba(255,255,255,0.25)" />
    {/* Door B */}
    <rect x="160" y="196" width="30" height="36" rx="3" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

    {/* Building C — right */}
    <rect x="228" y="120" width="82" height="112" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
    {/* Windows C */}
    {[0, 1, 2].map(row => [0, 1].map(col => (
      <rect key={`c-${row}-${col}`} x={241 + col * 30} y={135 + row * 28} width="16" height="16" rx="3"
        fill={row === 0 && col === 1 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'}
        stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    )))}

    {/* Laptop / tech icon on floor */}
    <rect x="135" y="210" width="70" height="46" rx="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    <rect x="143" y="217" width="54" height="34" rx="3" fill="rgba(255,255,255,0.12)" />
    <line x1="130" y1="256" x2="210" y2="256" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />

    {/* Floating dots decoration */}
    {[[60, 50], [290, 88], [310, 170], [25, 190]].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="4" fill="rgba(255,255,255,0.25)" />
    ))}
    <circle cx="310" cy="60" r="7" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
  </svg>
);