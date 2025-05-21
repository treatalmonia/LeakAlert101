import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Facebook, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    return strength;
  };

  const strength = getStrength();
  const strengthLabels = ["Too Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  return (
    <div className="mt-1.5">
      <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-600">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1/5 transition-colors duration-300 ${i < strength ? strengthColors[strength -1] : ''}`}
          />
        ))}
      </div>
      {password.length > 0 && <p className={`mt-1 text-xs font-medium ${strengthColors[Math.max(0, strength-1)].replace('bg-', 'text-')}`}>{strengthLabels[Math.max(0, strength-1)]}</p>}
    </div>
  );
};

const RegistrationPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null); 
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Debounce username check
  useEffect(() => {
    if (!username) {
      setUsernameAvailable(null);
      setUsernameError('');
      return;
    }
    const handler = setTimeout(async () => {
      // Simulate API call for username availability
      setIsLoading(true); // Show a general loading state or specific to username
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);
      if (username === "takenUser") {
        setUsernameAvailable(false);
        setUsernameError("Username is already taken.");
      } else if (username.length < 3) {
        setUsernameAvailable(false);
        setUsernameError("Username must be at least 3 characters.");
      }
      else {
        setUsernameAvailable(true);
        setUsernameError("");
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [username]);

  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email.";
    // Simulate existing account check
    if (email === "taken@example.com") return "This email is already registered.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    return "";
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    const currentUsernameError = usernameError || (!username ? "Username is required." : "");
    const currentEmailError = validateEmail(email);
    const currentPasswordError = validatePassword(password);

    setUsernameError(currentUsernameError);
    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    if (currentUsernameError || currentEmailError || currentPasswordError || !usernameAvailable) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please correct the errors in the form.",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
      title: "Account Created!",
      description: "Your account has been successfully created. Please log in.",
      action: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    });
    navigate('/login');
  };

  const isFormValid = username && email && password && !usernameError && usernameAvailable && !emailError && !passwordError;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center p-4 pt-20">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400">Create an Account</h1>
          <p className="text-slate-300 mt-2">Join to start reporting and tracking leaks.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5 bg-slate-800/70 backdrop-blur-md p-8 rounded-xl shadow-2xl shadow-purple-500/30">
          <div>
            <Label htmlFor="username" className="text-slate-300">Username</Label>
            <div className="relative mt-1">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500 ${usernameError ? 'border-red-500 focus:border-red-500' : usernameAvailable === true ? 'border-green-500 focus:border-green-500' : ''}`}
                aria-invalid={!!usernameError || usernameAvailable === false}
                aria-describedby="username-feedback"
              />
              {usernameAvailable === true && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />}
              {usernameAvailable === false && usernameError && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />}
            </div>
            {usernameError && <p id="username-feedback" className="mt-1 text-xs text-red-400 flex items-center"><AlertCircle className="h-3 w-3 mr-1"/>{usernameError}</p>}
            {usernameAvailable === true && <p id="username-feedback" className="mt-1 text-xs text-green-400">Username is available!</p>}
          </div>
          
          <div>
            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(validateEmail(e.target.value));
              }}
              onBlur={() => setEmailError(validateEmail(email))}
              placeholder="example@gmail.com"
              className={`mt-1 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500 ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
              aria-invalid={!!emailError}
              aria-describedby="email-error-reg"
            />
            {emailError && <p id="email-error-reg" className="mt-1 text-xs text-red-400 flex items-center"><AlertCircle className="h-3 w-3 mr-1"/>{emailError}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-slate-300">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09XXXXXXXXX"
              className="mt-1 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500"
            />
          </div>

          <div>
            <Label htmlFor="passwordReg" className="text-slate-300">Password</Label>
            <div className="relative mt-1">
              <Input
                id="passwordReg"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if(passwordError) setPasswordError(validatePassword(e.target.value));
                }}
                onBlur={() => setPasswordError(validatePassword(password))}
                placeholder="Create a strong password"
                className={`pr-10 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500 ${passwordError ? 'border-red-500 focus:border-red-500' : ''}`}
                aria-invalid={!!passwordError}
                aria-describedby="password-error-reg"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full px-3 text-slate-400 hover:text-slate-200"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            <PasswordStrengthMeter password={password} />
            {passwordError && <p id="password-error-reg" className="mt-1 text-xs text-red-400 flex items-center"><AlertCircle className="h-3 w-3 mr-1"/>{passwordError}</p>}
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign Up"}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-slate-700"></div>
          <span className="mx-4 text-xs text-slate-500 uppercase">OR SIGN UP WITH</span>
          <div className="flex-grow border-t border-slate-700"></div>
        </div>

        <div className="space-y-3">
           <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Facebook className="mr-2 h-5 w-5" /> Sign up with Facebook
          </Button>
          <Button variant="outline" className="w-full bg-white hover:bg-gray-100 text-slate-700 border-slate-300 hover:border-slate-400">
            <GoogleIcon /> <span className="ml-2">Sign up with Google</span>
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
      <footer className="text-center py-8 text-slate-500 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} LeakAlert. All rights reserved.</p>
      </footer>
    </div>
  );
};

const CheckCircle2 = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default RegistrationPage;