// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Button } from '../../components/common/Button';
// import { toast } from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

// type Mode = 'login' | 'signup';

// interface FieldProps {
//   id: string;
//   label: string;
//   type?: string;
//   icon: React.ReactNode;
//   value: string;
//   error?: string;
//   placeholder: string;
//   showPassword?: boolean;
//   onTogglePassword?: () => void;
//   onChange: (v: string) => void;
// }

// // Update the destructure:
// const { login, signup, loginWithGoogle } = useAuth();

// // Add this handler inside the component:
// const handleGoogleLogin = async () => {
//   setIsLoading(true);
//   const result = await loginWithGoogle();
//   if (result.success) {
//     toast.success(result.message, { style: { background: '#1A1A1A', color: '#fff', borderRadius: '0px' } });
//     navigate('/');
//   } else {
//     toast.error(result.message, { style: { borderRadius: '0px' } });
//   }
//   setIsLoading(false);
// };

// // Field is a pure, standalone component — no hooks of its own, no logic beyond rendering an input.
// const Field: React.FC<FieldProps> = ({
//   id, label, type = 'text', icon, value, error,
//   placeholder, showPassword, onTogglePassword, onChange,
// }) => {
//   const isPasswordField = id === 'password' || id === 'confirmPassword';
//   const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

//   return (
//     <div className="space-y-2">
//       <label htmlFor={id} className="text-[10px] font-accent tracking-widest uppercase text-gray-500">
//         {label}
//       </label>
//       <div className="relative">
//         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">{icon}</span>
//         <input
//           id={id}
//           type={inputType}
//           value={value}
//           onChange={e => onChange(e.target.value)}
//           placeholder={placeholder}
//           autoComplete={isPasswordField ? 'current-password' : id === 'email' ? 'email' : 'off'}
//           className={`w-full bg-[#F5F1E8] border-none py-4 pl-12 pr-12 text-sm focus:ring-1 outline-none transition-all ${
//             error ? 'ring-1 ring-red-400' : 'focus:ring-[#D4A574]'
//           }`}
//         />
//         {isPasswordField && onTogglePassword && (
//           <button
//             type="button"
//             onClick={onTogglePassword}
//             className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
//           >
//             {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//           </button>
//         )}
//       </div>
//       {error && <p className="text-[10px] text-red-500 font-accent tracking-wide">{error}</p>}
//     </div>
//   );
// };

// export const AdminLogin: React.FC = () => {
//   const [mode, setMode] = useState<Mode>('login');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [verificationSent, setVerificationSent] = useState(false);
//   const [signupEmail, setSignupEmail] = useState('');

//   const { login, signup } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
//   const [errors, setErrors] = useState<Partial<typeof form>>({});

//   const switchMode = (newMode: Mode) => {
//     setMode(newMode);
//     setErrors({});
//     setShowPassword(false);
//     setVerificationSent(false);
//     setForm({ name: '', email: '', password: '', confirmPassword: '' });
//   };

//   const validate = (): boolean => {
//     const newErrors: Partial<typeof form> = {};
//     if (mode === 'signup' && !form.name.trim()) newErrors.name = 'Name is required.';
//     if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email.';
//     if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
//     if (mode === 'signup' && form.password !== form.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match.';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setIsLoading(true);

//     await new Promise(r => setTimeout(r, 600));

//     if (mode === 'login') {
//       const result = await login(form.email, form.password);
//       if (result.success) {
//         toast.success(result.message, { style: { background: '#1A1A1A', color: '#fff', borderRadius: '0px' } });
//         const isAdminEmail = form.email.trim().toLowerCase() === 'nimrahshahid744@gmail.com';
//         navigate(isAdminEmail ? '/admin' : '/');
//       } else {
//         toast.error(result.message, { style: { borderRadius: '0px' } });
//       }
//     } else {
//       const result = await signup(form.name, form.email, form.password);
//       if (result.success) {
//         setSignupEmail(form.email);
//         setVerificationSent(true);
//       } else {
//         toast.error(result.message, { style: { borderRadius: '0px' } });
//       }
//     }

//     setIsLoading(false);
//   };

