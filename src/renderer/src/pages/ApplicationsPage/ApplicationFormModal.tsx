import { useEffect, useState } from 'react';
import {
  APPLICATION_CHANNELS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUSES,
} from '@shared/constants';
import type {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
  Resume,
} from '@shared/types';
import DatePicker from '../../components/DatePicker';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';

interface ApplicationFormModalProps {
  open: boolean;
  editing: Application | null;
  resumes: Resume[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (input: CreateApplicationInput, id: number | null) => void;
}

interface FormState {
  company: string;
  position: string;
  appliedDate: string;
  channel: string;
  resumeId: string;
  status: ApplicationStatus;
  jdLink: string;
  note: string;
}

const STATUS_OPTIONS = APPLICATION_STATUSES.map((s) => ({
  value: s,
  label: APPLICATION_STATUS_LABELS[s],
}));
const CHANNEL_OPTIONS = APPLICATION_CHANNELS.map((c) => ({ value: c, label: c }));

function emptyForm(): FormState {
  return {
    company: '',
    position: '',
    appliedDate: '',
    channel: '',
    resumeId: '',
    status: 'applied',
    jdLink: '',
    note: '',
  };
}

function toForm(app: Application): FormState {
  return {
    company: app.company,
    position: app.position,
    appliedDate: app.appliedDate ?? '',
    channel: app.channel ?? '',
    resumeId: app.resumeId !== null ? String(app.resumeId) : '',
    status: app.status,
    jdLink: app.jdLink ?? '',
    note: app.note ?? '',
  };
}

export default function ApplicationFormModal({
  open,
  editing,
  resumes,
  saving,
  onClose,
  onSubmit,
}: ApplicationFormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm());

  // 弹窗打开时按编辑/新建回填或重置表单
  useEffect(() => {
    if (open) {
      setForm(editing ? toForm(editing) : emptyForm());
    }
  }, [open, editing]);

  const valid = form.company.trim() !== '' && form.position.trim() !== '';

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = () => {
    if (!valid || saving) return;
    const input: CreateApplicationInput = {
      company: form.company.trim(),
      position: form.position.trim(),
      appliedDate: form.appliedDate || null,
      channel: form.channel || null,
      resumeId: form.resumeId ? Number(form.resumeId) : null,
      status: form.status,
      jdLink: form.jdLink || null,
      note: form.note || null,
    };
    onSubmit(input, editing?.id ?? null);
  };

  return (
    <Modal
      open={open}
      title={editing ? '编辑投递' : '新建投递'}
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
        <div className="grid grid-cols-2 gap-3">
          <FormField label="公司名称" required>
            <Input value={form.company} onChange={(e) => set({ company: e.target.value })} />
          </FormField>
          <FormField label="岗位名称" required>
            <Input value={form.position} onChange={(e) => set({ position: e.target.value })} />
          </FormField>
          <FormField label="投递日期">
            <DatePicker
              value={form.appliedDate || null}
              onChange={(v) => set({ appliedDate: v ?? '' })}
            />
          </FormField>
          <FormField label="投递渠道">
            <Select
              options={CHANNEL_OPTIONS}
              value={form.channel}
              onChange={(e) => set({ channel: e.target.value })}
              placeholder="请选择"
            />
          </FormField>
          <FormField label="关联简历">
            <Select
              options={resumes.map((r) => ({ value: String(r.id), label: r.name }))}
              value={form.resumeId}
              onChange={(e) => set({ resumeId: e.target.value })}
              placeholder="不关联"
            />
          </FormField>
          <FormField label="当前状态">
            <Select
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(e) => set({ status: e.target.value as ApplicationStatus })}
            />
          </FormField>
        </div>
        <FormField label="JD 链接">
          <Input
            value={form.jdLink}
            onChange={(e) => set({ jdLink: e.target.value })}
            placeholder="https://"
          />
        </FormField>
        <FormField label="备注">
          <Textarea value={form.note} onChange={(e) => set({ note: e.target.value })} rows={3} />
        </FormField>
      </div>
    </Modal>
  );
}
