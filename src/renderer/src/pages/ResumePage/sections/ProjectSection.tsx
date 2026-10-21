import type { Project } from '@shared/types';
import DatePicker from '../../../components/DatePicker';
import FormField from '../../../components/FormField';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import { emptyProject } from '../../../lib/resume';
import SectionCard from './SectionCard';

interface ProjectSectionProps {
  value: Project[];
  onChange: (value: Project[]) => void;
}

export default function ProjectSection({ value, onChange }: ProjectSectionProps) {
  const add = () => onChange([...value, emptyProject()]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<Project>) =>
    onChange(value.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">项目经历</h4>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
        >
          添加
        </button>
      </div>
      {value.length === 0 && <p className="text-xs text-gray-400">暂无内容，点击添加</p>}
      {value.map((proj, i) => (
        <SectionCard key={i} title={proj.name || '项目经历'} onRemove={() => remove(i)}>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <FormField label="项目名称">
                <Input
                  value={proj.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                />
              </FormField>
              <FormField label="担任角色">
                <Input value={proj.role} onChange={(e) => update(i, { role: e.target.value })} />
              </FormField>
              <FormField label="开始时间">
                <DatePicker
                  value={proj.start || null}
                  onChange={(v) => update(i, { start: v ?? '' })}
                />
              </FormField>
              <FormField label="结束时间">
                <DatePicker
                  value={proj.end || null}
                  onChange={(v) => update(i, { end: v ?? '' })}
                />
              </FormField>
            </div>
            <FormField label="项目描述">
              <Textarea
                value={proj.description}
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
