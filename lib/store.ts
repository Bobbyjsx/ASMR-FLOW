import { ASMRist, Project, Settings } from '@/types';

export const getSettings = (): Settings => {
  if (typeof window === 'undefined') return { preferredInput: 'text', preferredOutput: 'text' };
  const data = localStorage.getItem('settings');
  return data ? JSON.parse(data) : { preferredInput: 'text', preferredOutput: 'text' };
};

export const saveSettings = (settings: Settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

export const getASMRists = (): ASMRist[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('asmrists');
  return data ? JSON.parse(data) : [];
};

export const saveASMRist = (asmrist: ASMRist) => {
  const asmrists = getASMRists();
  asmrists.push(asmrist);
  localStorage.setItem('asmrists', JSON.stringify(asmrists));
};

export const deleteASMRist = (id: string) => {
  const asmrists = getASMRists().filter(a => a.id !== id);
  localStorage.setItem('asmrists', JSON.stringify(asmrists));
};

export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('projects');
  return data ? JSON.parse(data) : [];
};

export const saveProject = (project: Project) => {
  const projects = getProjects();
  projects.push(project);
  localStorage.setItem('projects', JSON.stringify(projects));
};

export const updateProject = (updatedProject: Project) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    localStorage.setItem('projects', JSON.stringify(projects));
  }
};

export const deleteProject = (id: string) => {
  const projects = getProjects().filter(p => p.id !== id);
  localStorage.setItem('projects', JSON.stringify(projects));
};
