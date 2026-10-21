import type { InputHTMLAttributes } from 'react';
import Input from './Input';

interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function DatePicker({ value, onChange, ...props }: DatePickerProps) {
  return (
    <Input
      type="date"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value ? e.target.value : null)}
      {...props}
    />
  );
}
