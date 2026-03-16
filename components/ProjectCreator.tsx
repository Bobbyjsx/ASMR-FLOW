'use client';

import { useState, useEffect } from 'react';
import { ASMRist, Project } from '@/types';
import { getASMRists, saveProject } from '@/lib/store';
import { generateScenes } from '@/lib/gemini';
import { Loader2, ArrowRight } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectCreatorProps {
  onProjectCreated: (projectId: string) => void;
  onCancel: () => void;
}

export default function ProjectCreator({ onProjectCreated, onCancel }: ProjectCreatorProps) {
  const { userId } = useAuth();
  const asmrists = useQuery(anyApi.asmrists.get, userId ? { userId } : "skip");
  const createProject = useMutation(anyApi.projects.create);

  const [selectedAsmristId, setSelectedAsmristId] = useState('');
  const [theme, setTheme] = useState('');
  const [length, setLength] = useState('1 minute (8 scenes)');
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (asmrists && asmrists.length > 0 && !selectedAsmristId) {
      setSelectedAsmristId(asmrists[0]._id);
    }
  }, [asmrists, selectedAsmristId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !theme || !selectedAsmristId || !userId) {
      setError('Please fill in all fields.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const selectedAsmrist = asmrists?.find((a: any) => a._id === selectedAsmristId);
      if (!selectedAsmrist) throw new Error("ASMRist not found");

      const scenes = await generateScenes(theme, length, selectedAsmrist.description);
      
      if (!scenes || scenes.length === 0) {
        throw new Error("Failed to generate scenes. Please try again.");
      }

      const projectId = await createProject({
        name,
        theme,
        length,
        asmristId: selectedAsmristId,
        userId,
        scenes,
        createdAt: Date.now()
      });

      onProjectCreated(projectId as string);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!asmrists) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-card rounded-2xl border border-dashed border-border mt-12 shadow-sm">
        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
        <p className="text-muted-foreground">Loading ASMRists...</p>
      </div>
    );
  }

  if (asmrists.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-card rounded-2xl border border-dashed border-border mt-12 shadow-sm">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">No ASMRists Found</h2>
        <p className="text-muted-foreground mb-6">You need to create an ASMRist character before generating a video script.</p>
        <Button onClick={onCancel} className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:-translate-y-0.5">
          Go to ASMRists
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 mt-4 md:mt-8">
      <Card className="border-border shadow-md bg-card transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-card-foreground">New ASMR Project</CardTitle>
          <CardDescription className="text-muted-foreground">Generate a perfectly timed script with entry and exit animations.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Project Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Cyberpunk Checkup"
                className="bg-background border-border focus-visible:ring-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asmrist" className="text-foreground">Select ASMRist</Label>
              <Select value={selectedAsmristId} onValueChange={(val) => setSelectedAsmristId(val || '')} required>
                <SelectTrigger id="asmrist" className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select an ASMRist" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {asmrists.map((a: any) => (
                    <SelectItem key={a._id} value={a._id} className="text-card-foreground focus:bg-accent/10 focus:text-foreground">{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme" className="text-foreground">Theme / Vibe</Label>
              <Textarea 
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., A futuristic cyber-clinic cranial nerve exam, OR A rainy medieval tavern map-reading..."
                className="h-32 bg-background border-border focus-visible:ring-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="length" className="text-foreground">Total Length</Label>
              <Select value={length} onValueChange={(val) => setLength(val || '')} required>
                <SelectTrigger id="length" className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="30 seconds (4 scenes)" className="text-card-foreground focus:bg-accent/10 focus:text-foreground">30 seconds (4 scenes)</SelectItem>
                  <SelectItem value="1 minute (8 scenes)" className="text-card-foreground focus:bg-accent/10 focus:text-foreground">1 minute (8 scenes)</SelectItem>
                  <SelectItem value="2 minutes (16 scenes)" className="text-card-foreground focus:bg-accent/10 focus:text-foreground">2 minutes (16 scenes)</SelectItem>
                  <SelectItem value="3 minutes (24 scenes)" className="text-card-foreground focus:bg-accent/10 focus:text-foreground">3 minutes (24 scenes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6 flex justify-between items-center border-t border-border">
              <Button 
                type="button" 
                variant="ghost"
                onClick={onCancel}
                disabled={isGenerating}
                className="text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isGenerating}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    Generate Scenes
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
