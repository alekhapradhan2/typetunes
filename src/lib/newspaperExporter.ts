import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export interface ExportOptions {
  fileName?: string;
  format: 'png' | 'jpeg' | 'pdf';
  quality?: number; // 0.95
  scale?: number; // 2 or 3 for ultra-HD crisp print quality
}

export async function exportNewspaperElement(
  elementId: string,
  options: ExportOptions
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for export.`);
  }

  const fileName = options.fileName || 'newspaper-frontpage';
  const scale = options.scale || 2;

  // Trigger celebration confetti
  try {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6aa850', '#c8a878', '#374151', '#e1eedd'],
    });
  } catch {
    // Non-critical
  }

  // Filter out UI helper buttons or temporary overlays if any
  const filter = (node: HTMLElement) => {
    if (node.classList && node.classList.contains('no-export')) {
      return false;
    }
    return true;
  };

  const imageOptions = {
    quality: options.quality || 0.95,
    pixelRatio: scale,
    filter: filter as (domNode: HTMLElement) => boolean,
    backgroundColor: '#ffffff',
  };

  if (options.format === 'png') {
    const dataUrl = await toPng(element, imageOptions);
    downloadDataUrl(dataUrl, `${fileName}.png`);
    return;
  }

  if (options.format === 'jpeg') {
    const dataUrl = await toJpeg(element, imageOptions);
    downloadDataUrl(dataUrl, `${fileName}.jpg`);
    return;
  }

  if (options.format === 'pdf') {
    // Generate high-resolution PNG first, then embed in standard PDF
    const dataUrl = await toPng(element, { ...imageOptions, pixelRatio: 2.5 });
    
    // Create image to get natural dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const imgWidth = img.width;
    const imgHeight = img.height;
    
    // PDF orientation
    const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
    const pdf = new jsPDF({
      orientation: orientation as 'portrait' | 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Scale to fit page with small 5mm margin
    const margin = 5;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const widthRatio = availableWidth / imgWidth;
    const heightRatio = availableHeight / imgHeight;
    const bestRatio = Math.min(widthRatio, heightRatio);

    const printWidth = imgWidth * bestRatio;
    const printHeight = imgHeight * bestRatio;

    const xOffset = margin + (availableWidth - printWidth) / 2;
    const yOffset = margin + (availableHeight - printHeight) / 2;

    pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, printWidth, printHeight, undefined, 'FAST');
    pdf.save(`${fileName}.pdf`);
  }
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printNewspaper(): void {
  window.print();
}
