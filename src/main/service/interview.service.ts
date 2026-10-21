import { INTERVIEW_RESULTS } from '@shared/constants';
import type {
  ApiResult,
  ApplicationStatus,
  CreateChecklistInput,
  CreateInterviewInput,
  Interview,
  InterviewChecklist,
  InterviewResult,
  UpdateChecklistInput,
  UpdateInterviewInput,
} from '@shared/types';
import { getDb } from '../db';
import * as applicationRepo from '../db/repositories/application.repo';
import * as interviewRepo from '../db/repositories/interview.repo';
import { fail, runSafely } from './result';

function isValidResult(result: InterviewResult): boolean {
  return INTERVIEW_RESULTS.includes(result);
}

/** 面试结果回写投递状态：通过→面试中（推进下一轮），未通过→已拒绝，待定→不变 */
function mapResultToStatus(result: InterviewResult): ApplicationStatus | null {
  if (result === 'passed') return 'interviewing';
  if (result === 'failed') return 'rejected';
  return null;
}

export function listInterviews(): ApiResult<Interview[]> {
  return runSafely(() => interviewRepo.listInterviews(getDb()));
}

export function getInterview(id: number): ApiResult<Interview | null> {
  return runSafely(() => interviewRepo.getInterview(getDb(), id));
}

export function createInterview(input: CreateInterviewInput): ApiResult<Interview> {
  if (input.result !== undefined && !isValidResult(input.result)) {
    return fail('非法的面试结果');
  }
  return runSafely(() => {
    const db = getDb();
    if (!applicationRepo.getApplication(db, input.applicationId)) {
      throw new Error('关联的投递记录不存在');
    }
    return interviewRepo.createInterview(db, input);
  });
}

export function updateInterview(input: UpdateInterviewInput): ApiResult<Interview> {
  return runSafely(() => {
    const updated = interviewRepo.updateInterview(getDb(), input);
    if (!updated) throw new Error('面试记录不存在或已被删除');
    return updated;
  });
}

/** 更新面试结果并在同一事务内回写关联投递的状态 */
export function updateInterviewResult(
  id: number,
  result: InterviewResult,
  review?: string | null,
): ApiResult<Interview> {
  if (!isValidResult(result)) return fail('非法的面试结果');
  return runSafely(() => {
    const db = getDb();
    const existing = interviewRepo.getInterview(db, id);
    if (!existing) throw new Error('面试记录不存在或已被删除');

    const targetStatus = mapResultToStatus(result);
    const tx = db.transaction(() => {
      interviewRepo.updateInterviewResult(db, id, result, review);
      if (targetStatus) {
        applicationRepo.updateApplicationStatus(db, existing.applicationId, targetStatus);
      }
    });
    tx();

    return interviewRepo.getInterview(db, id) as Interview;
  });
}

export function deleteInterview(id: number): ApiResult<boolean> {
  return runSafely(() => interviewRepo.deleteInterview(getDb(), id));
}

export function listChecklist(interviewId: number): ApiResult<InterviewChecklist[]> {
  return runSafely(() => interviewRepo.listChecklist(getDb(), interviewId));
}

export function createChecklist(input: CreateChecklistInput): ApiResult<InterviewChecklist> {
  if (!input.content.trim()) return fail('准备事项内容不能为空');
  return runSafely(() => {
    const db = getDb();
    if (!interviewRepo.getInterview(db, input.interviewId)) {
      throw new Error('关联的面试记录不存在');
    }
    return interviewRepo.createChecklist(db, input);
  });
}

export function updateChecklist(input: UpdateChecklistInput): ApiResult<InterviewChecklist> {
  if (input.content !== undefined && !input.content.trim()) {
    return fail('准备事项内容不能为空');
  }
  return runSafely(() => {
    const updated = interviewRepo.updateChecklist(getDb(), input);
    if (!updated) throw new Error('准备事项不存在或已被删除');
    return updated;
  });
}

export function deleteChecklist(id: number): ApiResult<boolean> {
  return runSafely(() => interviewRepo.deleteChecklist(getDb(), id));
}
