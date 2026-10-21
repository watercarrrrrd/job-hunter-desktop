import {
  APPLICATION_CHANNELS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUSES,
} from '@shared/constants';
import type { ApplicationStatus } from '@shared/types';
import Input from '../../components/Input';
import Select from '../../components/Select';
import type { ApplicationFilter } from '../../lib/applications';

interface FilterBarProps {
  filter: ApplicationFilter;
  onChange: (filter: ApplicationFilter) => void;
}

const STATUS_OPTIONS = APPLICATION_STATUSES.map((s) => ({
  value: s,
  label: APPLICATION_STATUS_LABELS[s],
}));
const CHANNEL_OPTIONS = APPLICATION_CHANNELS.map((c) => ({ value: c, label: c }));
const SORT_OPTIONS = [
  { value: 'date-desc', label: '投递日期降序' },
  { value: 'date-asc', label: '投递日期升序' },
];

export default function FilterBar({ filter, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        className="w-56"
        placeholder="搜索公司 / 岗位"
        value={filter.search}
        onChange={(e) => onChange({ ...filter, search: e.target.value })}
      />
      <Select
        className="w-32"
        value={filter.status}
        onChange={(e) =>
          onChange({ ...filter, status: e.target.value as ApplicationStatus | '' })
        }
        options={STATUS_OPTIONS}
        placeholder="全部状态"
      />
      <Select
        className="w-32"
        value={filter.channel}
        onChange={(e) => onChange({ ...filter, channel: e.target.value })}
        options={CHANNEL_OPTIONS}
        placeholder="全部渠道"
      />
      <Select
        className="w-40"
        value={filter.sort}
        onChange={(e) =>
          onChange({ ...filter, sort: e.target.value as ApplicationFilter['sort'] })
        }
        options={SORT_OPTIONS}
      />
    </div>
  );
}