//   // Verification confirmation screen — checked first, before the login/signup form renders
//   if (verificationSent) {
//     return (
//       <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6 relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10 pointer-events-none">
//           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,#D4A574,transparent_60%)]" />
//         </div>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="w-full max-w-md bg-white p-12 relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] text-center"
//         >
//           <div className="w-20 h-20 bg-[#D4A574]/10 rounded-full flex items-center justify-center mx-auto mb-8">
//             <Mail className="w-10 h-10 text-[#D4A574]" />
//           </div>
//           <h2 className="text-3xl font-serif font-black tracking-tighter mb-4 text-[#1A1A1A]">
//             Check your inbox.
//           </h2>
//           <p className="text-gray-500 font-light leading-relaxed mb-2">
//             We sent a verification link to:
//           </p>
//           <p className="text-[#1A1A1A] font-bold mb-8 break-all">{signupEmail}</p>
//           <p className="text-gray-400 text-sm font-light mb-10 leading-relaxed">
//             Click the link in the email to verify your account, then come back and sign in.
//           </p>
//           <button
//             onClick={() => switchMode('login')}
//             className="w-full bg-[#1A1A1A] text-white py-4 text-sm tracking-widest font-accent uppercase hover:bg-[#D4A574] transition-all duration-300"
//           >
//             Go to Sign In
//           </button>
//           <p className="text-[10px] text-gray-400 mt-6">
//             Didn't receive it?{' '}
//             <span className="text-[#D4A574]">Check your spam folder.</span>
//           </p>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6 pt-24 relative overflow-hidden">
//       <div className="absolute inset-0 opacity-10 pointer-events-none">
//         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,#D4A574,transparent_60%)]" />
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
//           <h1 className="text-4xl font-serif font-black text-white tracking-tighter">
//             MANHATTAN<span className="text-[#D4A574]">.</span>
//           </h1>
//           <p className="text-white/30 text-[10px] font-accent tracking-[0.3em] uppercase mt-2">Premium Fast Food</p>
//         </motion.div>

//         <div className="flex bg-white/5 border border-white/10 mb-6">
//           {(['login', 'signup'] as Mode[]).map(m => (
//             <button
//               key={m}
//               type="button"
//               onClick={() => switchMode(m)}
//               className={`flex-1 py-3 text-[11px] font-accent tracking-widest uppercase transition-all ${
//                 mode === m ? 'bg-[#D4A574] text-white' : 'text-white/40 hover:text-white/70'
//               }`}
//             >
//               {m === 'login' ? 'Sign In' : 'Create Account'}
//             </button>
//           ))}
//         </div>

//         <motion.div
//           key={mode}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.25 }}
//           className="bg-white p-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
//         >
//           <h2 className="text-2xl font-serif font-black tracking-tighter mb-8 text-[#1A1A1A]">
//             {mode === 'login' ? 'Welcome back.' : 'Join Manhattan.'}
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <AnimatePresence>
//               {mode === 'signup' && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                 >
//                   <Field
//                     id="name"
//                     label="Full Name"
//                     icon={<User className="w-4 h-4" />}
//                     value={form.name}
//                     error={errors.name}
//                     placeholder="e.g. Nimrah Shahid"
//                     onChange={v => setForm(f => ({ ...f, name: v }))}
//                   />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <Field
//               id="email"
//               label="Email Address"
//               type="email"
//               icon={<Mail className="w-4 h-4" />}
//               value={form.email}
//               error={errors.email}
//               placeholder="you@example.com"
//               onChange={v => setForm(f => ({ ...f, email: v }))}
//             />

//             <Field
//               id="password"
//               label="Password"
//               icon={<Lock className="w-4 h-4" />}
//               value={form.password}
//               error={errors.password}
//               placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••••'}
//               showPassword={showPassword}
//               onTogglePassword={() => setShowPassword(p => !p)}
//               onChange={v => setForm(f => ({ ...f, password: v }))}
//             />

