"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Download, Mail, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Apple from "@/components/icons/Apple";
import PlayStore from "@/components/icons/PlayStore";
import { cn } from "@/lib/utils";
import { submitBetaRequest } from "@/app/actions/testing";
import { Loader2 } from "lucide-react";

type Platform = "ios" | "android" | null;
const SUPPORT_EMAIL = "support@thefurfinder.com";

export default function JoinTestingClient() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
          Join our testing program and get early access to Fur Finder on your device.
          Select iPhone or Android below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        {/* iOS Selection Card */}
        <button
          onClick={() => { setPlatform("ios"); setSubmitted(false); }}
          aria-pressed={platform === "ios"}
          className={cn(
            "group relative flex flex-col items-center p-8 rounded-3xl border-2 transition-all duration-300 text-left hover:scale-[1.02]",
            platform === "ios" 
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
              : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/50"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300",
            platform === "ios" ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/20"
          )}>
            <Apple className={cn("w-8 h-8", platform === "ios" ? "fill-white" : "fill-foreground group-hover:fill-primary")} />
          </div>
          <h3 className="text-2xl font-semibold mb-2">iOS Beta</h3>
          <p className="text-muted-foreground text-center">Available via Apple TestFlight</p>
          {platform === "ios" && (
            <div className="absolute top-4 right-4 text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
        </button>

        {/* Android Selection Card */}
        <button
          onClick={() => { setPlatform("android"); setSubmitted(false); }}
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
      <div className="max-w-2xl mx-auto">
        {platform === "ios" && (
          <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-md overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                iOS Installation Steps
              </CardTitle>
              <CardDescription>Follow these steps to install Fur Finder with Apple TestFlight.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">Install TestFlight</p>
                    <p className="text-muted-foreground text-sm">Download the TestFlight app from the App Store if you haven't already.</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <a href="https://apps.apple.com/app/testflight/id899247664" target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download TestFlight
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">Open the TestFlight Invite</p>
                    <p className="text-muted-foreground text-sm">Use this link on your iPhone and accept the invite for The Fur Finder beta.</p>
                    <Button className="mt-2 bg-primary hover:bg-primary/90 text-white" asChild>
                      <a href="https://testflight.apple.com/join/hxx4NTgp" target="_blank" rel="noopener noreferrer">
                        Join on TestFlight
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">Install the Build</p>
                    <p className="text-muted-foreground text-sm">In TestFlight, tap <strong>Install</strong> next to The Fur Finder to start testing.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            <p className="text-muted-foreground italic">Please select your device platform above to see instructions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
