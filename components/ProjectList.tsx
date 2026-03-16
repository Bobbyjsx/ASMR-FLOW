'use client';

import { Plus, Trash2, Film } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { anyApi } from 'convex/server';
import { useAuth } from '@/components/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { successToast, errorToast } from '@/lib/toast';

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
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">Projects</h1>
        <button 
          onClick={onNewProject} 
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {isLoading && (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col bg-white border border-slate-200 rounded-[24px] shadow-sm p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex-grow" />
                <div className="pt-4 border-t border-slate-100 flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </>
        )}

        {!isLoading && projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-500 bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200 shadow-sm">
            <Film size={48} className="mb-4 text-slate-300" />
            <p className="text-xl font-bold text-slate-900 mb-2">No projects yet</p>
            <p className="text-slate-500 mb-6 text-center max-w-sm">Create your first ASMR video project to get started with the studio.</p>
            <button 
              onClick={onNewProject} 
              className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Plus size={18} />
              Create Project
            </button>
          </div>
        )}

        {!isLoading && projects && projects.map((project: Doc<"projects">) => (
          <div 
            key={project._id} 
            onClick={() => onSelectProject(project._id)}
            className="cursor-pointer group flex flex-col bg-white border border-slate-200 rounded-[24px] shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-6 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900 line-clamp-1 pr-8">{project.name}</h3>
              <button 
                onClick={(e) => handleDelete(e, project._id)}
                className="absolute top-6 right-6 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                title="Delete Project"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <p className="line-clamp-2 text-slate-500 text-sm flex-grow mb-6">{project.theme}</p>
            
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>{project.length}</span>
              <span className="bg-slate-50 px-2 py-1 rounded-md text-slate-600">{project.scenes.length} Scenes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
