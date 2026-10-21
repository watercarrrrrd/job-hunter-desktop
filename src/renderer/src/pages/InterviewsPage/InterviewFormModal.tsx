import { useEffect, useState } from 'react';
import { INTERVIEW_ROUNDS, INTERVIEW_TYPES } from '@shared/constants';
import type { Application, CreateInterviewInput, Interview } from '@shared/types';
import Button from '../../components/Button';
import DatePicker from '../../components/DatePicker';
import FormField from '../../components/FormField';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import { combineDateTime, splitDateTime } from '../../lib/interviews';

interface InterviewFormModalProps {
  open: boolean;
  editing: Interview | null;
  applications: Application[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (input: CreateInterviewInput, id: number | null) => void;
}

interface FormState {
  applicationId: string;
  round: string;
  type: string;
  date: string;
  time: string;
  location: string;
  interviewer: string;
  note: string;
}

const ROUND_OPTIONS = INTERVIEW_ROUNDS.map((r) => ({ value: r, label: r }));
const TYPE_OPTIONS = INTERVIEW_TYPES.map((t) => ({ value: t, label: t }));

function emptyForm(): FormState {
  return {
    applicationId: '',
    round: '',
    type: '',
    date: '',
    time: '',
    location: '',
    interviewer: '',
    note: '',
  };
}

function toForm(app: Interview): FormState {
  const { date, time } = splitDateTime(app.scheduledAt);
  return {
    applicationId: String(app.applicationId),
    round: app.round ?? '',
    type: app.type ?? '',
    date,
    time,
    location: app.location ?? '',
    interviewer: app.interviewer ?? '',
    note: app.note ?? '',
  };
}

export default function InterviewFormModal({
  open,
  editing,
  applications,
  saving,
  onClose,
  onSubmit,
}: InterviewFormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm());

  useEffect(() => {
    if (open) {
      setForm(editing ? toForm(editing) : emptyForm());
    }
  }, [open, editing]);

  const valid = form.applicationId !== '';

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = () => {
    if (!valid || saving) return;
    const input: CreateInterviewInput = {
      applicationId: Number(form.applicationId),
      round: form.round || null,
      type: form.type || null,
      scheduledAt: combineDateTime(form.date, form.time),
      location: form.location || null,
      interviewer: form.interviewer || null,
      note: form.note || null,
    };
    onSubmit(input, editing?.id ?? null);
  };

  return (
    <Modal
      open={open}
      title={editing ? '编辑面试' : '新建面试'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!valid || saving} loading={saving}>
            {saving ? '保存中…' : '保存'}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <FormField label="关联投递" required>
          <Select
            options={applications.map((a) => ({
              value: String(a.id),
              label: `${a.company} - ${a.position}`,
            }))}
            value={form.applicationId}
            onChange={(e) => set({ applicationId: e.target.value })}
            placeholder="请选择投递记录"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="面试轮次">
            <Select
              options={ROUND_OPTIONS}
              value={form.round}
              onChange={(e) => set({ round: e.target.value })}
              placeholder="请选择"
            />
          </FormField>
          <FormField label="面试形式">
            <Select
              options={TYPE_OPTIONS}
              value={form.type}
              onChange={(e) => set({ type: e.target.value })}
              placeholder="请选择"
            />
          </FormField>
          <FormField label="面试日期">
            <DatePicker
              value={form.date || null}
              onChange={(v) => set({ date: v ?? '' })}
            />
          </FormField>
          <FormField label="面试时间">
            <Input
              type="time"
              value={form.time}
              onChange={(e) => set({ time: e.target.value })}
            />
          </FormField>
        </div>
        <FormField label="地点 / 会议链接">
          <Input
            value={form.location}
            onChange={(e) => set({ location: e.target.value })}
            placeholder="线下地址或线上会议链接"
          />
        </FormField>
        <FormField label="面试官">
          <Input
            value={form.interviewer}
            onChange={(e) => set({ interviewer: e.target.value })}
          />
        </FormField>
        <FormField label="备注">
          <Textarea value={form.note} onChange={(e) => set({ note: e.target.value })} rows={3} />
        </FormField>
      </div>
    </Modal>
  );
}
