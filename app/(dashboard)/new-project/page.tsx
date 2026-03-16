'use client';

import { useRouter } from 'next/navigation';
import ProjectCreator from '@/components/ProjectCreator';

export default function NewProjectRoute() {
  const router = useRouter();

  return (
    <ProjectCreator 
      onProjectCreated={(id) => router.push(`/projects/${id}`)}
      onCancel={() => router.push('/')}
    />
  );
}
