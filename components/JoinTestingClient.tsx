"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, Mail, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Apple from "@/components/icons/Apple";
import PlayStore from "@/components/icons/PlayStore";
import { cn } from "@/lib/utils";
import { submitBetaRequest } from "@/app/actions/testing";
import { Loader2 } from "lucide-react";
import { downloadApp } from "@/lib/downloadHandler";

type Platform = "android" | null;
const SUPPORT_EMAIL = "support@thefurfinder.com";

export default function JoinTestingClient() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const requestSectionRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("platform")?.toLowerCase() === "android" ||
      window.location.hash === "#android-beta-request"
    ) {
      setPlatform("android");
    }
  }, []);

  useEffect(() => {
    if (platform !== "android") return;

    const scrollTimer = window.setTimeout(() => {
      requestSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      emailInputRef.current?.focus({ preventScroll: true });
    }, 80);

    return () => window.clearTimeout(scrollTimer);
  }, [platform]);

  const handleSelectAndroid = () => {
    setPlatform("android");
    setSubmitted(false);
  };

  const handleSubmitAndroid = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitBetaRequest(normalizedEmail, "Android");
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Failed to submit request. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container relative mx-auto px-4 py-16 md:py-24">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/20 blur-[120px] rounded-full" />

      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Help us build the <span className="text-primary">future</span> of pet safety
        </h1>
        <p className="text-xl text-muted-foreground">
          Download The Fur Finder on iPhone or request Android beta testing access.
          Select your device below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        {/* iOS App Store Card */}
        <a
          href={downloadApp("ios")}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex flex-col items-center p-8 rounded-3xl border-2 transition-all duration-300 text-left hover:scale-[1.02]",
            "border-border bg-card/50 backdrop-blur-sm hover:border-primary/50"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300",
            "bg-muted group-hover:bg-primary/20"
          )}>
            <Apple className="w-8 h-8 fill-foreground group-hover:fill-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">iOS App</h3>
          <p className="text-muted-foreground text-center">Download from the App Store</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Download className="h-4 w-4" />
            Open App Store
          </span>
        </a>

        {/* Android Selection Card */}
        <button
          onClick={handleSelectAndroid}
          aria-pressed={platform === "android"}
          className={cn(
            "group relative flex flex-col items-center p-8 rounded-3xl border-2 transition-all duration-300 text-left hover:scale-[1.02]",
            platform === "android" 
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
              : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/50"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300",
            platform === "android" ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/20"
          )}>
            <PlayStore className={cn("w-8 h-8", platform === "android" ? "fill-white" : "fill-foreground group-hover:fill-primary")} />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Android Beta</h3>
          <p className="text-muted-foreground text-center">Join our internal testing group</p>
          {platform === "android" && (
            <div className="absolute top-4 right-4 text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
        </button>
      </div>

      {/* Dynamic Content Area */}
      <div ref={requestSectionRef} id="android-beta-request" className="max-w-2xl mx-auto scroll-mt-24">
        {platform === "android" && (
          <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-md overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayStore className="w-5 h-5 text-primary" />
                Join Android Testing
              </CardTitle>
              <CardDescription>Use the Google account email on your Android device. We&apos;ll send your access request to the team.</CardDescription>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <form onSubmit={handleSubmitAndroid} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Google Play Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        ref={emailInputRef}
                        id="email" 
                        type="email" 
                        placeholder="your.email@gmail.com" 
                        className="pl-10 h-12 rounded-xl"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (submitError) setSubmitError(null);
                        }}
                        autoComplete="email"
                        inputMode="email"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This helps us add the correct Google account to the internal testing list.
                    </p>
                  </div>
                  {submitError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 animate-in fade-in slide-in-from-top-1" role="alert">
                      <p className="text-sm font-medium text-destructive">{submitError}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        If this keeps happening, email{" "}
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2 hover:text-foreground">
                          {SUPPORT_EMAIL}
                        </a>
                        .
                      </p>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !email.trim()}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-lg shadow-lg shadow-primary/20 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2 fill-white" />
                        Request Access
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold">You're on the list!</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    We&apos;ve received your request for <strong>{email.trim().toLowerCase()}</strong>.
                    You&apos;ll get an email with testing steps once your account is added.
                  </p>
                  <Button variant="ghost" onClick={() => setSubmitted(false)} className="mt-4">
                    Wait, I used the wrong email
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!platform && (
          <div className="text-center p-12 border-2 border-dashed border-border rounded-3xl bg-card/30 backdrop-blur-sm">
            <Smartphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground italic">Select Android above to request beta testing access.</p>
          </div>
        )}
      </div>
    </div>
  );
}
