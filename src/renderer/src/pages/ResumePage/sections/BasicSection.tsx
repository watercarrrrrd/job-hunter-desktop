import type { ResumeBasic } from '@shared/types';
import FormField from '../../../components/FormField';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';

interface BasicSectionProps {
  value: ResumeBasic;
  onChange: (value: ResumeBasic) => void;
}

export default function BasicSection({ value, onChange }: BasicSectionProps) {
  const set = (patch: Partial<ResumeBasic>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="姓名">
          <Input
            value={value.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="张三"
          />
        </FormField>
        <FormField label="电话">
          <Input value={value.phone} onChange={(e) => set({ phone: e.target.value })} />
        </FormField>
        <FormField label="邮箱">
          <Input value={value.email} onChange={(e) => set({ email: e.target.value })} />
        </FormField>
        <FormField label="求职意向">
          <Input
            value={value.jobIntention}
            onChange={(e) => set({ jobIntention: e.target.value })}
          />
        </FormField>
      </div>
      <FormField label="个人简介">
        <Textarea
          value={value.summary}
          onChange={(e) => set({ summary: e.target.value })}
          rows={3}
        />
      </FormField>
    </div>
  );
}
