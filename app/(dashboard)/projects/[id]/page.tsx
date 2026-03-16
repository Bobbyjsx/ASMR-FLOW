'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectViewer from '@/components/ProjectViewer';

export default function ProjectDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setProjectId(p.id));
  }, [params]);

  if (!projectId) return null;

  return (
    <ProjectViewer 
      projectId={projectId}
      onBack={() => router.push('/')}
    />
  );
}
