import type {
  ApplicationStatus,
  InterviewResult,
  ResumeTemplateId,
} from './types';

/** 投递状态全集与中文文案 */
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'applied',
  'written_test',
  'interviewing',
  'offered',
  'rejected',
  'withdrawn',
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: '已投递',
  written_test: '笔试中',
  interviewing: '面试中',
  offered: '已录用',
  rejected: '已拒绝',
  withdrawn: '已放弃',
};

/** 面试结果全集与中文文案 */
export const INTERVIEW_RESULTS: InterviewResult[] = ['pending', 'passed', 'failed'];

export const INTERVIEW_RESULT_LABELS: Record<InterviewResult, string> = {
  pending: '待定',
  passed: '通过',
  failed: '未通过',
};

/** 简历模板全集与中文文案 */
export const RESUME_TEMPLATES: ResumeTemplateId[] = ['classic', 'two-column'];

export const RESUME_TEMPLATE_LABELS: Record<ResumeTemplateId, string> = {
  classic: '单栏经典',
  'two-column': '双栏简约',
};

/** 供 UI 下拉选择的选项（自由文本，仅提供建议值） */
export const APPLICATION_CHANNELS = ['官网', '招聘平台', '内推', '其他'] as const;
export const INTERVIEW_ROUNDS = ['一面', '二面', '三面', 'HR面', '终面'] as const;
export const INTERVIEW_TYPES = ['线上', '线下', '电话'] as const;

/** 状态标签配色基调 */
export type TagTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export const APPLICATION_STATUS_TONES: Record<ApplicationStatus, TagTone> = {
  applied: 'info',
  written_test: 'warning',
  interviewing: 'warning',
  offered: 'success',
  rejected: 'danger',
  withdrawn: 'neutral',
};

export const INTERVIEW_RESULT_TONES: Record<InterviewResult, TagTone> = {
  pending: 'warning',
  passed: 'success',
  failed: 'danger',
};
