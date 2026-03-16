'use client';

import { useState } from 'react';
import { ASMRist } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { successToast, errorToast } from '@/lib/toast';

export default function ASMRistManager() {
  const { userId } = useAuth();
  const asmrists = useQuery(anyApi.asmrists.get, userId ? { userId } : "skip");
  const createAsmrist = useMutation(anyApi.asmrists.create);
  const deleteAsmrist = useMutation(anyApi.asmrists.remove);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleDelete = async (id: string, asmristName: string) => {
    try {
      await deleteAsmrist({ id: id as any, userId: userId! });
      successToast(`"${asmristName}" deleted.`);
    } catch (err) {
      errorToast(err);
    }
  };

  const renderDescription = (desc: string) => {
    try {
      const parsed = JSON.parse(desc);
      if (typeof parsed === 'object' && parsed !== null) {
        return (
          <div className="space-y-2 mt-2 flex-grow">
            {Object.entries(parsed).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-semibold text-foreground capitalize">{key.replace(/_/g, ' ')}: </span>
                <span className="text-muted-foreground">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
              </div>
            ))}
          </div>
        );
      }
    } catch (e) {
      // Not JSON, fall through
    }
    return <p className="text-muted-foreground text-sm flex-grow whitespace-pre-wrap">{desc}</p>;
  };

  const isLoading = asmrists === undefined;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">ASMRists</h1>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
        >
          <Plus size={18} />
          New ASMRist
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-8 border-border shadow-sm bg-card transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-card-foreground">Create New ASMRist</CardTitle>
            <CardDescription className="text-muted-foreground">Define a new character for your ASMR videos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Name</Label>
                <Input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Dr. Lumina"
                  className="bg-background border-border focus-visible:ring-primary text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Physical Description</Label>
                <Textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-32 bg-background border-border focus-visible:ring-primary text-foreground"
                  placeholder="Exhaustive physical description including age, ethnicity, hair, skin texture, and precise clothing details..."
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setIsAdding(false)}
                  className="text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? "Saving..." : "Save ASMRist"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading && (
          <>
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="flex flex-col border-border bg-card">
                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-4/6" />
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {!isLoading && asmrists.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-2xl border border-dashed border-border">
            No ASMRists created yet. Click &quot;New ASMRist&quot; to get started.
          </div>
        )}

        {!isLoading && asmrists.map((asmrist: any) => (
          <Card key={asmrist._id} className="flex flex-col border-border shadow-md bg-card transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
              <CardTitle className="text-xl font-semibold text-card-foreground">{asmrist.name}</CardTitle>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(asmrist._id, asmrist.name)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2 transition-colors cursor-pointer"
                title="Delete ASMRist"
              >
                <Trash2 size={18} />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow">
              {renderDescription(asmrist.description)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
