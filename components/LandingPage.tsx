import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Video, Zap, Shield, Globe, ArrowRight, FileText, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
              <Sparkles size={20} />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-foreground">ASMR Flow</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-primary transition-colors">Pipeline</a>
            <a href="#stories" className="hover:text-primary transition-colors">Success Stories</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Sign In</Link>
            <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 whitespace-nowrap">
              <Link href="/auth">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold mb-8">
            <Sparkles size={16} />
            <span>The #1 AI-Powered ASMR Production Studio</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            Create mesmerizing ASMR videos at <span className="text-primary italic">scale</span>.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Design characters, write perfectly timed scripts, and generate high-quality video content using our advanced AI pipeline. Trusted by top creators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 w-full sm:w-auto text-lg h-14 px-10 font-bold transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <Link href="/auth" className="flex items-center justify-center gap-2">
                Start Creating Now <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-lg h-14 px-10 bg-background border-border/60 font-bold hover:bg-muted/30 whitespace-nowrap">
              <span className="flex items-center justify-center gap-2">
                <PlayCircle className="h-6 w-6 text-primary shrink-0" /> Watch Demo
              </span>
            </Button>
          </div>

        </div>
      </section>

      {/* Integration Logos */}
      <section className="py-12 border-y border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-8">Powered by industry-leading AI</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-3 font-serif font-bold text-xl"><Globe className="text-primary" /> Google Gemini</div>
            <div className="flex items-center gap-3 font-serif font-bold text-xl"><Video className="text-primary" /> Veo Video</div>
            <div className="flex items-center gap-3 font-serif font-bold text-xl"><Zap className="text-primary" /> Convex DB</div>
            <div className="flex items-center gap-3 font-serif font-bold text-xl"><Shield className="text-primary" /> Enterprise Security</div>
          </div>
        </div>
      </section>

      {/* Pipeline Visualization */}
      <section id="pipeline" className="py-24 bg-background relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold mb-4 uppercase tracking-widest">
              <Video size={14} /> Simplified Workflow
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-5 tracking-tight">The ASMR Production Pipeline</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">From concept to final high-fidelity render in three simple steps.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 relative">
            {[
              {
                step: "01",
                title: "Character Design",
                desc: "Define your ASMRist's physical traits, personality, and visual style.",
                icon: Users,
                gradient: "from-primary to-indigo-400",
                shadow: "shadow-primary/20"
              },
              {
                step: "02",
                title: "Script Generation",
                desc: "AI crafts perfectly timed dialogue with entry/exit animations and cues.",
                icon: FileText,
                gradient: "from-indigo-500 to-primary",
                shadow: "shadow-indigo-500/20"
              },
              {
                step: "03",
                title: "Video Rendering",
                desc: "High-fidelity video generation using Veo technology for realistic output.",
                icon: Video,
                gradient: "from-accent to-primary",
                shadow: "shadow-accent/20"
              },
            ].map((item, i) => {
              const Icon = item.icon || Sparkles;
              return (
                <div key={i} className="flex-1 min-w-[300px] relative z-10 flex flex-col items-center">
                  {/* Step Node */}
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center mb-8 shadow-xl ${item.shadow} ring-8 ring-background relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={32} />
                  </div>

                  {/* Card Content */}
                  <div className="bg-card rounded-[2.5rem] p-10 text-center border border-border/40 shadow-xl shadow-primary/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 text-7xl font-serif font-black text-foreground/[0.03] select-none group-hover:text-primary/[0.05] transition-colors duration-500 -mt-6 -mr-4">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-4 relative z-10">{item.title}</h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed relative z-10 font-medium">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase — Bento Grid */}
      <section id="features" className="py-28 bg-muted/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-accent text-sm font-bold mb-4 uppercase tracking-widest">
              <Zap size={14} /> Powerful Features
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-5 tracking-tight">Everything you need to build<br className="hidden md:block" /> your ASMR empire</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">From AI-powered scripting to seamless video rendering, every tool is designed for creators who demand the best.</p>
          </div>

          <div className="flex flex-wrap gap-8">
            {[
              {
                icon: <Users size={24} />,
                title: "Consistent Characters",
                desc: "Maintain visual consistency across multiple videos with saved ASMRist profiles that remember every detail.",
                gradient: "from-primary to-indigo-500",
                bgGlow: "bg-primary/10",
              },
              {
                icon: <Shield size={24} />,
                title: "Secure Cloud Storage",
                desc: "All your projects and renders are encrypted, securely stored, and synced across devices in real-time.",
                gradient: "from-accent to-emerald-500",
                bgGlow: "bg-accent/10",
              },
              {
                icon: <Video size={24} />,
                title: "AI Video Generation",
                desc: "Generate high-fidelity ASMR scenes from text descriptions using state-of-the-art AI video models.",
                gradient: "from-primary to-accent",
                bgGlow: "bg-primary/10",
              },
              {
                icon: <FileText size={24} />,
                title: "Script Intelligence",
                desc: "AI writes pacing-aware scripts with built-in trigger cues, dialogue timings, and scene transitions.",
                gradient: "from-indigo-500 to-primary",
                bgGlow: "bg-indigo-500/10",
              },
              {
                icon: <Globe size={24} />,
                title: "Publish Anywhere",
                desc: "Export in any format. One-click optimized renders for YouTube, TikTok, Instagram, and more.",
                gradient: "from-cyan-500 to-primary",
                bgGlow: "bg-cyan-500/10",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex-1 min-w-[320px] max-w-full group relative border border-border/40 bg-card rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 cursor-default overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full ${feature.bgGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2`}></div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px] font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — Glassmorphic Cards */}
      <section id="stories" className="py-28 relative overflow-hidden bg-foreground">
        {/* Animated gradient blobs */}
        <div className="absolute top-[-15%] left-[-5%] w-[35%] h-[35%] rounded-full bg-primary/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-[35%] h-[35%] rounded-full bg-accent/20 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-foreground text-sm font-bold mb-4 backdrop-blur-sm uppercase tracking-widest">
              <Users size={14} /> Creator Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-5 tracking-tight">Loved by creators<br className="hidden md:block" /> around the world</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">Hear from real creators who have transformed their ASMR content workflow.</p>
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {[
              {
                quote: "ASMR Flow cut my production time by 80%. The AI scripts understand pacing and triggers perfectly. It's like having a full production team in my pocket.",
                name: "Lumina ASMR",
                role: "1.2M Subscribers",
                initials: "LA",
                accent: "from-primary to-indigo-500",
              },
              {
                quote: "The character consistency is mind-blowing. I can generate multiple scenes with the exact same persona across weeks of content. Absolute game-changer.",
                name: "Sleepy Whispers",
                role: "850K Subscribers",
                initials: "SW",
                accent: "from-indigo-500 to-accent",
              },
              {
                quote: "I went from spending entire weekends on one video to publishing three a week. The AI handles the heavy lifting while I focus on creative direction.",
                name: "Gentle Rain",
                role: "620K Subscribers",
                initials: "GR",
                accent: "from-accent to-emerald-500",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="flex-1 min-w-[320px] max-w-full group relative rounded-[2.5rem] bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-10 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
              >
                {/* Quote mark */}
                <div className="absolute top-6 right-8 text-7xl font-serif text-white/[0.04] leading-none select-none italic">&ldquo;</div>

                {/* Star rating */}
                <div className="flex gap-1.5 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={`star-${testimonial.name}-${i}`} width="18" height="18" viewBox="0 0 24 24" fill="var(--color-accent)" className="drop-shadow-sm opacity-80">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <p className="text-slate-300 leading-relaxed text-[16px] mb-10 relative z-10 italic font-medium">&quot;{testimonial.quote}&quot;</p>

                <div className="flex items-center gap-4 pt-8 border-t border-white/[0.06]">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${testimonial.accent} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{testimonial.name}</p>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px]"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="bg-card border border-border/40 rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-primary/5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold mb-8 uppercase tracking-widest">
              <Sparkles size={14} /> Now in Early Access
            </span>

            <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 tracking-tight">Your ASMR studio, reimagined</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed font-medium italic">We&apos;re building the tools creators have been asking for. Get in early and help shape the future of ASMR production.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                asChild
                size="lg"
                className="h-16 px-12 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 font-bold whitespace-nowrap"
              >
                <Link href="/auth" className="flex items-center justify-center gap-2">
                  Get Early Access <ArrowRight className="h-5 w-5 shrink-0" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background text-muted-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-foreground">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground">
              <Sparkles size={20} />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">ASMR Flow</span>
          </div>
          <p className="font-medium text-sm">© {new Date().getFullYear()} ASMR Flow Studio. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
