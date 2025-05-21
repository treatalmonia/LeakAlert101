import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, EyeOff, Loader2, Facebook, AlertCircle } from 'lucide-react';
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

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const currentEmailError = validateEmail(email);
    const currentPasswordError = validatePassword(password);
    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    if (currentEmailError || currentPasswordError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please correct the errors in the form.",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // For now, just show a success toast and navigate to home. 
    // Replace with actual auth logic.
    toast({
      title: "Login Successful",
      description: "Welcome back!",
      action: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    });
    navigate('/'); 
  };

  const isFormValid = email && password && !emailError && !passwordError;

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
          <h1 className="text-4xl font-bold text-yellow-400">Ready to Report a Leak?</h1>
          <p className="text-slate-300 mt-2">Log in to report leaks or track submissions.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-slate-800/70 backdrop-blur-md p-8 rounded-xl shadow-2xl shadow-purple-500/30">
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
              aria-describedby="email-error"
            />
            {emailError && <p id="email-error" className="mt-1 text-xs text-red-400 flex items-center"><AlertCircle className="h-3 w-3 mr-1"/>{emailError}</p>}
          </div>

          <div>
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(validatePassword(e.target.value));
                }}
                onBlur={() => setPasswordError(validatePassword(password))}
                placeholder="Enter your password"
                className={`pr-10 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500 ${passwordError ? 'border-red-500 focus:border-red-500' : ''}`}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
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
            {passwordError && <p id="password-error" className="mt-1 text-xs text-red-400 flex items-center"><AlertCircle className="h-3 w-3 mr-1"/>{passwordError}</p>}
          </div>

          <div className="flex items-center justify-between">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      className="border-slate-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-slate-400 cursor-pointer">Remember Me</Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700">
                  <p>We’ll keep you logged in for 7 days.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Link to="/forgot-password" className="text-sm text-red-400 hover:text-red-300 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Login"}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-slate-700"></div>
          <span className="mx-4 text-xs text-slate-500 uppercase">OR LOGIN WITH</span>
          <div className="flex-grow border-t border-slate-700"></div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white">
            <Facebook className="mr-2 h-5 w-5 text-blue-500" /> Login with Facebook
          </Button>
          <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white">
            <GoogleIcon /> <span className="ml-2">Login with Google</span>
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
       <footer className="text-center py-8 text-slate-500 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} LeakAlert. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Dummy CheckCircle2 for toast action
const CheckCircle2 = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);


export default LoginPage;