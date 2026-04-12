import type { DatabaseProperties } from "./types";

type DatabasePropertiesFormProps = {
  value: DatabaseProperties;
  onChange: (next: DatabaseProperties) => void;
};

export function DatabasePropertiesForm({ value, onChange }: DatabasePropertiesFormProps) {
  return (
    <div className="space-y-3 text-xs text-slate-200">
      {[
        ["Engine", "engine"],
        ["Host", "host"],
        ["Port", "port"],
        ["DB name", "dbName"],
        ["Username", "username"],
      ].map(([label, key]) => (
        <label key={key} className="block">
          <span className="mb-1 block text-slate-400">{label}</span>
          <input
            value={value[key as keyof DatabaseProperties] as string}
            onChange={(event) => onChange({ ...value, [key]: event.target.value })}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
          />
        </label>
      ))}

      <label className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
        <span>SSL enabled</span>
        <input
          type="checkbox"
          checked={value.sslEnabled}
          onChange={(event) => onChange({ ...value, sslEnabled: event.target.checked })}
        />
      </label>
    </div>
  );
}