//             <AnimatePresence>
//               {mode === 'signup' && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                 >
//                   <Field
//                     id="confirmPassword"
//                     label="Confirm Password"
//                     icon={<Lock className="w-4 h-4" />}
//                     value={form.confirmPassword}
//                     error={errors.confirmPassword}
//                     placeholder="Repeat password"
//                     showPassword={showPassword}
//                     onTogglePassword={() => setShowPassword(p => !p)}
//                     onChange={v => setForm(f => ({ ...f, confirmPassword: v }))}
//                   />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <Button
//               type="submit"
//               isLoading={isLoading}
//               className="w-full py-4 text-sm tracking-widest font-accent uppercase mt-4 flex items-center justify-center gap-3"
//             >
//               {mode === 'login' ? 'Sign In' : 'Create Account'}
//               {!isLoading && <ArrowRight className="w-4 h-4" />}
//             </Button>
//           </form>

//           <div className="flex items-center gap-4 my-6">
//   <div className="flex-1 h-px bg-gray-200" />
//   <span className="text-[10px] text-gray-400 font-accent tracking-widest uppercase">or</span>
//   <div className="flex-1 h-px bg-gray-200" />
// </div>

// <button
//   type="button"
//   onClick={handleGoogleLogin}
//   disabled={isLoading}
//   className="w-full flex items-center justify-center gap-3 border border-gray-200 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
// >
//   <svg className="w-5 h-5" viewBox="0 0 24 24">
//     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//   </svg>
//   Continue with Google
// </button>

//           {mode === 'login' && (
//             <p className="mt-6 text-center text-[10px] text-gray-400">
//               Don't have an account?{' '}
//               <button onClick={() => switchMode('signup')} className="text-[#D4A574] hover:underline font-semibold">
//                 Sign up free
//               </button>
//             </p>
//           )}
//           {mode === 'signup' && (
//             <p className="mt-6 text-center text-[10px] text-gray-400">
//               Already have an account?{' '}
//               <button onClick={() => switchMode('login')} className="text-[#D4A574] hover:underline font-semibold">
//                 Sign in
//               </button>
//             </p>
//           )}
//         </motion.div>

//         <p className="text-center text-white/20 text-[9px] font-accent tracking-widest mt-8 uppercase">
//           © 2026 Manhattan Premium Fast Food
//         </p>
//       </div>
//     </div>
//   );
// };





import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

type Mode = 'login' | 'signup';

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  icon: React.ReactNode;
  value: string;
  error?: string;
  placeholder: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  onChange: (v: string) => void;
}

// Field is a pure, standalone component — no hooks of its own, no logic beyond rendering an input.
const Field: React.FC<FieldProps> = ({
  id, label, type = 'text', icon, value, error,
  placeholder, showPassword, onTogglePassword, onChange,
}) => {
  const isPasswordField = id === 'password' || id === 'confirmPassword';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[10px] font-accent tracking-widest uppercase text-gray-500">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">{icon}</span>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={isPasswordField ? 'current-password' : id === 'email' ? 'email' : 'off'}
          className={`w-full bg-[#F5F1E8] border-none py-4 pl-12 pr-12 text-sm focus:ring-1 outline-none transition-all ${error ? 'ring-1 ring-red-400' : 'focus:ring-[#D4A574]'
            }`}
        />
        {isPasswordField && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500 font-accent tracking-wide">{error}</p>}
    </div>
  );
};

