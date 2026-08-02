"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2, ArrowRight, ArrowLeft, Sparkles, ShieldCheck, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const { login, signup, requestPasswordReset, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"auth" | "forgot">("auth");
  const [forgotStep, setForgotStep] = useState<"request" | "reset">("request");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: "login" | "signup") => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;

    try {
      if (mode === "login") {
        const identifier = fd.get("identifier") as string;
        await login(identifier, password);
      } else {
        const email = fd.get("email") as string;
        const username = fd.get("username") as string;
        await signup(email, username, password);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during authentication.";
      setError(message);
      setIsLoading(false);
    }
  };

  const handleForgotRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("reset-email") as string).trim();

    try {
      const token = await requestPasswordReset(email);
      setResetEmail(email);
      setResetToken(token);
      setForgotStep("reset");
      setIsLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while requesting a password reset.";
      setError(message);
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const confirm = fd.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(resetToken ?? "", password);
      toast.success("Password updated. You can now sign in.");
      setView("auth");
      setForgotStep("request");
      setResetToken(null);
      setResetEmail("");
      setIsLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while resetting your password.";
      setError(message);
      setIsLoading(false);
    }
  };

  const goBackToAuth = () => {
    setError(null);
    setView("auth");
    setForgotStep("request");
    setResetToken(null);
  };

  const copyToken = async () => {
    if (!resetToken) return;
    try {
      await navigator.clipboard.writeText(resetToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable; user can copy manually.
    }
  };

  const inputClass = "h-12 bg-white/50 backdrop-blur-sm border-white/20 focus:border-blue-500 transition-colors";

  const renderAuthForm = (mode: "login" | "signup") => (
    <form onSubmit={(e) => handleSubmit(e, mode)} className="space-y-4 text-left mt-4">
      {mode === "login" ? (
        <div className="space-y-2">
          <Label htmlFor="identifier">Email or Username</Label>
          <Input
            id="identifier"
            name="identifier"
            type="text"
            required
            autoComplete="username"
            placeholder="creator@example.com or creator_99"
            className={inputClass}
          />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="creator@example.com"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-username">Username</Label>
            <Input
              id="signup-username"
              name="username"
              type="text"
              required
              autoComplete="username"
              placeholder="creator_99"
              className={inputClass}
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${mode}-password`}>Password</Label>
          {mode === "login" && (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setView("forgot");
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </button>
          )}
        </div>
        <PasswordInput
          id={`${mode}-password`}
          name="password"
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      {error && (
        <Alert variant="destructive" className="py-2 bg-red-50/80 backdrop-blur-sm border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {mode === "login" ? "Sign In" : "Create Account"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );

  const renderForgotView = () => (
    <div className="mt-4 text-left space-y-4">
      <button
        type="button"
        onClick={goBackToAuth}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </button>

      {forgotStep === "request" ? (
        <>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Reset your password</h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your account email and we&apos;ll generate a one-time reset code.
            </p>
          </div>

          <form onSubmit={handleForgotRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                name="reset-email"
                type="email"
                required
                autoComplete="email"
                placeholder="creator@example.com"
                className={inputClass}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="py-2 bg-red-50/80 backdrop-blur-sm border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Generate Reset Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4">
            <div className="mt-0.5 text-blue-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-blue-900">Your reset code</h2>
              <p className="text-sm text-blue-800/80 mt-0.5">
                Use this one-time code to set a new password{resetEmail ? ` for ${resetEmail}` : ""}. It expires in 1 hour.
              </p>
              {resetToken && (
                <div className="mt-3 flex items-center gap-2">
                  <code className="rounded-lg bg-white/80 border border-blue-200 px-3 py-1.5 text-sm font-mono text-blue-900 select-all break-all">
                    {resetToken}
                  </code>
                  <button
                    type="button"
                    onClick={copyToken}
                    aria-label="Copy reset code"
                    className="p-2 text-blue-700 hover:text-blue-900 transition-colors shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <PasswordInput
                id="new-password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <PasswordInput
                id="confirm-password"
                name="confirmPassword"
                required
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className={inputClass}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="py-2 bg-red-50/80 backdrop-blur-sm border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <Link href="/landing" className="inline-flex items-center justify-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <Sparkles size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">ASMR Flow</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            {view === "forgot" && forgotStep === "reset" ? "Almost there" : "Welcome Back"}
          </h1>
          <p className="text-slate-500">
            {view === "forgot"
              ? forgotStep === "reset"
                ? "Enter your new password to regain access."
                : "We'll help you get back into the studio."
              : "Enter your details to access the studio."}
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            {view === "forgot" ? (
              renderForgotView()
            ) : (
              <Tabs defaultValue="login" onValueChange={() => setError(null)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 h-12 p-1 bg-slate-100/80 rounded-xl">
                  <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">Create Account</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0 outline-none data-[state=inactive]:hidden data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 duration-200">
                  {renderAuthForm("login")}
                </TabsContent>
                <TabsContent value="signup" className="mt-0 outline-none data-[state=inactive]:hidden data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 duration-200">
                  {renderAuthForm("signup")}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-8">
          By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}