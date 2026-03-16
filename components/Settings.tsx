'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsType } from '@/types';
import { getSettings, saveSettings } from '@/lib/store';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Settings as SettingsIcon, Shield, Sliders, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Settings() {
  const [settings, setSettingsState] = useState<SettingsType>({ preferredInput: 'text', preferredOutput: 'text' });

  useEffect(() => {
    setSettingsState(getSettings());
  }, []);

  const handleChange = (key: keyof SettingsType, value: 'text' | 'json') => {
    const newSettings = { ...settings, [key]: value };
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 leading-tight">
            Studio <span className="text-primary italic">Settings</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-2 max-w-md">
            Configure your production environment and output preferences for the ultimate ASMR flow.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />
      </section>

      <div className="px-4 max-w-4xl">
        <div className="bg-card border border-border/60 rounded-[2.5rem] shadow-xl shadow-primary/5 overflow-hidden">
          <div className="p-10 md:p-12 space-y-12">
            {/* Preferences Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sliders size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Preferences</h2>
                  <p className="text-sm text-muted-foreground">Manage your application behavior and interaction defaults.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label htmlFor="preferredInput" className="text-foreground font-bold text-sm tracking-wide uppercase">Input Format</Label>
                  <Select 
                    value={settings.preferredInput} 
                    onValueChange={(value) => handleChange('preferredInput', value as 'text' | 'json')}
                    placeholder="Select input format"
                    triggerClassName="w-full bg-muted/30 border-border/50 text-foreground rounded-2xl h-14 font-semibold px-5 focus:ring-primary"
                    options={[
                      { label: "Plain Text", value: "text" },
                      { label: "Structured JSON", value: "json" }
                    ]}
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    Affects how you input ASMRist descriptions and themes. JSON mode enables advanced field parsing.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="preferredOutput" className="text-foreground font-bold text-sm tracking-wide uppercase">Output Format</Label>
                  <Select 
                    value={settings.preferredOutput} 
                    onValueChange={(value) => handleChange('preferredOutput', value as 'text' | 'json')}
                    placeholder="Select output format"
                    triggerClassName="w-full bg-muted/30 border-border/50 text-foreground rounded-2xl h-14 font-semibold px-5 focus:ring-primary"
                    options={[
                      { label: "Text Prompt", value: "text" },
                      { label: "Data JSON", value: "json" }
                    ]}
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    Determines the default format when copying scene prompts to your clipboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/50 w-full" />

            {/* Appearance Placeholder */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <Palette size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Studio Appearance</h2>
                  <p className="text-sm text-muted-foreground">Customize the look and feel of your production environment.</p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-8 rounded-[2rem] border border-border/40 text-center">
                <p className="text-muted-foreground font-medium">Currently using the <span className="text-primary font-bold">Midnight Studio</span> adaptive theme.</p>
              </div>
            </div>

            <div className="h-px bg-border/50 w-full" />

            {/* Privacy Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                  <Shield size={24} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Privacy & Security</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Your data is stored securely using Convex and local state management. Scene prompts and video assets are only accessible by you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
