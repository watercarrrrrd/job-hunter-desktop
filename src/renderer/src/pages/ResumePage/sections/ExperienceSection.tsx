import type { Experience } from '@shared/types';
import DatePicker from '../../../components/DatePicker';
import FormField from '../../../components/FormField';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import { emptyExperience } from '../../../lib/resume';
import SectionCard from './SectionCard';

interface ExperienceSectionProps {
  value: Experience[];
  onChange: (value: Experience[]) => void;
}

export default function ExperienceSection({ value, onChange }: ExperienceSectionProps) {
  const add = () => onChange([...value, emptyExperience()]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<Experience>) =>
    onChange(value.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">实习 / 工作经历</h4>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
        >
          添加
        </button>
      </div>
      {value.length === 0 && <p className="text-xs text-gray-400">暂无内容，点击添加</p>}
      {value.map((exp, i) => (
        <SectionCard key={i} title={exp.company || '工作经历'} onRemove={() => remove(i)}>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <FormField label="公司">
                <Input
                  value={exp.company}
                  onChange={(e) => update(i, { company: e.target.value })}
                />
              </FormField>
              <FormField label="职位">
                <Input
                  value={exp.position}
                  onChange={(e) => update(i, { position: e.target.value })}
                />
              </FormField>
              <FormField label="开始时间">
                <DatePicker
                  value={exp.start || null}
                  onChange={(v) => update(i, { start: v ?? '' })}
                />
              </FormField>
              <FormField label="结束时间">
                <DatePicker
                  value={exp.end || null}
                  onChange={(v) => update(i, { end: v ?? '' })}
                />
              </FormField>
            </div>
            <FormField label="工作内容">
              <Textarea
                value={exp.description}
                onChange={(e) => update(i, { description: e.target.value })}
                rows={2}
              />
            </FormField>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
