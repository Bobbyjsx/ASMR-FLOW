import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Video, Zap, Shield, Globe, ArrowRight, FileText, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
              <Sparkles size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ASMR Flow</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-blue-600 transition-colors">Pipeline</a>
            <a href="#stories" className="hover:text-blue-600 transition-colors">Success Stories</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Sign In</Link>
            <Button render={<Link href="/auth">Start Free Trial</Link>} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
            <Sparkles size={16} />
            <span>The #1 AI-Powered ASMR Production Studio</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
            Create mesmerizing ASMR videos at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">scale</span>.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Design characters, write perfectly timed scripts, and generate high-quality video content using our advanced AI pipeline. Trusted by top creators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 w-full sm:w-auto text-base h-12 px-8"
              render={
                <Link href="/auth">
                  Start Creating Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              }
            />
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 bg-white">
              <PlayCircle className="mr-2 h-5 w-5 text-slate-500" /> Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Logos */}
      <section className="py-10 border-y bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Powered by industry-leading AI</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
            <div className="flex items-center gap-2 font-bold text-xl"><Globe /> Google Gemini</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Video /> Veo Video</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Zap /> Convex DB</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Shield /> Enterprise Security</div>
          </div>
        </div>
      </section>

      {/* Pipeline Visualization */}
      <section id="pipeline" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[80px] translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-4">
               <Video size={14} /> Simplified Workflow
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">The ASMR Production Pipeline</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">From concept to final high-fidelity render in three simple steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[4.5rem] left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200 z-0"></div>
            
            {[
              { 
                step: "01", 
                title: "Character Design", 
                desc: "Define your ASMRist's physical traits, personality, and visual style.", 
                icon: Users,
                gradient: "from-blue-500 to-cyan-500",
                shadow: "shadow-blue-500/20"
              },
              { 
                step: "02", 
                title: "Script Generation", 
                desc: "AI crafts perfectly timed dialogue with entry/exit animations and cues.", 
                icon: FileText,
                gradient: "from-indigo-500 to-blue-500",
                shadow: "shadow-indigo-500/20"
              },
              { 
                step: "03", 
                title: "Video Rendering", 
                desc: "High-fidelity video generation using Veo technology for realistic output.", 
                icon: Video,
                gradient: "from-purple-500 to-indigo-500",
                shadow: "shadow-purple-500/20"
              },
            ].map((item, i) => {
              const Icon = item.icon || Sparkles;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center">
                  {/* Step Node */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center mb-6 shadow-xl ${item.shadow} ring-4 ring-white relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>
                  
                  {/* Card Content */}
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-6xl font-black text-slate-50 select-none group-hover:text-slate-100 transition-colors duration-300 -mt-4 -mr-2">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{item.title}</h3>
                    <p className="text-slate-500 text-[15px] leading-relaxed relative z-10">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase — Bento Grid */}
      <section id="features" className="py-28 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-4">
              <Zap size={14} /> Powerful Features
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">Everything you need to build<br className="hidden md:block" /> your ASMR empire</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">From AI-powered scripting to seamless video rendering, every tool is designed for creators who demand the best.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Users size={24} />,
                title: "Consistent Characters",
                desc: "Maintain visual consistency across multiple videos with saved ASMRist profiles that remember every detail.",
                gradient: "from-blue-500 to-indigo-600",
                bgGlow: "bg-blue-500/10",
              },
              // {
              //   icon: <Zap size={24} />,
              //   title: "Smart Trigger System",
              //   desc: "Automatically inject and time audio-visual triggers — tapping, whispering, brushing — with AI precision.",
              //   gradient: "from-amber-500 to-orange-600",
              //   bgGlow: "bg-amber-500/10",
              // },
              {
                icon: <Shield size={24} />,
                title: "Secure Cloud Storage",
                desc: "All your projects and renders are encrypted, securely stored, and synced across devices in real-time.",
                gradient: "from-emerald-500 to-teal-600",
                bgGlow: "bg-emerald-500/10",
              },
              {
                icon: <Video size={24} />,
                title: "AI Video Generation",
                desc: "Generate high-fidelity ASMR scenes from text descriptions using state-of-the-art AI video models.",
                gradient: "from-violet-500 to-purple-600",
                bgGlow: "bg-violet-500/10",
              },
              {
                icon: <FileText size={24} />,
                title: "Script Intelligence",
                desc: "AI writes pacing-aware scripts with built-in trigger cues, dialogue timings, and scene transitions.",
                gradient: "from-pink-500 to-rose-600",
                bgGlow: "bg-pink-500/10",
              },
              {
                icon: <Globe size={24} />,
                title: "Publish Anywhere",
                desc: "Export in any format. One-click optimized renders for YouTube, TikTok, Instagram, and more.",
                gradient: "from-cyan-500 to-blue-600",
                bgGlow: "bg-cyan-500/10",
              },
            ].map((feature, i) => (
              <Card
                key={feature.title}
                className={`group relative border border-slate-200/80 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden ${
                  i === 0 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full ${feature.bgGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`}></div>
                <CardContent className="pt-8 pb-7 px-7 relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mb-5 shadow-lg shadow-slate-900/10`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-[15px]">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — Glassmorphic Cards */}
      <section id="stories" className="py-28 relative overflow-hidden bg-slate-950">
        {/* Animated gradient blobs */}
        <div className="absolute top-[-15%] left-[-5%] w-[35%] h-[35%] rounded-full bg-blue-600/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-[35%] h-[35%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-blue-300 text-sm font-medium mb-4 backdrop-blur-sm">
              <Users size={14} /> Creator Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">Loved by creators<br className="hidden md:block" /> around the world</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Hear from real creators who have transformed their ASMR content workflow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "ASMR Flow cut my production time by 80%. The AI scripts understand pacing and triggers perfectly. It's like having a full production team in my pocket.",
                name: "Lumina ASMR",
                role: "1.2M Subscribers",
                initials: "LA",
                accent: "from-blue-500 to-indigo-500",
              },
              {
                quote: "The character consistency is mind-blowing. I can generate multiple scenes with the exact same persona across weeks of content. Absolute game-changer.",
                name: "Sleepy Whispers",
                role: "850K Subscribers",
                initials: "SW",
                accent: "from-violet-500 to-purple-500",
              },
              {
                quote: "I went from spending entire weekends on one video to publishing three a week. The AI handles the heavy lifting while I focus on creative direction.",
                name: "Gentle Rain",
                role: "620K Subscribers",
                initials: "GR",
                accent: "from-emerald-500 to-teal-500",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] p-7 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
              >
                {/* Quote mark */}
                <div className="absolute top-5 right-6 text-6xl font-serif text-white/[0.06] leading-none select-none">&ldquo;</div>

                {/* Star rating */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={`star-${testimonial.name}-${i}`} width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24" className="drop-shadow-sm">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <p className="text-slate-300 leading-relaxed text-[15px] mb-8 relative z-10">{testimonial.quote}</p>

                <div className="flex items-center gap-3 pt-5 border-t border-white/[0.08]">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.accent} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-slate-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 overflow-hidden bg-slate-950">
        {/* Ambient gradient blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[120px]"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-violet-500/10 blur-[100px]"></div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-10 md:p-14 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6">
              <Sparkles size={14} /> Now in Early Access
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Your ASMR studio, reimagined</h2>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">We&apos;re building the tools creators have been asking for. Get in early and help shape the future of ASMR production.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button
                size="lg"
                className="h-13 px-8 text-base bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-[1.03] font-semibold cursor-pointer border-0"
                render={
                  <Link href="/auth">
                    Get Early Access <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                }
              />
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 text-base border-white/15 text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer"
                render={
                  <Link href="#pipeline">
                    See How It Works
                  </Link>
                }
              />
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: <Zap size={14} />, label: "AI Scripts" },
                { icon: <Video size={14} />, label: "Video Generation" },
                { icon: <Users size={14} />, label: "Character Profiles" },
                { icon: <Shield size={14} />, label: "Secure Storage" },
              ].map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-400 text-xs font-medium">
                  {item.icon} {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={16} />
            <span className="font-semibold">ASMR Flow</span>
          </div>
          <p>© {new Date().getFullYear()} ASMR Flow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
