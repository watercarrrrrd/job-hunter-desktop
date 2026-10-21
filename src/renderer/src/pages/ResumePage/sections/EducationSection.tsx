import type { Education } from '@shared/types';
import DatePicker from '../../../components/DatePicker';
import FormField from '../../../components/FormField';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Textarea from '../../../components/Textarea';
import { emptyEducation } from '../../../lib/resume';
import SectionCard from './SectionCard';

const DEGREE_OPTIONS = [
  { value: '大专', label: '大专' },
  { value: '本科', label: '本科' },
  { value: '硕士', label: '硕士' },
  { value: '博士', label: '博士' },
];

interface EducationSectionProps {
  value: Education[];
  onChange: (value: Education[]) => void;
}

export default function EducationSection({ value, onChange }: EducationSectionProps) {
  const add = () => onChange([...value, emptyEducation()]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<Education>) =>
    onChange(value.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">教育经历</h4>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
        >
          添加
        </button>
      </div>
      {value.length === 0 && <p className="text-xs text-gray-400">暂无内容，点击添加</p>}
      {value.map((edu, i) => (
        <SectionCard key={i} title={edu.school || '教育经历'} onRemove={() => remove(i)}>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <FormField label="学校">
                <Input value={edu.school} onChange={(e) => update(i, { school: e.target.value })} />
              </FormField>
              <FormField label="专业">
                <Input value={edu.major} onChange={(e) => update(i, { major: e.target.value })} />
              </FormField>
              <FormField label="学历">
                <Select
                  options={DEGREE_OPTIONS}
                  value={edu.degree}
                  onChange={(e) => update(i, { degree: e.target.value })}
                  placeholder="请选择"
                />
              </FormField>
              <FormField label="GPA">
                <Input value={edu.gpa} onChange={(e) => update(i, { gpa: e.target.value })} />
              </FormField>
              <FormField label="开始时间">
                <DatePicker
                  value={edu.start || null}
                  onChange={(v) => update(i, { start: v ?? '' })}
                />
              </FormField>
              <FormField label="结束时间">
                <DatePicker
                  value={edu.end || null}
                  onChange={(v) => update(i, { end: v ?? '' })}
                />
              </FormField>
            </div>
            <FormField label="在校经历描述">
              <Textarea
                value={edu.description}
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
