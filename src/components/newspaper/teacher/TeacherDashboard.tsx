'use client';

import { useState } from 'react';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
} from '@/lib/newspaper/storage';
import { ClassroomAssignment, StudentSubmission } from '@/lib/newspaper/types';
import {
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  Award,
  MessageSquare,
  Sparkles,
  BarChart3,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState<ClassroomAssignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);

  // Review State
  const [reviewScore, setReviewScore] = useState<number>(95);
  const [reviewNotes, setReviewNotes] = useState<string>('');

  // Create Assignment Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('Sep 05, 2026');

  const handleCreateAssignment = () => {
    if (!newTitle) return;
    const newAsg: ClassroomAssignment = {
      id: `asg_${Date.now()}`,
      classroomId: 'room_302_journalism',
      title: newTitle,
      description: newDesc || 'Write a balanced front-page news report with 2+ quotes.',
      assignmentType: 'full_newspaper',
      dueDate: newDueDate,
      submissionsCount: 0,
      maxScore: 100,
      rubricCriteria: [
        { criterion: 'Inverted Pyramid Lead', weight: 30, description: '5 Ws in lead' },
        { criterion: 'Source Balance', weight: 30, description: '2+ attributed quotes' },
        { criterion: 'Layout & Typography', weight: 40, description: 'Visual hierarchy' },
      ],
    };
    setAssignments([newAsg, ...assignments]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleSaveGrade = () => {
    if (!selectedSubmission) return;
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubmission.id
          ? { ...sub, status: 'graded', score: reviewScore, feedbackNotes: reviewNotes || sub.feedbackNotes }
          : sub
      )
    );
    setSelectedSubmission(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Teacher Top Bar */}
      <div className="card p-6 bg-gradient-to-r from-white via-slate-50 to-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sage-500 text-white flex items-center justify-center shadow-md shadow-sage-500/20">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                Period 3: Journalism & Media Studies
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sage-100 text-sage-800">
                Code: RVH-302
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Teacher: Ms. Katherine Sullivan · 28 Enrolled Students · River Valley High
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus size={15} />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Analytics Snapshot Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Class Average Score</span>
          <div className="text-2xl font-bold text-slate-800">92.4%</div>
          <span className="text-[10px] text-emerald-600 font-bold">+4.1% from last month</span>
        </div>

        <div className="card p-5 border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published Editions</span>
          <div className="text-2xl font-bold text-purple-600">38 Papers</div>
          <span className="text-[10px] text-slate-500">Across 6 assignments</span>
        </div>

        <div className="card p-5 border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fact-Check Accuracy</span>
          <div className="text-2xl font-bold text-sky-600">89.8%</div>
          <span className="text-[10px] text-slate-500">142 claims verified</span>
        </div>

        <div className="card p-5 border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Reviews</span>
          <div className="text-2xl font-bold text-amber-600">2 Submissions</div>
          <span className="text-[10px] text-slate-500">Ready for grading</span>
        </div>
      </div>

      {/* Main Grid: Active Assignments & Student Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Assignments (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <BookOpen size={16} className="text-sage-600" />
            Classroom Assignments ({assignments.length})
          </h3>

          <div className="space-y-3">
            {assignments.map((asg) => (
              <div key={asg.id} className="card p-5 border border-slate-200 bg-white hover:shadow-md transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Due {asg.dueDate}
                  </span>
                  <span className="text-xs font-mono font-bold text-sage-700">
                    {asg.submissionsCount} Turned In
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-800">{asg.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{asg.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Student Submissions Review Queue (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Users size={16} className="text-sage-600" />
            Student Submissions Review Queue
          </h3>

          <div className="space-y-3">
            {submissions.map((sub) => {
              const isGraded = sub.status === 'graded';

              return (
                <div
                  key={sub.id}
                  className="card p-5 border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{sub.studentName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isGraded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isGraded ? `Graded (${sub.score}/100)` : 'Needs Review'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-serif">"{sub.newspaperTitle}"</div>
                    {sub.feedbackNotes && (
                      <p className="text-[11px] text-slate-400 italic">Teacher note: {sub.feedbackNotes}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setReviewScore(sub.score || 90);
                      setReviewNotes(sub.feedbackNotes || '');
                    }}
                    className="btn-ghost text-xs py-2 px-3.5 whitespace-nowrap self-start sm:self-auto"
                  >
                    <MessageSquare size={13} />
                    <span>{isGraded ? 'Update Feedback' : 'Grade Submission'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── REVIEW & RUBRIC GRADING MODAL ─────────────────────────────────── */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl max-w-xl w-full space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600">
                  Rubric Assessment & Feedback
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Reviewing: {selectedSubmission.studentName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Grade Score (0 - 100):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={reviewScore}
                  onChange={(e) => setReviewScore(parseInt(e.target.value) || 0)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-bold text-base text-slate-900 focus:ring-2 focus:ring-sage-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Editorial Comments & Praise:
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Excellent lead paragraph and great source quote selection..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 focus:ring-2 focus:ring-sage-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="btn-ghost text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGrade}
                className="btn-primary text-xs py-2 px-5 font-bold"
              >
                Save & Post Grade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CREATE ASSIGNMENT MODAL ───────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl max-w-lg w-full space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create New Journalism Assignment</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Assignment Title:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Investigative STEM Fair Code Audit..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sage-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Instructions / Learning Goals:
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Conduct source interviews with judges and audit the Git commits..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sage-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Due Date:
                </label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-ghost text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAssignment}
                className="btn-primary text-xs py-2 px-5 font-bold"
              >
                Post to Classroom
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
