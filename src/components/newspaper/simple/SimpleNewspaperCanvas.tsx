'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NewspaperProject, CanvasElement, ElementType } from '@/lib/newspaper/simpleTypes';
import {
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  Move,
  Type,
  Sun,
  Megaphone,
  Upload,
  Loader2,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';

type ResizeHandleDirection = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

interface SimpleNewspaperCanvasProps {
  project: NewspaperProject;
  activePageIndex: number;
  selectedElementId: string | null;
  showGrid: boolean;
  zoomLevel: number; // e.g. 1 = 100%
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateElementContent: (id: string, updates: Partial<CanvasElement['content']>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onMoveElementOrder: (id: string, direction: 'up' | 'down') => void;
  onReorderElementToIndex: (elementId: string, targetIndex: number, layoutProps?: { width?: number; x?: number }) => void;
  onSwapElements: (sourceId: string, targetId: string) => void;
  onDropNewElement: (
    type: ElementType,
    options?: { insertIndex?: number; width?: number; x?: number }
  ) => void;
  isFullWidth?: boolean;
  onUploadImageToCloudinary: (file: File) => Promise<string | null>;
}

export default function SimpleNewspaperCanvas({
  project,
  activePageIndex,
  selectedElementId,
  showGrid,
  zoomLevel,
  isFullWidth = false,
  onSelectElement,
  onUpdateElement,
  onUpdateElementContent,
  onDeleteElement,
  onDuplicateElement,
  onMoveElementOrder,
  onReorderElementToIndex,
  onSwapElements,
  onDropNewElement,
  onUploadImageToCloudinary,
}: SimpleNewspaperCanvasProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const printableSheetRef = useRef<HTMLDivElement>(null);
  const [isCanvasDragOver, setIsCanvasDragOver] = useState(false);
  const [uploadingElementId, setUploadingElementId] = useState<string | null>(null);

  // ─── 8-DIRECTION RESIZING LOCAL REAL-TIME STATE ──────────────────────────
  const [activeResizing, setActiveResizing] = useState<{
    elementId: string;
    direction: ResizeHandleDirection;
    width: number;
    height: number;
    x: number;
  } | null>(null);

  const resizeSessionRef = useRef<{
    elementId: string;
    direction: ResizeHandleDirection;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startXPos: number;
    canvasWidth: number;
    currentWidth: number;
    currentHeight: number;
    currentX: number;
  } | null>(null);

  // ─── MOUSE DRAG MOVE & INSERTION TARGET STATE ────────────────────────────
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const [hoverTargetElementId, setHoverTargetElementId] = useState<string | null>(null);
  const [dropInsertionIndex, setDropInsertionIndex] = useState<number | null>(null);

  const currentPage = project.pages[activePageIndex] || project.pages[0];
  const elements = currentPage?.elements || [];

  const onUpdateElementRef = useRef(onUpdateElement);
  onUpdateElementRef.current = onUpdateElement;

  const onUpdateElementContentRef = useRef(onUpdateElementContent);
  onUpdateElementContentRef.current = onUpdateElementContent;

  // ─── GLOBAL WINDOW MOUSEMOVE & MOUSEUP RESIZE HANDLER ─────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeSessionRef.current) return;
      e.preventDefault();

      const session = resizeSessionRef.current;
      const deltaX = (e.clientX - session.startX) / zoomLevel;
      const deltaY = (e.clientY - session.startY) / zoomLevel;
      const deltaXPct = (deltaX / session.canvasWidth) * 100;

      let calcWidth = session.startWidth;
      let calcX = session.startXPos;
      let calcHeight = session.startHeight;

      if (session.direction === 'w' || session.direction === 'nw' || session.direction === 'sw') {
        const newLeft = Math.max(0, Math.min(session.startXPos + session.startWidth - 15, session.startXPos + deltaXPct));
        const widthChange = session.startXPos - newLeft;
        calcWidth = Math.max(15, Math.min(100 - newLeft, Math.round(session.startWidth + widthChange)));
        calcX = Math.round(newLeft);
      } else if (session.direction === 'e' || session.direction === 'ne' || session.direction === 'se') {
        calcWidth = Math.max(15, Math.min(100 - session.startXPos, Math.round(session.startWidth + deltaXPct)));
        calcX = session.startXPos;
      }

      if (session.direction === 's' || session.direction === 'se' || session.direction === 'sw') {
        calcHeight = Math.max(45, Math.min(950, Math.round(session.startHeight + deltaY)));
      } else if (session.direction === 'n' || session.direction === 'ne' || session.direction === 'nw') {
        calcHeight = Math.max(45, Math.min(950, Math.round(session.startHeight - deltaY)));
      }

      session.currentWidth = calcWidth;
      session.currentHeight = calcHeight;
      session.currentX = calcX;

      setActiveResizing({
        elementId: session.elementId,
        direction: session.direction,
        width: calcWidth,
        height: calcHeight,
        x: calcX,
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!resizeSessionRef.current) return;
      e.preventDefault();

      const session = resizeSessionRef.current;
      const finalWidth = session.currentWidth;
      const finalHeight = session.currentHeight;
      const finalX = session.currentX;

      resizeSessionRef.current = null;
      setActiveResizing(null);
      document.body.style.userSelect = '';

      onUpdateElementRef.current(session.elementId, {
        width: finalWidth,
        height: finalHeight,
        x: finalX,
      });

      onUpdateElementContentRef.current(session.elementId, {
        imageHeight: finalHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoomLevel]);

  const startResizeSession = (
    e: React.MouseEvent,
    elementId: string,
    direction: ResizeHandleDirection,
    initialWidth: number,
    initialHeight: number,
    initialX: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    document.body.style.userSelect = 'none';

    const canvasWidth =
      printableSheetRef.current?.getBoundingClientRect().width || 800;

    const w = initialWidth || 100;
    const h = initialHeight || 160;
    const xPos = initialX || 0;

    resizeSessionRef.current = {
      elementId,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: w,
      startHeight: h,
      startXPos: xPos,
      canvasWidth,
      currentWidth: w,
      currentHeight: h,
      currentX: xPos,
    };

    setActiveResizing({
      elementId,
      direction,
      width: w,
      height: h,
      x: xPos,
    });
  };

  // ─── CALCULATE DROP TARGET INDEX & COLUMN POSITION ───────────────────────
  const calculateDropTarget = (e: React.DragEvent) => {
    if (!printableSheetRef.current) return { insertIndex: 0, isLeft: true };

    const sheetRect = printableSheetRef.current.getBoundingClientRect();
    const dropXRelative = (e.clientX - sheetRect.left) / sheetRect.width;
    const isLeft = dropXRelative < 0.5;

    // Inspect child element boundaries
    const children = Array.from(printableSheetRef.current.querySelectorAll('[data-element-id]'));
    let insertIndex = elements.length;

    for (let i = 0; i < children.length; i++) {
      const childRect = children[i].getBoundingClientRect();
      // If mouse is above the vertical center of this element, insert before it
      if (e.clientY < childRect.top + childRect.height / 2) {
        insertIndex = i;
        break;
      }
    }

    return { insertIndex, isLeft };
  };

  // ─── SMART CANVAS DROP WITH AUTOMATIC COLUMN & POSITION DETECTION ────────
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isCanvasDragOver) setIsCanvasDragOver(true);

    const { insertIndex } = calculateDropTarget(e);
    setDropInsertionIndex(insertIndex);
  };

  const handleCanvasDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsCanvasDragOver(false);
    setDropInsertionIndex(null);
  };

  const handleCanvasDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsCanvasDragOver(false);
    setDropInsertionIndex(null);

    const { insertIndex, isLeft } = calculateDropTarget(e);

    // 1. File Drop
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const cloudinaryUrl = await onUploadImageToCloudinary(file);
        if (cloudinaryUrl) {
          if (selectedElementId) {
            onUpdateElementContent(selectedElementId, { imageUrl: cloudinaryUrl });
          } else {
            onDropNewElement('image', {
              insertIndex,
              width: 50,
              x: isLeft ? 0 : 50,
            });
          }
        }
        return;
      }
    }

    // 2. Existing Element Move / Reorder
    const sourceElementId = e.dataTransfer.getData('text/element-id') || draggingElementId;
    if (sourceElementId) {
      onReorderElementToIndex(sourceElementId, insertIndex, {
        width: 50,
        x: isLeft ? 0 : 0,
      });
      setDraggingElementId(null);
      return;
    }

    // 3. New Element Drop from Sidebar
    const elementType = e.dataTransfer.getData('text/plain') as ElementType;
    if (elementType) {
      onDropNewElement(elementType, {
        insertIndex,
        width: 50,
        x: isLeft ? 0 : 0,
      });
    }
  };

  // ─── SWAP / REPLACE DRAG HANDLERS ─────────────────────────────────────────
  const handleElementDragStart = (e: React.DragEvent, elementId: string) => {
    if (resizeSessionRef.current) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    setDraggingElementId(elementId);
    e.dataTransfer.setData('text/element-id', elementId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleElementDragOver = (e: React.DragEvent, targetElementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggingElementId && draggingElementId !== targetElementId) {
      if (hoverTargetElementId !== targetElementId) {
        setHoverTargetElementId(targetElementId);
      }
    }
  };

  const handleElementDrop = async (e: React.DragEvent, targetElementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setHoverTargetElementId(null);

    // 1. Direct Image file dropped onto this element
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setUploadingElementId(targetElementId);
        const cloudinaryUrl = await onUploadImageToCloudinary(file);
        if (cloudinaryUrl) {
          onUpdateElementContent(targetElementId, { imageUrl: cloudinaryUrl });
        }
        setUploadingElementId(null);
        return;
      }
    }

    // 2. Existing Element swap & replace
    const sourceId = e.dataTransfer.getData('text/element-id') || draggingElementId;
    if (sourceId && sourceId !== targetElementId) {
      onSwapElements(sourceId, targetElementId);
      setDraggingElementId(null);
      return;
    }

    // 3. New element dropped from left sidebar over existing element
    const newType = e.dataTransfer.getData('text/plain') as ElementType;
    if (newType) {
      const targetEl = elements.find((el) => el.id === targetElementId);
      const targetIdx = elements.findIndex((el) => el.id === targetElementId);
      onDropNewElement(newType, {
        insertIndex: Math.max(0, targetIdx),
        width: targetEl?.width || 50,
        x: targetEl?.x || 0,
      });
    }
  };

  return (
    <div
      ref={canvasContainerRef}
      className="flex-1 h-full overflow-y-auto overflow-x-auto bg-stone-200/70 p-4 sm:p-8 flex items-start justify-center min-h-[600px] select-none"
      onClick={() => onSelectElement(null)}
      onDragOver={handleCanvasDragOver}
      onDragLeave={handleCanvasDragLeave}
      onDrop={handleCanvasDrop}
    >
      <div
        ref={printableSheetRef}
        id="editor-canvas-sheet"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          transition: 'transform 150ms ease-out',
        }}
        className={`no-print relative mx-auto w-full transition-all duration-300 min-h-[1100px] shadow-2xl rounded-sm ${
          isFullWidth ? 'max-w-none w-full p-6 sm:p-14' : 'max-w-[860px] p-8 sm:p-12'
        } ${project.paperTexture} ${
          isCanvasDragOver
            ? 'ring-4 ring-amber-500 ring-offset-4 bg-amber-50/50'
            : ''
        } ${
          showGrid
            ? 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]'
            : ''
        }`}
      >
        {/* Drop Target Indicator Overlay */}
        {isCanvasDragOver && (
          <div className="absolute inset-4 z-40 border-2 border-dashed border-amber-500 bg-amber-500/10 rounded-2xl flex items-center justify-center pointer-events-none animate-pulse">
            <div className="bg-slate-900 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
              <Sparkles size={15} />
              <span>
                {dropInsertionIndex === 0
                  ? 'Drop to place at Top of page'
                  : 'Drop anywhere to place in Left, Right, or Full Column'}
              </span>
            </div>
          </div>
        )}

        {/* Newspaper Elements Flex Layout List (Supports Side-by-Side Columns) */}
        <div className="flex flex-wrap items-start w-full gap-y-6">
          {elements.map((el, index) => {
            const isSelected = selectedElementId === el.id;
            const isUploading = uploadingElementId === el.id;
            const isHoverTarget = hoverTargetElementId === el.id;
            const isResizingThis = activeResizing?.elementId === el.id;

            const elementWidth = isResizingThis
              ? activeResizing.width
              : el.width !== undefined
              ? el.width
              : 100;

            const elementX = isResizingThis
              ? activeResizing.x
              : el.x || 0;

            const elementHeight = isResizingThis
              ? activeResizing.height
              : el.height || (el.type === 'image' ? el.content.imageHeight || 220 : undefined);

            return (
              <div
                key={el.id}
                data-element-id={el.id}
                draggable={!activeResizing}
                onDragStart={(e) => handleElementDragStart(e, el.id)}
                onDragOver={(e) => handleElementDragOver(e, el.id)}
                onDrop={(e) => handleElementDrop(e, el.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(el.id);
                }}
                style={{
                  width: `${elementWidth}%`,
                  marginLeft: `${elementX}%`,
                  minHeight: elementHeight ? `${elementHeight}px` : undefined,
                  boxSizing: 'border-box',
                }}
                className={`relative transition-all rounded-lg group px-1.5 ${
                  isSelected
                    ? 'ring-2 ring-amber-500 bg-amber-500/5 shadow-sm'
                    : 'hover:ring-1 hover:ring-amber-300/80 cursor-pointer'
                } ${
                  isHoverTarget
                    ? 'ring-4 ring-purple-600 bg-purple-500/20 scale-[1.01] shadow-xl'
                    : ''
                }`}
              >
                {/* ─── SWAP & REPLACE BADGE WHEN DRAGGED OVER ──────────────── */}
                {isHoverTarget && (
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 z-40 bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                    <RefreshCw size={11} className="animate-spin" />
                    <span>Drop to Swap & Replace Section</span>
                  </div>
                )}

                {/* ─── TOP ACTION MINI-BAR & MOVE GRIP ──────────────────────── */}
                {isSelected && (
                  <div className="absolute -top-9 right-0 z-30 flex items-center gap-1 bg-slate-900 text-white px-2 py-1 rounded-xl shadow-lg text-[10px] font-bold animate-fade-in no-print">
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 cursor-grab active:cursor-grabbing mr-1"
                      title="Drag with mouse to move to Top, Bottom, or swap position"
                    >
                      <Move size={11} />
                      <span className="text-[9px]">Move / Swap</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveElementOrder(el.id, 'up');
                      }}
                      className="p-1 hover:bg-slate-800 rounded flex items-center gap-0.5"
                      title="Move to Top / Before previous element"
                    >
                      <ArrowUp size={12} />
                      <span className="text-[8px]">Top</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveElementOrder(el.id, 'down');
                      }}
                      className="p-1 hover:bg-slate-800 rounded flex items-center gap-0.5"
                      title="Move Down"
                    >
                      <ArrowDown size={12} />
                      <span className="text-[8px]">Down</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateElement(el.id);
                      }}
                      className="p-1 hover:bg-slate-800 rounded"
                      title="Duplicate"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteElement(el.id);
                      }}
                      className="p-1 hover:bg-rose-600 rounded text-rose-300"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}

                {/* ─── 8-DIRECTION INTERACTIVE MOUSE RESIZE HANDLES ─────────── */}
                {isSelected && (
                  <>
                    {/* Corners */}
                    <div
                      onMouseDown={(e) =>
                        startResizeSession(e, el.id, 'nw', elementWidth, elementHeight || 160, elementX)
                      }
                      className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-500 border-2 border-slate-900 rounded-full cursor-nw-resize z-30 shadow-md hover:scale-125 transition-transform"
                      title="Resize Top-Left (Left & Height)"
                    />
                    <div
                      onMouseDown={(e) =>
                        startResizeSession(e, el.id, 'ne', elementWidth, elementHeight || 160, elementX)
                      }
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 border-2 border-slate-900 rounded-full cursor-ne-resize z-30 shadow-md hover:scale-125 transition-transform"
                      title="Resize Top-Right (Right & Height)"
                    />
                    <div
                      onMouseDown={(e) =>
                        startResizeSession(e, el.id, 'sw', elementWidth, elementHeight || 160, elementX)
                      }
                      className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-500 border-2 border-slate-900 rounded-full cursor-sw-resize z-30 shadow-md hover:scale-125 transition-transform"
                      title="Resize Bottom-Left (Left & Height)"
                    />
                    <div
                      onMouseDown={(e) =>
                        startResizeSession(e, el.id, 'se', elementWidth, elementHeight || 160, elementX)
                      }
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 border-2 border-slate-900 rounded-full cursor-se-resize z-30 shadow-md hover:scale-125 transition-transform"
                      title="Resize Bottom-Right (Right & Height)"
                    />

                    {/* Edges */}
                    <div
                      onMouseDown={(e) =>
                        startResizeSession(e, el.id, 'n', elementWidth, elementHeight || 160, elementX)
                      }
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-500/95 hover:bg-amber-400 border border-slate-900 rounded-full cursor-n-resize z-30 shadow-xs flex items-center justify-center"
                      title="Resize Height (Top)"
                    />
                    <div
                      onMouseDown={(e) =>
                        startResizeSession(e, el.id, 's', elementWidth, elementHeight || 160, elementX)
                      }
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-500/95 hover:bg-amber-400 border border-slate-900 rounded-full cursor-s-resize z-30 shadow-xs flex items-center justify-center"
                      title="Resize Height (Bottom)"
                    />
                    <div
                      onMouseDown={(e) =>
                        startResizeSession(e, el.id, 'w', elementWidth, elementHeight || 160, elementX)
                      }
                      className="absolute top-1/2 -left-1.5 -translate-y-1/2 h-10 w-3 bg-amber-500/95 hover:bg-amber-400 border border-slate-900 rounded-full cursor-w-resize z-30 shadow-xs flex items-center justify-center"
                      title="Resize Width (From Left)"
                    />
                    <div
                      onMouseDown={(e) =>
                        startResizeSession(e, el.id, 'e', elementWidth, elementHeight || 160, elementX)
                      }
                      className="absolute top-1/2 -right-1.5 -translate-y-1/2 h-10 w-3 bg-amber-500/95 hover:bg-amber-400 border border-slate-900 rounded-full cursor-e-resize z-30 shadow-xs flex items-center justify-center"
                      title="Resize Width (From Right)"
                    />

                    {/* Live Dimension Tooltip while resizing */}
                    {isResizingThis && (
                      <div className="absolute top-2 right-2 bg-slate-900 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl z-40 border border-amber-500/50">
                        {elementWidth}% (L: {elementX}%) × {elementHeight || 160}px
                      </div>
                    )}
                  </>
                )}

                {/* ─── 1. MASTHEAD ELEMENT ─────────────────────────────────── */}
                {el.type === 'masthead' && (
                  <div className="text-center border-b-4 border-stone-900 pb-3 pt-1">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-stone-600 mb-1">
                      {project.editionDate || 'Official Student Edition'} · {project.schoolName}
                    </div>
                    <input
                      type="text"
                      value={el.content.title || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { title: e.target.value })}
                      className="w-full text-center text-4xl sm:text-6xl font-bold font-broadsheet tracking-tight uppercase bg-transparent outline-none border-b border-transparent focus:border-amber-400 text-stone-950"
                    />
                    <input
                      type="text"
                      value={el.content.subtitle || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { subtitle: e.target.value })}
                      className="w-full text-center text-xs italic font-newsreader mt-1 bg-transparent outline-none text-stone-700 border-t border-stone-700 pt-1"
                    />
                  </div>
                )}

                {/* ─── 2. HEADLINE ELEMENT ─────────────────────────────────── */}
                {el.type === 'headline' && (
                  <div className="py-2 border-b-2 border-stone-800">
                    <input
                      type="text"
                      value={el.content.title || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { title: e.target.value })}
                      className="w-full text-2xl sm:text-4xl font-bold font-broadsheet leading-tight uppercase bg-transparent outline-none text-stone-950"
                    />
                    {el.content.author && (
                      <div className="text-xs font-mono font-bold text-stone-700 mt-1">
                        By {el.content.author}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── 3. SUBHEADLINE ELEMENT ──────────────────────────────── */}
                {el.type === 'subheadline' && (
                  <div className="py-1">
                    <input
                      type="text"
                      value={el.content.title || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { title: e.target.value })}
                      className="w-full text-lg sm:text-xl font-bold italic font-newsreader leading-snug bg-transparent outline-none text-stone-800"
                    />
                  </div>
                )}

                {/* ─── 4. PARAGRAPH TEXT BOX ───────────────────────────────── */}
                {el.type === 'paragraph' && (
                  <div className="py-1 h-full flex flex-col flex-1">
                    <textarea
                      value={el.content.bodyText || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { bodyText: e.target.value })}
                      placeholder="Write your story details here..."
                      style={{
                        minHeight: elementHeight ? `${elementHeight - 20}px` : '110px',
                        height: elementHeight ? `${elementHeight - 20}px` : 'auto',
                      }}
                      className="w-full h-full flex-1 bg-transparent outline-none font-newsreader text-sm leading-relaxed text-stone-800 resize-none text-justify overflow-hidden"
                    />
                  </div>
                )}

                {/* ─── 5. MAIN STORY BLOCK (HEADLINE + PHOTO + 2 COLS) ────── */}
                {el.type === 'main_story_block' && (
                  <div className="space-y-3 pb-3 border-b border-stone-300 h-full flex flex-col">
                    <input
                      type="text"
                      value={el.content.title || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { title: e.target.value })}
                      className="w-full text-2xl sm:text-3xl font-bold font-broadsheet uppercase leading-tight bg-transparent outline-none text-stone-950"
                    />

                    {el.content.author && (
                      <div className="text-xs font-mono font-bold text-stone-600">
                        By {el.content.author}
                      </div>
                    )}

                    {/* Photo + Story Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start flex-1">
                      <div className={`${el.content.imageUrl ? 'md:col-span-5' : 'hidden'} space-y-1 relative group`}>
                        {isUploading ? (
                          <div className="w-full h-44 bg-stone-200 border border-stone-800 flex items-center justify-center text-xs font-bold text-slate-700 gap-2">
                            <Loader2 size={16} className="animate-spin text-amber-600" />
                            <span>Uploading to Cloudinary...</span>
                          </div>
                        ) : el.content.imageUrl ? (
                          <div className="relative group/img">
                            <img
                              src={el.content.imageUrl}
                              alt="Story photo"
                              style={{
                                height: elementHeight ? `${Math.min(elementHeight - 60, 500)}px` : undefined,
                              }}
                              className={`w-full max-h-80 object-cover border border-stone-800 transition-all ${
                                el.content.imageFilter || 'filter-halftone'
                              }`}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 pointer-events-none">
                              <Upload size={12} />
                              <span>Drag & Drop New Image</span>
                            </div>
                          </div>
                        ) : null}

                        {el.content.imageCaption && (
                          <p className="text-[10px] font-newsreader italic text-stone-600 leading-tight pt-1">
                            {el.content.imageCaption}
                          </p>
                        )}
                      </div>

                      <div className={`${el.content.imageUrl ? 'md:col-span-7' : 'md:col-span-12'} h-full flex flex-col flex-1`}>
                        <textarea
                          value={el.content.bodyText || ''}
                          onChange={(e) => onUpdateElementContent(el.id, { bodyText: e.target.value })}
                          style={{
                            minHeight: elementHeight ? `${elementHeight - 80}px` : '150px',
                            height: elementHeight ? `${elementHeight - 80}px` : 'auto',
                          }}
                          className="w-full h-full flex-1 bg-transparent outline-none font-newsreader text-xs sm:text-sm leading-relaxed text-stone-800 resize-none text-justify overflow-hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── 6. SECONDARY STORY BLOCK ────────────────────────────── */}
                {el.type === 'secondary_story_block' && (
                  <div className="p-3 bg-stone-100/60 border border-stone-300 space-y-2 rounded h-full flex flex-col">
                    <input
                      type="text"
                      value={el.content.title || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { title: e.target.value })}
                      className="w-full text-base sm:text-lg font-bold font-broadsheet uppercase bg-transparent outline-none text-stone-900"
                    />
                    <textarea
                      value={el.content.bodyText || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { bodyText: e.target.value })}
                      style={{
                        minHeight: elementHeight ? `${elementHeight - 60}px` : '80px',
                        height: elementHeight ? `${elementHeight - 60}px` : 'auto',
                      }}
                      className="w-full h-full flex-1 bg-transparent outline-none font-newsreader text-xs leading-relaxed text-stone-700 resize-none overflow-hidden"
                    />
                  </div>
                )}

                {/* ─── 7. SPORTS BLOCK ─────────────────────────────────────── */}
                {el.type === 'sports_block' && (
                  <div className="p-4 bg-stone-900 text-stone-100 space-y-3 rounded h-full flex flex-col">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 border-b border-stone-800 pb-1">
                      <span>SPORTS ROUNDUP & RECAP</span>
                      <span>VARSITY REPORT</span>
                    </div>
                    <input
                      type="text"
                      value={el.content.title || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { title: e.target.value })}
                      className="w-full text-xl sm:text-2xl font-bold font-broadsheet uppercase bg-transparent outline-none text-white"
                    />
                    <textarea
                      value={el.content.bodyText || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { bodyText: e.target.value })}
                      style={{
                        minHeight: elementHeight ? `${elementHeight - 80}px` : '100px',
                        height: elementHeight ? `${elementHeight - 80}px` : 'auto',
                      }}
                      className="w-full h-full flex-1 bg-transparent outline-none font-newsreader text-xs sm:text-sm leading-relaxed text-stone-300 resize-none overflow-hidden"
                    />
                  </div>
                )}

                {/* ─── 8. OPINION / EDITORIAL COLUMN ───────────────────────── */}
                {el.type === 'opinion_block' && (
                  <div className="p-4 bg-stone-200/60 border-l-4 border-stone-800 space-y-2 h-full flex flex-col">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      EDITORIAL OPINION · {el.content.author || 'Guest Columnist'}
                    </div>
                    <input
                      type="text"
                      value={el.content.title || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { title: e.target.value })}
                      className="w-full text-base font-bold font-broadsheet italic bg-transparent outline-none text-stone-900"
                    />
                    <textarea
                      value={el.content.bodyText || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { bodyText: e.target.value })}
                      style={{
                        minHeight: elementHeight ? `${elementHeight - 70}px` : '80px',
                        height: elementHeight ? `${elementHeight - 70}px` : 'auto',
                      }}
                      className="w-full h-full flex-1 bg-transparent outline-none font-newsreader text-xs leading-relaxed text-stone-800 resize-none overflow-hidden"
                    />
                  </div>
                )}

                {/* ─── 9. PULL QUOTE ───────────────────────────────────────── */}
                {el.type === 'quote' && (
                  <div className="p-4 border-y-2 border-stone-800 text-center space-y-1 h-full flex flex-col justify-center">
                    <textarea
                      value={el.content.quoteText || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { quoteText: e.target.value })}
                      style={{
                        minHeight: elementHeight ? `${elementHeight - 50}px` : '60px',
                        height: elementHeight ? `${elementHeight - 50}px` : 'auto',
                      }}
                      className="w-full text-center text-base sm:text-lg italic font-bold font-broadsheet bg-transparent outline-none text-stone-900 resize-none overflow-hidden"
                    />
                    <input
                      type="text"
                      value={el.content.quoteSpeaker || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { quoteSpeaker: e.target.value })}
                      className="w-full text-center text-xs font-newsreader text-stone-600 bg-transparent outline-none font-semibold"
                    />
                  </div>
                )}

                {/* ─── 10. MEDIA / PHOTO ───────────────────────────────────── */}
                {el.type === 'image' && (
                  <div className="space-y-1 relative group/img">
                    {isUploading ? (
                      <div className="w-full h-44 bg-stone-200 border-2 border-dashed border-stone-800 flex items-center justify-center text-xs font-bold text-slate-700 gap-2">
                        <Loader2 size={16} className="animate-spin text-amber-600" />
                        <span>Uploading to Cloudinary...</span>
                      </div>
                    ) : el.content.imageUrl ? (
                      <div className="relative">
                        <img
                          src={el.content.imageUrl}
                          alt="Photo"
                          className={`w-full object-cover border border-stone-800 transition-all ${
                            el.content.imageFilter || 'none'
                          }`}
                          style={{
                            height: elementHeight ? `${elementHeight}px` : undefined,
                            maxHeight: '750px',
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 pointer-events-none">
                          <Upload size={12} />
                          <span>Drag & Drop New Image Here</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{ height: elementHeight ? `${elementHeight}px` : '180px' }}
                        className="bg-stone-200 border-2 border-dashed border-stone-400 flex flex-col items-center justify-center text-stone-500 text-xs"
                      >
                        <ImageIcon size={24} className="mb-1" />
                        <span>Drag & Drop image here or select on right</span>
                      </div>
                    )}

                    <input
                      type="text"
                      value={el.content.imageCaption || ''}
                      onChange={(e) => onUpdateElementContent(el.id, { imageCaption: e.target.value })}
                      placeholder="Add photo caption..."
                      className="w-full text-[11px] font-newsreader italic text-stone-600 bg-transparent outline-none border-b border-transparent focus:border-stone-400 pt-1"
                    />
                  </div>
                )}

                {/* ─── 11. DIVIDER LINE ────────────────────────────────────── */}
                {el.type === 'divider' && (
                  <div className="py-2 flex items-center gap-2">
                    <div className="flex-1 border-t-2 border-stone-800" />
                    <span className="text-[10px] text-stone-600 font-mono font-bold">★ ★ ★</span>
                    <div className="flex-1 border-t-2 border-stone-800" />
                  </div>
                )}

                {/* ─── 12. WEATHER WIDGET ──────────────────────────────────── */}
                {el.type === 'weather_widget' && (
                  <div className="p-3 bg-stone-100 border border-stone-300 text-xs font-mono flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sun size={16} className="text-amber-600" />
                      <div>
                        <div className="font-bold text-stone-900">{el.content.weatherCity || 'Forecast'}</div>
                        <div className="text-[10px] text-stone-500">{el.content.weatherTemp || '72°F · Clear'}</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-stone-600 max-w-[200px] truncate">
                      {el.content.weatherForecast || 'Sunny conditions throughout the weekend.'}
                    </div>
                  </div>
                )}

                {/* ─── 13. AD BOX ──────────────────────────────────────────── */}
                {el.type === 'ad_box' && (
                  <div className="p-4 border-2 border-dashed border-stone-600 text-center space-y-1 bg-stone-100/80">
                    <div className="text-[9px] uppercase font-bold tracking-widest text-stone-500">
                      COMMUNITY CLASSIFIED
                    </div>
                    <input
                      type="text"
                      value={el.content.adTitle || 'CAMPUS BAKERY SALE THIS FRIDAY'}
                      onChange={(e) => onUpdateElementContent(el.id, { adTitle: e.target.value })}
                      className="w-full text-center font-bold text-xs uppercase bg-transparent outline-none text-stone-900 font-serif"
                    />
                    <textarea
                      rows={2}
                      value={el.content.adText || 'Fresh pastries and hot cider in the courtyard after homeroom.'}
                      onChange={(e) => onUpdateElementContent(el.id, { adText: e.target.value })}
                      className="w-full text-center text-[10px] text-stone-600 bg-transparent outline-none resize-none font-mono"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
