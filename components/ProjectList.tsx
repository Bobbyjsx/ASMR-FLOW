'use client';

import { Plus, Trash2, Film, Play, Clock, Layout } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { successToast, errorToast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectListProps {
  onNewProject: () => void;
  onSelectProject: (id: string) => void;
}

export default function ProjectList({ onNewProject, onSelectProject }: ProjectListProps) {
  const { userId } = useAuth();
  const projects = useQuery(anyApi.projects.get, userId ? { userId } : "skip") as Doc<"projects">[] | undefined;
  const deleteProject = useMutation(anyApi.projects.remove);

  const handleDelete = async (e: React.MouseEvent, id: Id<"projects">) => {
    e.stopPropagation();
    try {
      await deleteProject({ id, userId: userId! });
      successToast("Project deleted.");
    } catch (err) {
      errorToast(err);
    }
  };

  const isLoading = projects === undefined;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 leading-tight">
            Your ASMR <span className="text-primary italic">Studio</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Create, manage, and evolve your ASMR video projects with AI-powered flow.
          </p>
          <Button 
            onClick={onNewProject} 
            size="lg"
            className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
          >
            <Plus className="mr-2 h-5 w-5" />
            Start New Project
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />
      </section>

      <div className="px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            Recent Projects
          </h2>
          <div className="h-px flex-grow mx-8 bg-border/50 hidden md:block" />
          <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {projects?.length || 0} Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col bg-card border border-border rounded-[2rem] p-8 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                  </div>
                  <div className="flex-grow min-h-[4rem]" />
                  <div className="pt-6 border-t border-border flex justify-between">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLoading && projects.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-card/50 rounded-[2rem] border border-dashed border-border/60">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Film size={32} className="text-muted-foreground/60" />
              </div>
              <p className="text-2xl font-serif font-bold text-foreground mb-3">Begin Your First Flow</p>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                No projects found. Capture the essence of ASMR by creating your first video project.
              </p>
              <Button 
                onClick={onNewProject} 
                variant="outline"
                className="rounded-full px-6 hover:bg-primary hover:text-primary-foreground border-primary/20 transition-all"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          )}

          {!isLoading && projects && projects.map((project: Doc<"projects">) => (
            <div 
              key={project._id} 
              onClick={() => onSelectProject(project._id)}
              className="group relative flex flex-col bg-card border border-border/60 rounded-[2rem] hover:border-primary/30 transition-all duration-300 p-8 cursor-pointer hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.1)] overflow-hidden"
            >
              {/* Card Highlight on Hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex items-start justify-between relative z-10 mb-4">
                <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 pr-10 leading-tight">
                  {project.name}
                </h3>
                <button 
                  onClick={(e) => handleDelete(e, project._id)}
                  className="absolute -top-2 -right-2 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Delete Project"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <p className="text-muted-foreground text-sm line-clamp-2 mb-8 flex-grow leading-relaxed italic">
                "{project.theme}"
              </p>
              
              <div className="pt-6 border-t border-border/40 flex justify-between items-center relative z-10 gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full whitespace-nowrap overflow-hidden">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span className="truncate">{project.length}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
                  <Play className="h-3 w-3 fill-primary shrink-0" />
                  {project.scenes.length} Scenes
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
