import type { Skill } from '@shared/types';
import FormField from '../../../components/FormField';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { emptySkill } from '../../../lib/resume';
import SectionCard from './SectionCard';

const LEVEL_OPTIONS = [
  { value: '熟练', label: '熟练' },
  { value: '掌握', label: '掌握' },
  { value: '了解', label: '了解' },
];

interface SkillSectionProps {
  value: Skill[];
  onChange: (value: Skill[]) => void;
}

export default function SkillSection({ value, onChange }: SkillSectionProps) {
  const add = () => onChange([...value, emptySkill()]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<Skill>) =>
    onChange(value.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">技能</h4>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
        >
          添加
        </button>
      </div>
      {value.length === 0 && <p className="text-xs text-gray-400">暂无内容，点击添加</p>}
      {value.map((skill, i) => (
        <SectionCard key={i} title={skill.name || '技能'} onRemove={() => remove(i)}>
          <div className="grid grid-cols-2 gap-2">
            <FormField label="技能名称">
              <Input value={skill.name} onChange={(e) => update(i, { name: e.target.value })} />
            </FormField>
            <FormField label="掌握程度">
              <Select
                options={LEVEL_OPTIONS}
                value={skill.level}
                onChange={(e) => update(i, { level: e.target.value })}
                placeholder="请选择"
              />
            </FormField>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
