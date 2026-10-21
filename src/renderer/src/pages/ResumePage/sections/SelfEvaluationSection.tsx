import FormField from '../../../components/FormField';
import Textarea from '../../../components/Textarea';

interface SelfEvaluationSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SelfEvaluationSection({ value, onChange }: SelfEvaluationSectionProps) {
  return (
    <FormField label="自我评价">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="简要概括个人优势、职业目标等"
      />
    </FormField>
  );
}
