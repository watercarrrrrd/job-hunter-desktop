import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { api } from '../lib/api';

// A4 页面尺寸（mm）与 96dpi 像素换算，预览容器固定宽度与 A4 宽度对齐
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = Math.round((A4_HEIGHT_MM / A4_WIDTH_MM) * A4_WIDTH_PX);

/** 单页在画布上的切片信息（像素坐标，scale=2 下） */
export interface PageCut {
  top: number;
  height: number;
}

/**
 * 按内容高度与元素边界把整页切分成若干 A4 页。
 * 纯函数：totalHeight/pageContentHeightPx/boundaries 均为数值，便于单元测试。
 * 切分策略：优先选择「不超过理想底边、且不低于本页 60% 高度」的最近元素边界，
 * 避免在文字行中间截断；找不到合适边界时退化为固定高度切分。
 */
export function computePageCuts(
  totalHeight: number,
  pageContentHeightPx: number,
  boundaries: number[],
): PageCut[] {
  if (totalHeight <= 0) {
    return [{ top: 0, height: pageContentHeightPx }];
  }

  const sorted = Array.from(new Set(boundaries))
    .filter((y) => y > 0)
    .sort((a, b) => a - b);

  const cuts: PageCut[] = [];
  let currentTop = 0;

  while (currentTop < totalHeight - 1) {
    const remaining = totalHeight - currentTop;
    if (remaining <= pageContentHeightPx) {
      cuts.push({ top: currentTop, height: remaining });
      break;
    }

    const idealBottom = currentTop + pageContentHeightPx;
    const minCut = currentTop + pageContentHeightPx * 0.6;
    let cutY = idealBottom;
    for (const b of sorted) {
      if (b >= minCut && b <= idealBottom) {
        cutY = b;
      }
    }

    cuts.push({ top: currentTop, height: cutY - currentTop });
    currentTop = cutY;
  }

  if (cuts.length === 0) {
    cuts.push({ top: 0, height: totalHeight });
  }
  return cuts;
}

/** 收集预览节点内所有子元素相对节点的上下边缘（作为安全切分点） */
function collectChildEdges(node: HTMLElement): number[] {
  const nodeRect = node.getBoundingClientRect();
  const edges: number[] = [];
  const walk = (el: Element): void => {
    for (const child of Array.from(el.children)) {
      const rect = child.getBoundingClientRect();
      edges.push(rect.top - nodeRect.top, rect.bottom - nodeRect.top);
      walk(child);
    }
  };
  walk(node);
  return edges;
}

/**
 * 将预览节点导出为 A4 PDF，并通过保存对话框落盘。
 * 返回保存后的绝对路径；用户取消或导出失败返回 null。
 */
export async function exportResumeToPdf(
  node: HTMLElement,
  fileName: string,
): Promise<string | null> {
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  });

  const totalHeight = node.scrollHeight || node.offsetHeight;
  const pageContentHeightPx = A4_HEIGHT_PX * 2; // scale=2 下每页可容纳的像素高度
  const cuts = computePageCuts(totalHeight, pageContentHeightPx, collectChildEdges(node));

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  cuts.forEach((cut, index) => {
    if (index > 0) pdf.addPage();

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = cut.height;
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(
      canvas,
      0,
      cut.top,
      canvas.width,
      cut.height,
      0,
      0,
      canvas.width,
      cut.height,
    );

    pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  });

  const dataUri = pdf.output('datauristring');
  const base64 = dataUri.slice(dataUri.indexOf(',') + 1);

  const result = await api.file.savePdf(fileName, base64);
  return result.ok ? result.data : null;
}
