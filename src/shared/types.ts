// 领域类型定义（主进程/渲染进程共享，纯类型，无运行时代码）

/** 简历模板标识 */
export type ResumeTemplateId = 'classic' | 'two-column';

/** 投递状态机 */
export type ApplicationStatus =
  | 'applied'
  | 'written_test'
  | 'interviewing'
  | 'offered'
  | 'rejected'
  | 'withdrawn';

/** 面试结果 */
export type InterviewResult = 'pending' | 'passed' | 'failed';

export interface Resume {
  id: number;
  name: string;
  templateId: ResumeTemplateId;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeContent {
  basic: ResumeBasic;
  educations: Education[];
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  activities: Activity[];
  certificates: Certificate[];
  selfEvaluation: string;
}

export interface ResumeBasic {
  name: string;
  phone: string;
  email: string;
  jobIntention: string;
  summary: string;
}

export interface Education {
  school: string;
  major: string;
  degree: string;
  start: string;
  end: string;
  gpa: string;
  description: string;
}

export interface Experience {
  company: string;
  position: string;
  start: string;
  end: string;
  description: string;
}

export interface Project {
  name: string;
  role: string;
  start: string;
  end: string;
  description: string;
}

export interface Skill {
  name: string;
  level: string;
}

export interface Activity {
  name: string;
  role: string;
  start: string;
  end: string;
  description: string;
}

export interface Certificate {
  name: string;
  date: string;
  description: string;
}

export interface Application {
  id: number;
  company: string;
  position: string;
  appliedDate: string | null;
  channel: string | null;
  resumeId: number | null;
  status: ApplicationStatus;
  jdLink: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  round: string | null;
  type: string | null;
  scheduledAt: string | null;
  location: string | null;
  interviewer: string | null;
  note: string | null;
  result: InterviewResult;
  review: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewChecklist {
  id: number;
  interviewId: number;
  content: string;
  done: boolean;
  sortOrder: number;
}

export interface StatsOverview {
  totalApplications: number;
  pendingApplications: number;
  totalInterviews: number;
  offers: number;
}

/** 业务层统一返回结构 */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };
