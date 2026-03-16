'use client';

import { useState } from 'react';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { Plus, Trash2, Users } from 'lucide-react';
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
  const asmrists = useQuery(anyApi.asmrists.get, userId ? { userId } : "skip") as Doc<"asmrists">[] | undefined;
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

  const handleDelete = async (id: Id<"asmrists">, asmristName: string) => {
    try {
      await deleteAsmrist({ id, userId: userId! });
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
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">ASMRists</h1>
        <button 
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          New ASMRist
        </button>
      </div>

      {isAdding && (
        <div className="mb-12 bg-white border border-slate-200 rounded-[24px] shadow-sm p-6 md:p-8 transition-all">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Create New ASMRist</h2>
            <p className="text-slate-500 mt-1">Define a new character for your ASMR videos.</p>
          </div>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-slate-900 font-bold block mb-1">Name</Label>
              <Input 
                id="name"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Dr. Lumina"
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-slate-900 text-slate-900 rounded-xl px-4"
                required
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="description" className="text-slate-900 font-bold block mb-1">Physical Description</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[160px] bg-slate-50 border-slate-200 focus-visible:ring-slate-900 text-slate-900 rounded-xl p-4 resize-y"
                placeholder="Exhaustive physical description including age, ethnicity, hair, skin texture, and precise clothing details..."
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors w-full sm:w-auto flex justify-center items-center"
              >
                {isSubmitting ? "Saving..." : "Save ASMRist"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {isLoading && (
          <>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex flex-col bg-white border border-slate-200 rounded-[24px] shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            ))}
          </>
        )}

        {!isLoading && asmrists.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-24 text-slate-500 bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <Users size={48} className="mb-4 text-slate-300" />
            <p className="text-xl font-bold text-slate-900 mb-2">No ASMRists yet</p>
            <p className="text-slate-500 max-w-sm">Create your first ASMRist character profile to use in your videos.</p>
          </div>
        )}

        {!isLoading && asmrists && asmrists.map((asmrist: Doc<"asmrists">) => (
          <div key={asmrist._id} className="group flex flex-col bg-white border border-slate-200 rounded-[24px] shadow-sm p-6 relative overflow-hidden transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-slate-900 pr-8">{asmrist.name}</h3>
              <button 
                type="button"
                onClick={() => handleDelete(asmrist._id, asmrist.name)}
                className="absolute top-6 right-6 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                title="Delete ASMRist"
              >
                <Trash2 size={18} />
              </button>
            </div>
            {renderDescription(asmrist.description)}
          </div>
        ))}
      </div>
    </div>
  );
}
