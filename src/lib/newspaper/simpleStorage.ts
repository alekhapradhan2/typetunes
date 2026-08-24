// Simplified Local Storage & Project Persistence for Newspaper Studio

import { NewspaperProject } from './simpleTypes';
import { createInitialProjectFromTemplate } from './templatePresets';

const STORAGE_KEY = 'typetunes_canva_newspapers_v2';

export const DEFAULT_INITIAL_PROJECTS: NewspaperProject[] = [
  createInitialProjectFromTemplate(
    'THE VALLEY CHRONICLE',
    'The Official Voice of River Valley High',
    'school'
  ),
  createInitialProjectFromTemplate(
    'VARSITY SPORTS GAZETTE',
    'Championship Recaps & High School Athletics',
    'sports'
  ),
];

export function getStoredProjects(): NewspaperProject[] {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredProjects(DEFAULT_INITIAL_PROJECTS);
      return DEFAULT_INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[NewspaperStudio] Failed to load projects:', e);
    return DEFAULT_INITIAL_PROJECTS;
  }
}

export function saveStoredProjects(projects: NewspaperProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.warn('[NewspaperStudio] Failed to save projects:', e);
  }
}

export function saveSingleProject(project: NewspaperProject): void {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  const updatedProject = { ...project, updatedAt: new Date().toISOString() };

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.unshift(updatedProject);
  }

  saveStoredProjects(projects);
}

export function duplicateProject(projectId: string): NewspaperProject | null {
  const projects = getStoredProjects();
  const existing = projects.find((p) => p.id === projectId);
  if (!existing) return null;

  const duplicated: NewspaperProject = {
    ...existing,
    id: `project_${Date.now()}`,
    title: `${existing.title} (Copy)`,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: existing.pages.map((p, idx) => ({
      ...p,
      id: `page_${Date.now()}_${idx + 1}`,
      elements: p.elements.map((el) => ({ ...el, id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` })),
    })),
  };

  projects.unshift(duplicated);
  saveStoredProjects(projects);
  return duplicated;
}

export function deleteProject(projectId: string): void {
  const projects = getStoredProjects();
  const filtered = projects.filter((p) => p.id !== projectId);
  saveStoredProjects(filtered);
}
