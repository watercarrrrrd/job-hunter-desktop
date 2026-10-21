import type { ResumeContent } from '@shared/types';
import FormField from '../../components/FormField';
import Input from '../../components/Input';
import ActivitySection from './sections/ActivitySection';
import BasicSection from './sections/BasicSection';
import CertificateSection from './sections/CertificateSection';
import EducationSection from './sections/EducationSection';
import ExperienceSection from './sections/ExperienceSection';
import ProjectSection from './sections/ProjectSection';
import SelfEvaluationSection from './sections/SelfEvaluationSection';
import SkillSection from './sections/SkillSection';

interface ResumeEditorProps {
  name: string;
  content: ResumeContent;
  onNameChange: (name: string) => void;
  onContentChange: (content: ResumeContent) => void;
}

export default function ResumeEditor({
  name,
  content,
  onNameChange,
  onContentChange,
}: ResumeEditorProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <FormField label="简历名称" required>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="如：互联网产品-秋招"
        />
      </FormField>

      <BasicSection
        value={content.basic}
        onChange={(basic) => onContentChange({ ...content, basic })}
      />
      <EducationSection
        value={content.educations}
        onChange={(educations) => onContentChange({ ...content, educations })}
      />
      <ExperienceSection
        value={content.experiences}
        onChange={(experiences) => onContentChange({ ...content, experiences })}
      />
      <ProjectSection
        value={content.projects}
        onChange={(projects) => onContentChange({ ...content, projects })}
      />
      <SkillSection
        value={content.skills}
        onChange={(skills) => onContentChange({ ...content, skills })}
      />
      <ActivitySection
        value={content.activities}
        onChange={(activities) => onContentChange({ ...content, activities })}
      />
      <CertificateSection
        value={content.certificates}
        onChange={(certificates) => onContentChange({ ...content, certificates })}
      />
      <SelfEvaluationSection
        value={content.selfEvaluation}
        onChange={(selfEvaluation) => onContentChange({ ...content, selfEvaluation })}
      />
    </div>
  );
}
