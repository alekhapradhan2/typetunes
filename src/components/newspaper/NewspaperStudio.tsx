'use client';

import React, { useState, useEffect } from 'react';
import { NewspaperProject, TemplateId, PageSize, PageOrientation } from '@/lib/newspaper/simpleTypes';
import {
  getStoredProjects,
  saveStoredProjects,
  duplicateProject,
  deleteProject,
} from '@/lib/newspaper/simpleStorage';
import { createInitialProjectFromTemplate } from '@/lib/newspaper/templatePresets';
import NewspaperLandingPage from './simple/NewspaperLandingPage';
import StudentDashboard from './simple/StudentDashboard';
import CreateNewspaperModal from './simple/CreateNewspaperModal';
import SimpleCanvaEditor from './simple/SimpleCanvaEditor';
import SimplePreviewModal from './simple/SimplePreviewModal';

type StudioView = 'landing' | 'dashboard' | 'editor';

export default function NewspaperStudio() {
  const [currentView, setCurrentView] = useState<StudioView>('landing');
  const [projects, setProjects] = useState<NewspaperProject[]>([]);
  const [activeProject, setActiveProject] = useState<NewspaperProject | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplateForCreate, setSelectedTemplateForCreate] = useState<TemplateId>('school');
  const [previewProject, setPreviewProject] = useState<NewspaperProject | null>(null);

  // Load stored projects on mount
  useEffect(() => {
    setProjects(getStoredProjects());
  }, []);

  const refreshProjects = () => {
    setProjects(getStoredProjects());
  };

  const handleStartCreating = () => {
    setSelectedTemplateForCreate('school');
    setIsCreateModalOpen(true);
  };

  const handleSelectTemplateFromLanding = (templateId: TemplateId) => {
    setSelectedTemplateForCreate(templateId);
    setIsCreateModalOpen(true);
  };

  const handleCreateProject = (config: {
    title: string;
    tagline: string;
    editionDate: string;
    pageSize: PageSize;
    orientation: PageOrientation;
    templateId: TemplateId;
  }) => {
    const newProject = createInitialProjectFromTemplate(
      config.title,
      config.tagline,
      config.templateId,
      config.editionDate
    );
    newProject.pageSize = config.pageSize;
    newProject.orientation = config.orientation;

    const allProjects = [newProject, ...projects];
    saveStoredProjects(allProjects);
    setProjects(allProjects);

    setIsCreateModalOpen(false);
    setActiveProject(newProject);
    setCurrentView('editor');
  };

  const handleEditProject = (project: NewspaperProject) => {
    setActiveProject(project);
    setCurrentView('editor');
  };

  const handleDuplicate = (projectId: string) => {
    duplicateProject(projectId);
    refreshProjects();
  };

  const handleDelete = (projectId: string) => {
    deleteProject(projectId);
    refreshProjects();
  };

  const handleBackToDashboard = () => {
    refreshProjects();
    setActiveProject(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col">
      {/* ─── 1. LANDING PAGE VIEW ────────────────────────────────────────── */}
      {currentView === 'landing' && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <NewspaperLandingPage
            onStartCreating={handleStartCreating}
            onSelectTemplate={handleSelectTemplateFromLanding}
            onGoToDashboard={() => setCurrentView('dashboard')}
          />
        </div>
      )}

      {/* ─── 2. DASHBOARD VIEW (MY NEWSPAPERS) ─────────────────────────────── */}
      {currentView === 'dashboard' && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
          </div>

          <StudentDashboard
            projects={projects}
            onCreateNew={handleStartCreating}
            onEditProject={handleEditProject}
            onDuplicateProject={handleDuplicate}
            onDeleteProject={handleDelete}
            onPreviewProject={(proj) => setPreviewProject(proj)}
          />
        </div>
      )}

      {/* ─── 3. CANVA DRAG-AND-DROP EDITOR VIEW ───────────────────────────── */}
      {currentView === 'editor' && activeProject && (
        <SimpleCanvaEditor
          initialProject={activeProject}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {/* ─── CREATE NEWSPAPER SETUP MODAL ─────────────────────────────────── */}
      <CreateNewspaperModal
        isOpen={isCreateModalOpen}
        initialTemplateId={selectedTemplateForCreate}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {/* ─── STANDALONE PREVIEW MODAL (DASHBOARD PREVIEW) ──────────────────── */}
      {previewProject && (
        <SimplePreviewModal
          project={previewProject}
          isOpen={!!previewProject}
          onClose={() => setPreviewProject(null)}
        />
      )}
    </div>
  );
}
