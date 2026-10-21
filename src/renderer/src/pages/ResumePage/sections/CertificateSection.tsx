import type { Certificate } from '@shared/types';
import DatePicker from '../../../components/DatePicker';
import FormField from '../../../components/FormField';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import { emptyCertificate } from '../../../lib/resume';
import SectionCard from './SectionCard';

interface CertificateSectionProps {
  value: Certificate[];
  onChange: (value: Certificate[]) => void;
}

export default function CertificateSection({ value, onChange }: CertificateSectionProps) {
  const add = () => onChange([...value, emptyCertificate()]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<Certificate>) =>
    onChange(value.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">证书奖项</h4>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
        >
          添加
        </button>
      </div>
      {value.length === 0 && <p className="text-xs text-gray-400">暂无内容，点击添加</p>}
      {value.map((cert, i) => (
        <SectionCard key={i} title={cert.name || '证书奖项'} onRemove={() => remove(i)}>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <FormField label="证书 / 奖项名称">
                <Input value={cert.name} onChange={(e) => update(i, { name: e.target.value })} />
              </FormField>
              <FormField label="获得时间">
                <DatePicker
                  value={cert.date || null}
                  onChange={(v) => update(i, { date: v ?? '' })}
                />
              </FormField>
            </div>
            <FormField label="说明">
              <Textarea
                value={cert.description}
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
