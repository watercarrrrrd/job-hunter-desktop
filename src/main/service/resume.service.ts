import { RESUME_TEMPLATES } from '@shared/constants';
import type {
  ApiResult,
  CreateResumeInput,
  Resume,
  ResumeTemplateId,
  UpdateResumeInput,
} from '@shared/types';
import { getDb } from '../db';
import * as resumeRepo from '../db/repositories/resume.repo';
import { fail, runSafely } from './result';

function validateName(name: string): string | null {
  return name.trim() ? null : '简历名称不能为空';
}

function validateTemplate(templateId: ResumeTemplateId): string | null {
  return RESUME_TEMPLATES.includes(templateId) ? null : '非法的简历模板';
}

export function listResumes(): ApiResult<Resume[]> {
  return runSafely(() => resumeRepo.listResumes(getDb()));
}

export function getResume(id: number): ApiResult<Resume | null> {
  return runSafely(() => resumeRepo.getResume(getDb(), id));
}

export function createResume(input: CreateResumeInput): ApiResult<Resume> {
  const error = validateName(input.name) ?? validateTemplate(input.templateId);
  if (error) return fail(error);
  return runSafely(() => resumeRepo.createResume(getDb(), input));
}

export function updateResume(input: UpdateResumeInput): ApiResult<Resume> {
  if (input.name !== undefined) {
    const error = validateName(input.name);
    if (error) return fail(error);
  }
  if (input.templateId !== undefined) {
    const error = validateTemplate(input.templateId);
    if (error) return fail(error);
  }
  return runSafely(() => {
    const updated = resumeRepo.updateResume(getDb(), input);
    if (!updated) throw new Error('简历不存在或已被删除');
    return updated;
  });
}

export function deleteResume(id: number): ApiResult<boolean> {
  return runSafely(() => resumeRepo.deleteResume(getDb(), id));
}
