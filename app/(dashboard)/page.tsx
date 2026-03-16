'use client';

import { useRouter } from 'next/navigation';
import ProjectList from '@/components/ProjectList';

export default function DashboardProjectsRoute() {
  const router = useRouter();

  const handleNewProject = () => {
    router.push('/new-project');
  };

  const handleSelectProject = (id: string) => {
    router.push(`/projects/${id}`);
  };

  return (
    <ProjectList 
      onNewProject={handleNewProject} 
      onSelectProject={handleSelectProject} 
    />
  );
}
