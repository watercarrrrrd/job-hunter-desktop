import { useEffect, useState } from 'react';
import {
  INTERVIEW_RESULT_LABELS,
  INTERVIEW_RESULTS,
} from '@shared/constants';
import type { Interview, InterviewResult } from '@shared/types';
import FormField from '../../components/FormField';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';

interface ReviewSectionProps {
  interview: Interview;
  saving: boolean;
  onSave: (result: InterviewResult, review: string) => void;
}

const RESULT_OPTIONS = INTERVIEW_RESULTS.map((r) => ({
  value: r,
  label: INTERVIEW_RESULT_LABELS[r],
}));

/** 面试复盘：记录结果与复盘内容，保存时回写关联投递状态 */
export default function ReviewSection({ interview, saving, onSave }: ReviewSectionProps) {
  const [result, setResult] = useState<InterviewResult>(interview.result);
  const [review, setReview] = useState(interview.review ?? '');

  useEffect(() => {
    setResult(interview.result);
    setReview(interview.review ?? '');
  }, [interview]);

  return (
    <div className="space-y-3">
      <FormField label="面试结果">
        <Select
          value={result}
          onChange={(e) => setResult(e.target.value as InterviewResult)}
          options={RESULT_OPTIONS}
        />
      </FormField>
      <FormField label="复盘记录" hint="记录面试问题、个人表现与改进点">
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="面试问题 / 个人表现 / 改进点"
        />
      </FormField>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSave(result, review)}
          disabled={saving}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {saving ? '保存中…' : '保存复盘'}
        </button>
      </div>
    </div>
  );
}