export const AdminLogin: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await loginWithGoogle();
    if (result.success) {
      toast.success(result.message, { style: { background: '#1A1A1A', color: '#fff', borderRadius: '0px' } });
      navigate('/');
    } else {
      toast.error(result.message, { style: { borderRadius: '0px' } });
    }
    setIsLoading(false);
  };

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setErrors({});
    setShowPassword(false);
    setVerificationSent(false);
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const validate = (): boolean => {
    const newErrors: Partial<typeof form> = {};
    if (mode === 'signup' && !form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email.';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (mode === 'signup' && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 600));

    if (mode === 'login') {
      const result = await login(form.email, form.password);
      if (result.success) {
        toast.success(result.message, { style: { background: '#1A1A1A', color: '#fff', borderRadius: '0px' } });
        const isAdminEmail = form.email.trim().toLowerCase() === 'nimrahshahid744@gmail.com';
        navigate(isAdminEmail ? '/admin' : '/');
      } else {
        toast.error(result.message, { style: { borderRadius: '0px' } });
      }
    } else {
      const result = await signup(form.name, form.email, form.password);
      if (result.success) {
        setSignupEmail(form.email);
        setVerificationSent(true);
      } else {
        toast.error(result.message, { style: { borderRadius: '0px' } });
      }
    }

    setIsLoading(false);
  };

  // Verification confirmation screen — checked first, before the login/signup form renders
  if (verificationSent) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,#D4A574,transparent_60%)]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-12 relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] text-center"
        >
          <div className="w-20 h-20 bg-[#D4A574]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-[#D4A574]" />
          </div>
          <h2 className="text-3xl font-serif font-black tracking-tighter mb-4 text-[#1A1A1A]">
            Check your inbox.
          </h2>
          <p className="text-gray-500 font-light leading-relaxed mb-2">
            We sent a verification link to:
          </p>
          <p className="text-[#1A1A1A] font-bold mb-8 break-all">{signupEmail}</p>
          <p className="text-gray-400 text-sm font-light mb-10 leading-relaxed">
            Click the link in the email to verify your account, then come back and sign in.
          </p>
          <button
            onClick={() => switchMode('login')}
            className="w-full bg-[#1A1A1A] text-white py-4 text-sm tracking-widest font-accent uppercase hover:bg-[#D4A574] transition-all duration-300"
          >
            Go to Sign In
          </button>
          <p className="text-[10px] text-gray-400 mt-6">
            Didn't receive it?{' '}
            <span className="text-[#D4A574]">Check your spam folder.</span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6 pt-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,#D4A574,transparent_60%)]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-serif font-black text-white tracking-tighter">
            MANHATTAN<span className="text-[#D4A574]">.</span>
          </h1>
          <p className="text-white/30 text-[10px] font-accent tracking-[0.3em] uppercase mt-2">Premium Fast Food</p>
        </motion.div>

        <div className="flex bg-white/5 border border-white/10 mb-6">
          {(['login', 'signup'] as Mode[]).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 py-3 text-[11px] font-accent tracking-widest uppercase transition-all ${mode === m ? 'bg-[#D4A574] text-white' : 'text-white/40 hover:text-white/70'
                }`}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
        >
          <h2 className="text-2xl font-serif font-black tracking-tighter mb-8 text-[#1A1A1A]">
            {mode === 'login' ? 'Welcome back.' : 'Join Manhattan.'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Field
                    id="name"
                    label="Full Name"
                    icon={<User className="w-4 h-4" />}
                    value={form.name}
                    error={errors.name}
                    placeholder="e.g. Nimrah Shahid"
                    onChange={v => setForm(f => ({ ...f, name: v }))}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Field
              id="email"
              label="Email Address"
              type="email"
              icon={<Mail className="w-4 h-4" />}
              value={form.email}
              error={errors.email}
              placeholder="you@example.com"
              onChange={v => setForm(f => ({ ...f, email: v }))}
            />

            <Field
              id="password"
              label="Password"
              icon={<Lock className="w-4 h-4" />}
              value={form.password}
              error={errors.password}
              placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••••'}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(p => !p)}
              onChange={v => setForm(f => ({ ...f, password: v }))}
            />

            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Field
                    id="confirmPassword"
                    label="Confirm Password"
                    icon={<Lock className="w-4 h-4" />}
                    value={form.confirmPassword}
                    error={errors.confirmPassword}
                    placeholder="Repeat password"
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(p => !p)}
                    onChange={v => setForm(f => ({ ...f, confirmPassword: v }))}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-sm tracking-widest font-accent uppercase mt-4 flex items-center justify-center gap-3"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400 font-accent tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {mode === 'login' && (
            <p className="mt-6 text-center text-[10px] text-gray-400">
              Don't have an account?{' '}
              <button onClick={() => switchMode('signup')} className="text-[#D4A574] hover:underline font-semibold">
                Sign up free
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p className="mt-6 text-center text-[10px] text-gray-400">
              Already have an account?{' '}
              <button onClick={() => switchMode('login')} className="text-[#D4A574] hover:underline font-semibold">
                Sign in
              </button>
            </p>
          )}
        </motion.div>

        <p className="text-center text-white/20 text-[9px] font-accent tracking-widest mt-8 uppercase">
          © 2026 Manhattan Premium Fast Food
        </p>
      </div>
    </div>
  );
};