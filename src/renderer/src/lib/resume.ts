import type {
  Activity,
  Certificate,
  Education,
  Experience,
  Project,
  ResumeBasic,
  ResumeContent,
  ResumeTemplateId,
  Skill,
} from '@shared/types';

/** 新建简历默认使用的模板 */
export const DEFAULT_TEMPLATE: ResumeTemplateId = 'classic';

export function emptyBasic(): ResumeBasic {
  return { name: '', phone: '', email: '', jobIntention: '', summary: '' };
}

export function emptyEducation(): Education {
  return { school: '', major: '', degree: '', start: '', end: '', gpa: '', description: '' };
}

export function emptyExperience(): Experience {
  return { company: '', position: '', start: '', end: '', description: '' };
}

export function emptyProject(): Project {
  return { name: '', role: '', start: '', end: '', description: '' };
}

export function emptySkill(): Skill {
  return { name: '', level: '' };
}

export function emptyActivity(): Activity {
  return { name: '', role: '', start: '', end: '', description: '' };
}

export function emptyCertificate(): Certificate {
  return { name: '', date: '', description: '' };
}

/** 生成一份字段全空的简历内容（所有字段可留空，符合 PRD 约束） */
export function emptyResumeContent(): ResumeContent {
  return {
    basic: emptyBasic(),
    educations: [],
    experiences: [],
    projects: [],
    skills: [],
    activities: [],
    certificates: [],
    selfEvaluation: '',
  };
}
