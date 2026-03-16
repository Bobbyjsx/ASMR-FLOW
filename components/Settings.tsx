'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsType } from '@/types';
import { getSettings, saveSettings } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

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
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Settings</h1>
      
      <Card className="border-border shadow-md bg-card transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-card-foreground">Preferences</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your application preferences and defaults.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredInput" className="text-foreground">Preferred Input Format</Label>
              <Select 
                value={settings.preferredInput} 
                onValueChange={(value) => handleChange('preferredInput', value as 'text' | 'json')}
                placeholder="Select input format"
                triggerClassName="w-full md:w-1/2 bg-background border-border text-foreground"
                options={[
                  { label: "Plain Text", value: "text" },
                  { label: "JSON", value: "json" }
                ]}
              />
              <p className="text-sm text-muted-foreground">
                Choose how you prefer to input ASMRist descriptions and themes. If JSON is selected, the app will attempt to format and parse JSON inputs for better readability.
              </p>
            </div>

            <div className="pt-6 border-t border-border space-y-2">
              <Label htmlFor="preferredOutput" className="text-foreground">Preferred Output Format</Label>
              <Select 
                value={settings.preferredOutput} 
                onValueChange={(value) => handleChange('preferredOutput', value as 'text' | 'json')}
                placeholder="Select output format"
                triggerClassName="w-full md:w-1/2 bg-background border-border text-foreground"
                options={[
                  { label: "Plain Text", value: "text" },
                  { label: "JSON", value: "json" }
                ]}
              />
              <p className="text-sm text-muted-foreground">
                Choose your default format when copying prompts from the storyboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
