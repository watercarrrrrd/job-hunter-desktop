import type { Activity } from '@shared/types';
import DatePicker from '../../../components/DatePicker';
import FormField from '../../../components/FormField';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import { emptyActivity } from '../../../lib/resume';
import SectionCard from './SectionCard';

interface ActivitySectionProps {
  value: Activity[];
  onChange: (value: Activity[]) => void;
}

export default function ActivitySection({ value, onChange }: ActivitySectionProps) {
  const add = () => onChange([...value, emptyActivity()]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<Activity>) =>
    onChange(value.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">校园活动</h4>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
        >
          添加
        </button>
      </div>
      {value.length === 0 && <p className="text-xs text-gray-400">暂无内容，点击添加</p>}
      {value.map((act, i) => (
        <SectionCard key={i} title={act.name || '校园活动'} onRemove={() => remove(i)}>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <FormField label="活动名称">
                <Input value={act.name} onChange={(e) => update(i, { name: e.target.value })} />
              </FormField>
              <FormField label="担任角色">
                <Input value={act.role} onChange={(e) => update(i, { role: e.target.value })} />
              </FormField>
              <FormField label="开始时间">
                <DatePicker
                  value={act.start || null}
                  onChange={(v) => update(i, { start: v ?? '' })}
                />
              </FormField>
              <FormField label="结束时间">
                <DatePicker
                  value={act.end || null}
                  onChange={(v) => update(i, { end: v ?? '' })}
                />
              </FormField>
            </div>
            <FormField label="活动描述">
              <Textarea
                value={act.description}
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
