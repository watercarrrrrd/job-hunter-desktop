import type { RefObject } from 'react';
import type { ResumeContent, ResumeTemplateId } from '@shared/types';
import ClassicTemplate from './templates/ClassicTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';

interface ResumePreviewProps {
  content: ResumeContent;
  templateId: ResumeTemplateId;
  contentRef: RefObject<HTMLDivElement>;
}

/** 预览容器：固定 A4 宽度，供 PDF 导出时整页截图 */
export default function ResumePreview({ content, templateId, contentRef }: ResumePreviewProps) {
  return (
    <div ref={contentRef} className="mx-auto w-[794px] bg-white p-10 shadow">
      {templateId === 'two-column' ? (
        <TwoColumnTemplate content={content} />
      ) : (
        <ClassicTemplate content={content} />
      )}
    </div>
  );
}
