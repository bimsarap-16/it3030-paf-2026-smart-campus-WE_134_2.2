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

// ── Feature pill ────────────────────────────────────────────────────────────
const FeaturePill = ({ icon, label }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
    <span className="text-white/80">{icon}</span>
    <span className="text-white/90 text-xs font-semibold">{label}</span>
  </div>
);


// ── Main Component ──────────────────────────────────────────────────────────
const LoginPage = ({ setPage, setUser }) => {
  const [credentials, setCredentials] = useState({
  lecturer: { username: '', password: '' },
  technician: { username: '', password: '' },
  admin: { username: '', password: '' }
  });
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('lecturer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Registration modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('');
  const [regEmpId, setRegEmpId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regShowPass, setRegShowPass] = useState(false);
  const [regShowConfirm, setRegShowConfirm] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [regRole, setRegRole] = useState('lecturer');
  const [googleLoading, setGoogleLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const [otpStep, setOtpStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const validatePassword = (pass) => {
    if (pass.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(pass)) return 'Password must include at least one capital letter.';
    if (!/[a-z]/.test(pass)) return 'Password must include at least one simple letter.';
    return null;
  };

  // Google OAuth handler
  const handleGoogleAuth = async (credentialResponse, authRole) => {
    setGoogleLoading(true);
    setError('');
    setRegError('');
    try {
      const res = await fetch('http://localhost:8081/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          role: authRole || role
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        if (res.status === 403) {
          setError(errData.error || 'Account pending approval.');
        } else {
          setError(errData.error || 'Google authentication failed.');
        }
        return;
      }
      const data = await res.json();
      if (data.isNew) {
        // New registration via Google
        setRegSuccess(true);
        setShowRegisterModal(true);
        setTimeout(() => { setShowRegisterModal(false); resetRegForm(); }, 2500);
      } else {
        // Existing user — log them in
        if (setUser) setUser(data.user || data);
        if (setPage) {
          const r = data.role || authRole || role;
          if (r === 'admin') setPage('admin');
          else if (r === 'technician') setPage('technician');
          else setPage('lecturer');
        }
      }
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const resetRegForm = () => {
    setRegName(''); setRegEmail(''); setRegDept('');
    setRegEmpId(''); setRegPassword(''); setRegConfirm('');
    setRegError(''); setRegSuccess(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim() || !regEmail.trim() || !regDept.trim() || !regEmpId.trim() || !regPassword.trim() || !regConfirm.trim()) {
      setRegError('All fields are required.');
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match.');
      return;
    }
    const passError = validatePassword(regPassword);
    if (passError) {
      setRegError(passError);
      return;
    }
    setRegLoading(true);
    try {
      const endpoint = regRole === 'lecturer' ? 'lecturers' : 'technicians';
      const body = regRole === 'lecturer'
        ? { name: regName, email: regEmail, dept: regDept, empId: regEmpId, password: regPassword }
        : { name: regName, email: regEmail, spec: regDept, empId: regEmpId, password: regPassword };

      const res = await fetch(`http://localhost:8081/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Registration failed');
      setRegSuccess(true);
      setTimeout(() => { setShowRegisterModal(false); resetRegForm(); }, 2000);
    } catch (err) {
      setRegError('Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { username, password } = credentials[role];
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      let endpoint = '';
      let body = {};

      if (role === 'admin') {
        endpoint = 'admins/login';
        body = { username, password };
      } else if (role === 'technician') {
        endpoint = 'technicians/login';
        body = { email: username, password };
      } else {
        // For now, let's keep lecturer simple or update it too if backend has /login
        // Actually, let's look at AdminController again... login is there.
        // I'll assume lecturer has a similar simple login or I'll implement it.
        // But the request was specifically about technicians.
        endpoint = 'lecturers/login'; // Assuming I might need to add this or use existing
        body = { email: username, password };
      }

      const res = await fetch(`http://localhost:8081/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        setError('Login failed. Please check your credentials.');
        return;
      }

      const userData = await res.json();
      if (!userData) {
        if (role === 'technician') {
          setError('Account pending approval or invalid credentials.');
        } else {
          setError('Invalid credentials.');
        }
        return;
      }

      if (setUser) setUser(userData);
      if (setPage) {
        if (role === 'admin') setPage('admin');
        else if (role === 'technician') setPage('technician');
        else setPage('lecturer');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
      if (!forgotEmail) {
        setForgotMsg('Enter email');
        return;
      }

        setOtpLoading(true); 
        setForgotMsg('');
    
      try {
        let endpoint = "";

        if (role === "technician") {
          endpoint = "technicians";
        } else {
          endpoint = "lecturers";
        }

          const res = await fetch(`http://localhost:8081/api/${endpoint}/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail })
        });
    
        const data = await res.text();
        setForgotMsg(data);
    
        if (data === "OTP sent") {
          setOtpStep(2); // 👉 move to OTP step
        }
    
      } catch {
        setForgotMsg('Server error');
      }finally {
        setOtpLoading(false); 
      }
    };

  const handleResetPassword = async () => {
    try {
      let endpoint = "";

      if (role === "technician") {
        endpoint = "technicians";
      } else {
        endpoint = "lecturers";
      }

      const passError = validatePassword(newPassword);
      if (passError) {
        setForgotMsg(passError);
        return;
      }

      const res = await fetch(`http://localhost:8081/api/${endpoint}/reset-password`, {
      method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otp,
          newPassword: newPassword
        })
      });
  
      const data = await res.text();
      setForgotMsg(data);
  
      if (data === "Password updated") {
        setTimeout(() => {
          setShowForgot(false);
        }, 1500);
      }
  
    } catch {
      setForgotMsg('Error resetting password');
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* ── LEFT PANEL — Branding ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 40%, #064e3b 100%)',
        }}
      >
        {/* Background blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6ee7b7, transparent)' }} />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 relative z-10"
        >
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center">
            <Wrench size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none tracking-tight">TechPortal</p>
            <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest">Smart University System</p>
          </div>
        </motion.div>

        {/* Hero text + illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <h1 className="text-white font-black text-4xl leading-tight mb-3 tracking-tight">
            Smart<br />
            <span className="text-teal-200">Uni</span> System
          </h1>
          <p className="text-white/65 text-sm mb-10 max-w-xs leading-relaxed">
            One unified platform for booking resources, managing facilities, and handling maintenance requests.
          </p>

          <BuildingIllustration />
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-3 relative z-10"
        >
          <FeaturePill icon={<Building2 size={14} />} label="Resource Booking" />
          <FeaturePill icon={<Wrench size={14} />} label="Maintenance Tickets" />
          <FeaturePill icon={<Monitor size={14} />} label="Smart Dashboard" />
          <FeaturePill icon={<Wifi size={14} />} label="Real-time Updates" />
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — Login Form ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fa] p-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo (visible only on small screens) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <Wrench size={20} className="text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg leading-none">TechPortal</p>
              <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Smart University System</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-1 bg-emerald-600 rounded-full" />
              <div className="w-4 h-1 bg-emerald-200 rounded-full" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm">Sign in to your account to continue.</p>
          </div>

          {/* Role Selector */}
          <div className="mb-8">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3 block">
              Sign in as
            </label>
            <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
              {[
                { id: 'lecturer', label: 'Lecturer' },
                { id: 'technician', label: 'Technician' },
                { id: 'admin', label: 'Admin' },
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${role === r.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                User Name
              </label>
              <div className="relative">
                <input
                  key={role + '-username'}
                  id="username"
                  name="username"
                  type="email"
                  value={credentials[role].username}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      [role]: {
                        ...credentials[role],
                        username: e.target.value
                      }
                    })
                  }
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all shadow-sm placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setOtpStep(1);
                    setOtp('');
                    setNewPassword('');
                    setForgotMsg('');
                  }}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  key={role + '-password'}
                  id="password"
                  name="password" 
                  type={showPass ? 'text' : 'password'}
                  value={credentials[role].password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      [role]: {
                        ...credentials[role],
                        password: e.target.value
                      }
                    })
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 pr-14 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all shadow-sm placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors p-1"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 rounded-2xl px-5 py-3.5 text-red-600 text-xs font-semibold flex items-center gap-2"
              >
                <ShieldCheck size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 text-sm mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Login
                  <ChevronRight size={16} className="opacity-70" />
                </>
              )}
            </button>
          </form>

          {role !== 'admin' && (
            <>
              {/* Divider */}
              <div className="flex items-center gap-4 mt-8 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Sign-In Button */}
              <div className="flex justify-center mb-0">
                <GoogleLogin
                  onSuccess={(credentialResponse) => handleGoogleAuth(credentialResponse, role)}
                  onError={() => setError('Google Sign-In failed. Please try again.')}
                  theme="outline"
                  size="large"
                  width="400"
                  text="signin_with"
                  shape="pill"
                  logo_alignment="center"
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mt-10 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">new here?</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Register Button */}
              <div className="flex justify-center mb-4">
                <button
                  id="register-btn"
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="w-full max-w-[400px] bg-white hover:bg-gray-50 text-teal-600 font-bold py-[11px] rounded-full transition-all duration-200 shadow-sm border border-gray-200 hover:border-teal-200 flex items-center justify-center gap-3 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                  Register to System
                </button>
              </div>

              <div className="flex justify-center mt-2">
                <GoogleLogin
                  onSuccess={(credentialResponse) => handleGoogleAuth(credentialResponse, role)}
                  onError={() => setError('Google Sign-Up failed. Please try again.')}
                  theme="outline"
                  size="large"
                  width="400"
                  text="signup_with"
                  shape="pill"
                  logo_alignment="center"
                />
              </div>
            </>
          )}

          {/* Footer note */}
          <p className="text-center text-[11px] text-gray-300 font-bold uppercase tracking-widest mt-8">
            Smart Campus Booking &amp; Maintenance Hub
          </p>
        </motion.div>
      </div>

      {/* ── Register Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden"
            >
              {/* Modal Header */}
              <div
                className="relative p-8 pb-6"
                style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}
              >
                <button
                  onClick={() => { setShowRegisterModal(false); resetRegForm(); }}
                  className="absolute top-6 right-6 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center">
                    <GraduationCap size={22} className="text-white" />
                  </div>
                </div>
                <div className="flex gap-2 mb-4 bg-black/10 p-1 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setRegRole('lecturer')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${regRole === 'lecturer' ? 'bg-white text-teal-700 shadow-sm' : 'text-white/60 hover:text-white'}`}
                  >
                    Lecturer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('technician')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${regRole === 'technician' ? 'bg-white text-teal-700 shadow-sm' : 'text-white/60 hover:text-white'}`}
                  >
                    Technician
                  </button>
                </div>
                <h3 className="text-white font-black text-2xl tracking-tight">{regRole === 'lecturer' ? 'Lecturer' : 'Technician'}</h3>
                <h3 className="text-teal-200 font-black text-2xl tracking-tight">Registration</h3>
                <p className="text-white/60 text-xs mt-2">Create your account to access the system.</p>
              </div>

              {/* Modal Body */}
              <div className="p-8 pt-6">
                {regSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center text-green-600 mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Registration Successful!</h4>
                    <p className="text-sm text-gray-400">
                      {regRole === 'lecturer'
                        ? 'Your lecturer account has been created. You can now sign in.'
                        : 'Your request has been sent for admin approval. You can sign in once approved.'}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="e.g. Dr. Sarah Johnson"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all placeholder:text-gray-300"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="e.g. sarah.j@uni.edu"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all placeholder:text-gray-300"
                      />
                    </div>

                    {/* Dept + EmpId */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{regRole === 'lecturer' ? 'Department' : 'Specialization'}</label>
                        <input
                          type="text"
                          value={regDept}
                          onChange={e => setRegDept(e.target.value)}
                          placeholder={regRole === 'lecturer' ? "e.g. Computer Science" : "e.g. Electrical"}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Employee ID</label>
                        <input
                          type="text"
                          value={regEmpId}
                          onChange={e => setRegEmpId(e.target.value)}
                          placeholder="e.g. EMP8801"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                      <div className="relative">
                        <input
                          type={regShowPass ? 'text' : 'password'}
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 pr-14 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all placeholder:text-gray-300"
                        />
                        <button type="button" onClick={() => setRegShowPass(v => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-teal-600 transition-colors p-1">
                          {regShowPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={regShowConfirm ? 'text' : 'password'}
                          value={regConfirm}
                          onChange={e => setRegConfirm(e.target.value)}
                          placeholder="Re-enter your password"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 pr-14 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all placeholder:text-gray-300"
                        />
                        <button type="button" onClick={() => setRegShowConfirm(v => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-teal-600 transition-colors p-1">
                          {regShowConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Error */}
                    {regError && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-100 rounded-2xl px-5 py-3.5 text-red-600 text-xs font-semibold flex items-center gap-2"
                      >
                        <ShieldCheck size={16} className="shrink-0" />
                        {regError}
                      </motion.div>
                    )}

                    {/* Submit */}
                    <div className="flex gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowRegisterModal(false); resetRegForm(); }}
                        className="flex-1 py-4 text-xs font-bold text-gray-400 hover:text-gray-700 transition-all rounded-2xl hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={regLoading}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-2 text-xs"
                      >
                        {regLoading ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Registering…
                          </>
                        ) : `Register as ${regRole === 'lecturer' ? 'Lecturer' : 'Technician'}`}
                      </button>
                    </div>

                    {/* Google Sign-Up Divider */}
                    <div className="flex items-center gap-4 pt-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">or sign up with</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Google Sign-Up Button */}
                    <div className="flex justify-center pt-2">
                      <GoogleLogin
                        onSuccess={(credentialResponse) => handleGoogleAuth(credentialResponse, regRole)}
                        onError={() => setRegError('Google Sign-Up failed. Please try again.')}
                        theme="outline"
                        size="large"
                        width="350"
                        text="signup_with"
                        shape="pill"
                        logo_alignment="center"
                      />
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      ` }} />
      
      {/* ✅ ADD POPUP HERE (INSIDE MAIN DIV) */}
        {showForgot && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl w-[420px] shadow-2xl">
               <div className="flex items-start gap-3 mb-5">
  
                {/* Icon */}
                <div className="bg-gray-100 p-3 rounded-full">
                  🔒
                </div>
              
                {/* Text */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Reset Your Password
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enter your registered email address below, and we'll send you a OTP code to reset your password.
                  </p>
                </div>
              
              </div>
    
              <h3 className="font-bold mb-3">Reset With Email </h3>
    
              {otpStep === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />
        
            <button
              onClick={handleForgotPassword}
              disabled={otpLoading}
              className={`w-full py-2 rounded text-white ${
                otpLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600'
              }`}
            >
              {otpLoading ? 'Generating OTP...' : 'Send OTP'}
            </button>
          </>
        )}
        
        {otpStep === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
            />
        
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />
        
            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}
    
              {forgotMsg && (
                <p className={`text-xs mt-2 ${forgotMsg.includes("OTP") || forgotMsg.includes("updated") ? "text-green-600" : "text-red-500"}`}>
                  {forgotMsg}
                </p>
              )}
    
              <button
                onClick={() => setShowForgot(false)}
                className="text-xs text-gray-400 mt-3"
              >
                Close
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default LoginPage;
