import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Download,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  User,
  SlidersHorizontal,
  CheckSquare
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';
import { loginUser, signupUser, googleLogin } from '../../services/api';
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from '@azure/msal-react';

export default function LoginPage() {
  const login = useLessonStore((state) => state.login);
  const setUserNameInStore = useLessonStore((state) => state.setUserName);
  const { instance: msalInstance } = useMsal();

  // 1. Auth View State: 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset' | 'signup' | 'signup_profile'
  const [authView, setAuthView] = useState('login');

  // Sign In states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Recovery States
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [recoverySuccessMessage, setRecoverySuccessMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign Up states
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Teacher Preferences / Profile Onboarding states
  const [teachingDepth, setTeachingDepth] = useState('Standard');
  const [explanationStyle, setExplanationStyle] = useState('Balanced');
  const [studentReadiness, setStudentReadiness] = useState('Mixed');
  const [assessmentDifficulty, setAssessmentDifficulty] = useState('Standard');
  const [includes, setIncludes] = useState({
    misconceptions: true,
    workedExamples: true,
    differentiation: true,
    extensionActivity: false
  });

  const handleIncludeToggle = (key) => {
    setIncludes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sign In submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await loginUser({ email, password });
      login(data.user);
    } catch (error) {
      alert('Login Failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsSubmitting(true);
        const data = await googleLogin(tokenResponse.access_token);
        login(data.user);
      } catch (error) {
        alert('Google Login Failed: ' + error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    // Fix: Forces account selection every time
    prompt: 'select_account',
  });

  const microsoftLoginHandler = async () => {
    try {
      setIsSubmitting(true);
      const response = await msalInstance.loginPopup({
        scopes: ["user.read"]
      });
      // Import microsoftLogin from api.js (we'll add it there next)
      const { microsoftLogin } = await import('../../services/api');
      const data = await microsoftLogin(response.accessToken);
      login(data.user);
    } catch (error) {
      console.error(error);
      alert('Microsoft Login Failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'Google') {
      googleLoginHandler();
    } else if (provider === 'Microsoft') {
      microsoftLoginHandler();
    }
  };

  // Forgot Email submit
  const handleForgotEmailSubmit = (e) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;
    setRecoverySuccessMessage('Mail sent successfully');
    setOtpError('');
    setOtpInput('');
    setTimeout(() => {
      setAuthView('forgot_otp');
    }, 600);
  };

  // OTP verify submit
  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    if (otpInput.trim() === '1234') {
      setOtpError('');
      setAuthView('forgot_reset');
    } else {
      setOtpError('Invalid OTP');
    }
  };

  // Reset password submit
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    alert('Password updated successfully! Please sign in with your new credentials.');
    setAuthView('login');
  };

  // Sign up step 1 submit
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupError('');
    if (!signupUsername.trim() || !signupEmail.trim() || !signupPassword) {
      setSignupError('Please fill out all required fields.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    setAuthView('signup_profile');
  };

  // Onboarding step 2 complete
  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await signupUser({
        username: signupUsername.trim() || 'Educator',
        email: signupEmail.trim(),
        password: signupPassword,
      });
      if (setUserNameInStore) setUserNameInStore(data.user.name);
      login(data.user);
    } catch (error) {
      alert('Signup Failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      {/* Left Brand Column (45% width) */}
      <div className="w-full md:w-[45%] h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-8 md:p-12 lg:p-16 flex flex-col justify-between border-r border-indigo-100/80 dark:border-slate-800 relative overflow-hidden transition-colors">
        {/* Background ambient accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-200/40 dark:bg-indigo-900/20 blur-3xl pointer-events-none" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">ClassCraft Validator</h1>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">AI Teacher Workspace</p>
          </div>
        </div>

        {/* Center Brand Headline & Workflow Graphic */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Curriculum-Aligned & Pedagogically Grounded</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            From Teaching Goal to <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Validated Classroom Material.
            </span>
          </h2>

          <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed max-w-md">
            AI-assisted workspace that helps teachers create, validate, edit and export lesson plans, quizzes and supporting materials with real-time class synchronization.
          </p>

          {/* Workflow Badges */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs border border-indigo-100 dark:border-slate-700 rounded-xl shadow-2xs text-xs font-semibold text-slate-700 dark:text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Structured & Validated</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs border border-indigo-100 dark:border-slate-700 rounded-xl shadow-2xs text-xs font-semibold text-slate-700 dark:text-gray-200">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Teacher in Control</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs border border-indigo-100 dark:border-slate-700 rounded-xl shadow-2xs text-xs font-semibold text-slate-700 dark:text-gray-200">
              <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Export Anytime</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-4 border-t border-indigo-100/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
          <span>Trusted by modern educators</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">v2.4 LTS</span>
        </div>
      </div>

      {/* Right Form Column (55% width) */}
      <div className="w-full md:w-[55%] h-full bg-white dark:bg-slate-900 p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto transition-colors">
        <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in duration-200 my-auto">

          {/* VIEW 1: LOGIN */}
          {authView === 'login' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>Educator Access</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Welcome Back! 👋
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1.5">
                  Sign in to your ClassCraft Validator account and continue your teaching journey.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Teacher Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@school.edu"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                    <Mail className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryEmail(email);
                        setRecoverySuccessMessage('');
                        setAuthView('forgot_email');
                      }}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer p-0.5 focus:outline-none"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all duration-150 shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer mt-2"
                >
                  <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-gray-500 font-semibold tracking-wider">
                    Or Continue With
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-gray-200 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('Microsoft')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-gray-200 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>

              {/* New to ClassCraft Link */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  New to ClassCraft?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSignupError('');
                      setAuthView('signup');
                    }}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* VIEW 2: SIGNUP (Account Creation) */}
          {authView === 'signup' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  <User className="w-4 h-4" />
                  <span>Step 1 of 2</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Create an Account
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1.5">
                  Join ClassCraft Validator and personalize your AI teaching assistant.
                </p>
              </div>

              {signupError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  {signupError}
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="e.g., Siva Surya"
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                    <User className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="teacher@school.edu"
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                    <Mail className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer p-0.5 focus:outline-none"
                    >
                      {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupConfirmPassword ? "text" : "password"}
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer p-0.5 focus:outline-none"
                    >
                      {showSignupConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer mt-2"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* VIEW 3: SIGNUP PROFILE (Teacher Preferences) */}
          {authView === 'signup_profile' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Step 2 of 2 • Teacher Preferences</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Customize Your AI Assistant
                </h2>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Set your default teaching parameters.
                </p>
              </div>

              <form onSubmit={handleCompleteSetup} className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {/* 1. Teaching Depth */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Teaching Depth
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Basic', 'Standard', 'Deep'].map((depth) => (
                      <label
                        key={depth}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          teachingDepth === depth
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="teachingDepth"
                          value={depth}
                          checked={teachingDepth === depth}
                          onChange={(e) => setTeachingDepth(e.target.value)}
                          className="accent-indigo-600"
                        />
                        <span>{depth}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Explanation Style */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Explanation Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Simple', 'Balanced', 'Detailed'].map((style) => (
                      <label
                        key={style}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          explanationStyle === style
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="explanationStyle"
                          value={style}
                          checked={explanationStyle === style}
                          onChange={(e) => setExplanationStyle(e.target.value)}
                          className="accent-indigo-600"
                        />
                        <span>{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Student Readiness */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Student Readiness
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Mixed', 'Advanced'].map((readiness) => (
                      <label
                        key={readiness}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          studentReadiness === readiness
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="studentReadiness"
                          value={readiness}
                          checked={studentReadiness === readiness}
                          onChange={(e) => setStudentReadiness(e.target.value)}
                          className="accent-indigo-600"
                        />
                        <span>{readiness}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4. Assessment Difficulty */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Assessment Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Foundational', 'Standard', 'Challenging'].map((diff) => (
                      <label
                        key={diff}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          assessmentDifficulty === diff
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="assessmentDifficulty"
                          value={diff}
                          checked={assessmentDifficulty === diff}
                          onChange={(e) => setAssessmentDifficulty(e.target.value)}
                          className="accent-indigo-600"
                        />
                        <span>{diff}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. Include Checkboxes */}
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Include in Standard Lessons
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'misconceptions', label: 'Misconceptions' },
                      { key: 'workedExamples', label: 'Worked examples' },
                      { key: 'differentiation', label: 'Differentiation' },
                      { key: 'extensionActivity', label: 'Extension activity' }
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-gray-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={includes[item.key]}
                          onChange={() => handleIncludeToggle(item.key)}
                          className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAuthView('signup')}
                    className="w-1/3 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="w-2/3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete Setup</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW 4: FORGOT EMAIL */}
          {authView === 'forgot_email' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  <KeyRound className="w-4 h-4" />
                  <span>Account Recovery</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Reset Password
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1.5">
                  Enter your email address to receive an OTP.
                </p>
              </div>

              {recoverySuccessMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{recoverySuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="teacher@school.edu"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                    <Mail className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
                >
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 5: FORGOT OTP */}
          {authView === 'forgot_otp' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verification Step</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Enter OTP
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1.5">
                  Check your inbox for the 4-digit code. (Use <strong className="text-slate-800 dark:text-white">1234</strong> for demo)
                </p>
              </div>

              {otpError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  {otpError}
                </div>
              )}

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    4-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value);
                      if (otpError) setOtpError('');
                    }}
                    placeholder="1234"
                    className="w-full px-4 py-2.5 text-center tracking-widest text-lg font-bold bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
                >
                  <span>Verify OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setAuthView('forgot_email')}
                  className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRecoverySuccessMessage('New OTP sent to email');
                    setOtpError('');
                  }}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* VIEW 6: FORGOT RESET */}
          {authView === 'forgot_reset' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  <Lock className="w-4 h-4" />
                  <span>Security Update</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Create New Password
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1.5">
                  Set a new secure password for your educator workspace.
                </p>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer p-0.5 focus:outline-none"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer p-0.5 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel and Return to Login</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
