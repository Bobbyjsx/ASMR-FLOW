'use client';

import { Plus, Trash2, Film } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { successToast, errorToast } from '@/lib/toast';

interface ProjectListProps {
  onNewProject: () => void;
  onSelectProject: (id: string) => void;
}

export default function ProjectList({ onNewProject, onSelectProject }: ProjectListProps) {
  const { userId } = useAuth();
  const projects = useQuery(anyApi.projects.get, userId ? { userId } : "skip");
  const deleteProject = useMutation(anyApi.projects.remove);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteProject({ id: id as any, userId: userId! });
      successToast("Project deleted.");
    } catch (err) {
      errorToast(err);
    }
  };

  const isLoading = projects === undefined;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
        <Button onClick={onNewProject} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">
          <Plus size={18} />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="flex flex-col border-border bg-card">
                <CardHeader className="pb-3 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="flex-grow" />
                <div className="px-6 pb-5 pt-4 border-t border-border flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </Card>
            ))}
          </>
        )}

        {!isLoading && projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground bg-card rounded-xl border border-dashed border-border shadow-sm">
            <Film size={48} className="mb-4 text-muted-foreground/30" />
            <p className="text-xl font-semibold text-card-foreground mb-2">No projects yet</p>
            <p className="text-muted-foreground mb-6">Create your first ASMR video project to get started.</p>
            <Button onClick={onNewProject} variant="outline" className="gap-2 border-border text-foreground hover:bg-accent/10 transition-colors">
              <Plus size={18} />
              Create Project
            </Button>
          </div>
        )}

        {!isLoading && projects.map((project: any) => (
          <Card 
            key={project._id} 
            onClick={() => onSelectProject(project._id)}
            className="cursor-pointer hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1 group flex flex-col border-border bg-card"
          >
            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-card-foreground line-clamp-1">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-muted-foreground">{project.theme}</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => handleDelete(e, project._id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all -mt-2 -mr-2"
                title="Delete Project"
              >
                <Trash2 size={18} />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow" />
            <CardFooter className="pt-4 border-t border-border flex justify-between items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span>{project.length}</span>
              <span>{project.scenes.length} Scenes</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
