'use client';

import { useState } from 'react';
import { KanbanStoryCard, KanbanStatus, ArticleCategory } from '@/lib/newspaper/types';
import { INITIAL_KANBAN_STORIES, saveStoredKanban } from '@/lib/newspaper/storage';
import {
  Users,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Flame,
  MessageSquare,
  Shield,
  Layers,
} from 'lucide-react';

const KANBAN_COLUMNS: { id: KanbanStatus; label: string; color: string }[] = [
  { id: 'ideas', label: 'Story Ideas', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'researching', label: 'Researching', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 'writing', label: 'Writing Draft', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'editing', label: 'Copy Editing', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'fact_checking', label: 'Fact Checking', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 'ready_to_publish', label: 'Ready to Print', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
];

export default function CollaborativeNewsroom() {
  const [cards, setCards] = useState<KanbanStoryCard[]>(INITIAL_KANBAN_STORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ArticleCategory>('Breaking News');
  const [newReporter, setNewReporter] = useState('Alex Rivera');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'breaking'>('high');

  const handleMoveCard = (cardId: string, direction: 'left' | 'right') => {
    setCards((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== cardId) return c;
        const currentIdx = KANBAN_COLUMNS.findIndex((col) => col.id === c.status);
        const targetIdx = direction === 'right' ? Math.min(KANBAN_COLUMNS.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
        return { ...c, status: KANBAN_COLUMNS[targetIdx].id };
      });
      saveStoredKanban(updated);
      return updated;
    });
  };

  const handleAddCard = () => {
    if (!newTitle) return;
    const newCard: KanbanStoryCard = {
      id: `k_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      assignedReporter: newReporter,
      assignedReporterAvatar: '👩‍💻',
      status: 'ideas',
      priority: newPriority,
      notesCount: 1,
      dueDate: 'Sep 02',
    };
    const updated = [newCard, ...cards];
    setCards(updated);
    saveStoredKanban(updated);
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="card p-6 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Layers size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Collaborative Newsroom Desk & Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live editorial board tracking news assignments from pitch to front page.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus size={14} />
          <span>Pitch Story Idea</span>
        </button>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const columnCards = cards.filter((c) => c.status === col.id);

          return (
            <div key={col.id} className="card p-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-3 min-w-[200px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">{columnCards.length}</span>
                </div>

                <div className="space-y-2.5 mt-3">
                  {columnCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {card.category}
                        </span>
                        {card.priority === 'breaking' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 flex items-center gap-0.5">
                            <Flame size={9} /> Breaking
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 leading-snug">{card.title}</h4>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-semibold text-slate-600">
                          <span>{card.assignedReporterAvatar}</span>
                          <span>{card.assignedReporter}</span>
                        </span>
                        <span>Due {card.dueDate}</span>
                      </div>

                      {/* Advance buttons */}
                      <div className="flex justify-between items-center pt-1">
                        <button
                          type="button"
                          onClick={() => handleMoveCard(card.id, 'left')}
                          className="text-[10px] text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCard(card.id, 'right')}
                          className="text-[10px] text-sage-600 hover:text-sage-800 font-bold cursor-pointer"
                        >
                          Advance →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Story Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card p-6 bg-white border border-slate-200 shadow-2xl max-w-md w-full space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Pitch New Story Card</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Story Headline Pitch:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Campus Cafeteria Switches to Organic Produce..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Reporter:</label>
                <input
                  type="text"
                  value={newReporter}
                  onChange={(e) => setNewReporter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-ghost text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCard}
                className="btn-primary text-xs py-2 px-5 font-bold"
              >
                Add to Ideas Column
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
