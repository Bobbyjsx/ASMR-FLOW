import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, PlayCircle, Sparkles, Users, Video, Zap, Shield, Globe, ArrowRight, FileText } from "lucide-react";
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
      <section id="pipeline" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The ASMR Production Pipeline</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">From concept to final render in minutes, not days.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 -translate-y-1/2 z-0"></div>
            
            {[
              { step: "01", title: "Character Design", desc: "Define your ASMRist's physical traits, personality, and style.", icon: Users },
              { step: "02", title: "Script Generation", desc: "AI crafts perfectly timed dialogue with entry/exit animations.", icon: FileText },
              { step: "03", title: "Video Rendering", desc: "High-fidelity video generation using Veo technology.", icon: Video },
            ].map((item, i) => {
              const Icon = item.icon || Sparkles;
              return (
                <Card key={i} className="relative z-10 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
                      <Icon size={24} />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="text-base">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Everything you need to build your ASMR empire</h2>
              <div className="space-y-8">
                {[
                  { title: "Consistent Characters", desc: "Maintain visual consistency across multiple videos with saved ASMRist profiles." },
                  { title: "Trigger Management", desc: "Automatically inject audio-visual triggers like tapping, whispering, and brushing." },
                  { title: "Cloud Storage", desc: "All your projects and renders are securely stored and synced in real-time." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 bg-blue-100 text-blue-600 rounded-full p-1 h-fit">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 shadow-inner">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-32 bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
                    <PlayCircle className="text-slate-300" size={48} />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="stories" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by top creators</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">See how ASMR Flow is transforming content creation.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800 border-slate-700 text-slate-100">
              <CardContent className="pt-6">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Sparkles key={i} size={16} className="mr-1" />)}
                </div>
                <p className="text-lg italic mb-6 text-slate-300">&quot;ASMR Flow cut my production time by 80%. The AI scripts understand pacing and triggers perfectly. It&apos;s like having a full production team.&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xl">L</div>
                  <div>
                    <p className="font-semibold">Lumina ASMR</p>
                    <p className="text-sm text-slate-400">1.2M Subscribers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700 text-slate-100">
              <CardContent className="pt-6">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Sparkles key={i} size={16} className="mr-1" />)}
                </div>
                <p className="text-lg italic mb-6 text-slate-300">&quot;The character consistency is mind-blowing. I can generate multiple scenes with the exact same persona. Absolute game-changer.&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xl">S</div>
                  <div>
                    <p className="font-semibold">Sleepy Whispers</p>
                    <p className="text-sm text-slate-400">850K Subscribers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login / CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to start your journey?</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of creators building the future of ASMR content.</p>
          
          <Button 
            size="lg" 
            className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-slate-50 shadow-xl transition-transform hover:scale-105"
            render={
              <Link href="/auth">
                Enter the Studio <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            }
          />
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
