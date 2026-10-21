import { APPLICATION_STATUSES } from '@shared/constants';
import type {
  ApiResult,
  Application,
  ApplicationStatus,
  CreateApplicationInput,
  UpdateApplicationInput,
} from '@shared/types';
import { getDb } from '../db';
import * as applicationRepo from '../db/repositories/application.repo';
import { fail, runSafely } from './result';

function isValidStatus(status: ApplicationStatus): boolean {
  return APPLICATION_STATUSES.includes(status);
}

export function listApplications(): ApiResult<Application[]> {
  return runSafely(() => applicationRepo.listApplications(getDb()));
}

export function getApplication(id: number): ApiResult<Application | null> {
  return runSafely(() => applicationRepo.getApplication(getDb(), id));
}

export function createApplication(input: CreateApplicationInput): ApiResult<Application> {
  if (!input.company.trim()) return fail('公司名称不能为空');
  if (!input.position.trim()) return fail('岗位名称不能为空');
  if (input.status !== undefined && !isValidStatus(input.status)) {
    return fail('非法的投递状态');
  }
  return runSafely(() => applicationRepo.createApplication(getDb(), input));
}

export function updateApplication(input: UpdateApplicationInput): ApiResult<Application> {
  if (input.company !== undefined && !input.company.trim()) return fail('公司名称不能为空');
  if (input.position !== undefined && !input.position.trim()) return fail('岗位名称不能为空');
  if (input.status !== undefined && !isValidStatus(input.status)) {
    return fail('非法的投递状态');
  }
  return runSafely(() => {
    const updated = applicationRepo.updateApplication(getDb(), input);
    if (!updated) throw new Error('投递记录不存在或已被删除');
    return updated;
  });
}

export function updateApplicationStatus(
  id: number,
  status: ApplicationStatus,
): ApiResult<Application> {
  if (!isValidStatus(status)) return fail('非法的投递状态');
  return runSafely(() => {
    const updated = applicationRepo.updateApplicationStatus(getDb(), id, status);
    if (!updated) throw new Error('投递记录不存在或已被删除');
    return updated;
  });
}

export function deleteApplication(id: number): ApiResult<boolean> {
  return runSafely(() => applicationRepo.deleteApplication(getDb(), id));
}
