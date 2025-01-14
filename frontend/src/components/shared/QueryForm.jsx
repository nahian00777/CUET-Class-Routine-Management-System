import React from 'react';
import DepartmentSelect from './DepartmentSelect';
import LevelSelect from './LevelSelect';
import TermSelect from './TermSelect';

export default function QueryForm({ query, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <DepartmentSelect
        value={query.department}
        onChange={(department) => onChange({ ...query, department })}
      />
      <LevelSelect
        value={query.level}
        onChange={(level) => onChange({ ...query, level })}
      />
      <TermSelect
        value={query.term}
        onChange={(term) => onChange({ ...query, term })}
      />
    </div>
  );
}