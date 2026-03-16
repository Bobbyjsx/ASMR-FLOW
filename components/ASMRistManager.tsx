'use client';

import { useState } from 'react';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { Plus, Trash2, Users, ChevronDown, ChevronUp, User } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { successToast, errorToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useRef, useEffect } from 'react';

function DescriptionContainer({ 
  asmrist, 
  isExpanded, 
  toggleExpand 
}: { 
  asmrist: Doc<"asmrists">; 
  isExpanded: boolean; 
  toggleExpand: (id: string) => void 
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const desc = asmrist.description;

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        // If expanded, we can't easily check overflow against the collapsed state
        // unless we measure it differently. But we can just check if it WOULD overflow.
        // For simplicity, we'll check it whenever the description or expansion changes.
        const isOverflowing = element.scrollHeight > element.clientHeight;
        if (isOverflowing && !hasOverflow) setHasOverflow(true);
      }
    };

    // Small delay to ensure styles are applied
    const timer = setTimeout(checkOverflow, 100);
    return () => clearTimeout(timer);
  }, [desc, isExpanded]);

  let parsed: any = null;
  try {
    parsed = JSON.parse(desc);
    if (typeof parsed !== 'object' || parsed === null) parsed = null;
  } catch (e) {}

  return (
    <div className="mt-4 flex-grow relative flex flex-col">
      <div 
        ref={contentRef}
        className={cn(
          "transition-all duration-500 overflow-hidden relative",
          !isExpanded ? "max-h-[120px]" : "max-h-[2000px]",
          parsed ? "space-y-3" : "text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap"
        )}
      >
        {parsed ? (
          Object.entries(parsed).map(([key, value]) => (
            <div key={key} className="text-sm bg-muted/30 p-3 rounded-xl border border-border/40">
              <span className="font-bold text-foreground capitalize block mb-1 text-[11px] tracking-widest uppercase">{key.replace(/_/g, ' ')}</span>
              <span className="text-muted-foreground leading-relaxed">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
            </div>
          ))
        ) : (
          desc
        )}
        
        {(!isExpanded && hasOverflow) && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        )}
      </div>

      {(hasOverflow || isExpanded) && (
        <button 
          onClick={() => toggleExpand(asmrist._id)}
          className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mt-4 hover:opacity-80 transition-opacity w-fit"
        >
          {isExpanded ? (
            <><ChevronUp size={14} /> Show Less</>
          ) : (
            <><ChevronDown size={14} /> {parsed ? "Show Full Profile" : "Read More"}</>
          )}
        </button>
      )}
    </div>
  );
}

export default function ASMRistManager() {
  const { userId } = useAuth();
  const asmrists = useQuery(anyApi.asmrists.get, userId ? { userId } : "skip") as Doc<"asmrists">[] | undefined;
  const createAsmrist = useMutation(anyApi.asmrists.create);
  const deleteAsmrist = useMutation(anyApi.asmrists.remove);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !userId) return;
    setIsSubmitting(true);
    try {
      await createAsmrist({ name, description, userId });
      successToast(`ASMRist "${name}" created!`);
      setName('');
      setDescription('');
      setIsAdding(false);
    } catch (err) {
      errorToast(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: Id<"asmrists">, asmristName: string) => {
    e.stopPropagation();
    try {
      await deleteAsmrist({ id, userId: userId! });
      successToast(`"${asmristName}" deleted.`);
    } catch (err) {
      errorToast(err);
    }
  };

  const isLoading = asmrists === undefined;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 leading-tight">
            The <span className="text-primary italic">ASMRists</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Manage your cast of unique ASMRist personas. Define their style, triggers, and physical presence.
          </p>
          <Button 
            onClick={() => setIsAdding(!isAdding)} 
            size="lg"
            className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
          >
            <Plus className="mr-2 h-5 w-5" />
            {isAdding ? "Close Form" : "Create New Persona"}
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />
      </section>

      {isAdding && (
        <div className="px-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-card border border-border/60 rounded-[2.5rem] shadow-xl shadow-primary/5 p-8 md:p-12">
            <div className="mb-10 text-center max-w-lg mx-auto">
              <h2 className="text-3xl font-serif font-bold text-foreground">Cast New ASMRist</h2>
              <p className="text-muted-foreground mt-2 italic">&quot;A new voice, a new touch, a new presence.&quot;</p>
            </div>
            
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="name" className="text-foreground font-bold text-sm tracking-wide ml-1">Persona Name</Label>
                  <Input 
                    id="name"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Dr. Lumina"
                    className="h-14 bg-muted/30 border-border/50 focus-visible:ring-primary text-foreground rounded-2xl px-5 text-lg font-medium"
                    required
                  />
                </div>
                
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
                  <h4 className="font-serif font-bold text-primary">Pro Tip</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Be specific about physical traits. The AI model uses these details to maintain consistency across different scenes and videos.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="description" className="text-foreground font-bold text-sm tracking-wide ml-1">Physical Profile</Label>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[220px] bg-muted/30 border-border/50 focus-visible:ring-primary text-foreground rounded-2xl p-5 resize-none text-[15px] leading-relaxed"
                    placeholder="Exhaustive physical description: age, ethnicity, hair texture, skin tone, jewelry, and specific clothing style..."
                    required
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-2">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setIsAdding(false)}
                    className="rounded-full px-8 h-12 font-bold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full px-10 h-12 font-bold shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? "Generating Profile..." : "Save Persona"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-serif font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Active Talent
          </h2>
          <div className="h-px flex-grow mx-8 bg-border/50 hidden md:block" />
          <span className="text-sm font-medium text-muted-foreground bg-muted px-4 py-1.5 rounded-full border border-border/40">
            {asmrists?.length || 0} Registered
          </span>
        </div>

        <div className="flex flex-wrap gap-8">
          {isLoading && (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-1 min-w-[320px] max-w-full flex flex-col bg-card border border-border rounded-[2.5rem] p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-10 w-1/2 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-5/6 rounded-full" />
                    <Skeleton className="h-4 w-4/6 rounded-full" />
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLoading && asmrists.length === 0 && !isAdding && (
            <div className="w-full flex flex-col items-center justify-center py-24 text-center bg-card/50 rounded-[3rem] border border-dashed border-border/60">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border/40">
                <Users size={40} className="text-muted-foreground/30" />
              </div>
              <p className="text-3xl font-serif font-bold text-foreground mb-3">No Talent Found</p>
              <p className="text-muted-foreground max-w-sm mx-auto mb-10 italic">Your studio is waiting for its first star performer.</p>
              <Button onClick={() => setIsAdding(true)} className="rounded-full px-8 h-12 font-bold">
                <Plus className="mr-2 h-5 w-5" />
                Cast New Persona
              </Button>
            </div>
          )}

          {!isLoading && asmrists && asmrists.map((asmrist: Doc<"asmrists">) => (
            <div 
              key={asmrist._id} 
              className="flex-1 min-w-[320px] max-w-full group flex flex-col bg-card border border-border/60 rounded-[2.5rem] p-10 relative overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(99,102,241,0.12)] hover:border-primary/30"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex justify-between items-start relative z-10 mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {asmrist.name}
                    </h3>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Verified Talent</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={(e) => handleDelete(e, asmrist._id, asmrist.name)}
                  className="text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
                  title="Delete ASMRist"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <DescriptionContainer 
                asmrist={asmrist} 
                isExpanded={expandedIds.has(asmrist._id)} 
                toggleExpand={toggleExpand} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
