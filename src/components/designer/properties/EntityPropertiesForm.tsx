import type { EntityProperties } from "./types";

type EntityPropertiesFormProps = {
  value: EntityProperties;
  onChange: (next: EntityProperties) => void;
};

export function EntityPropertiesForm({ value, onChange }: EntityPropertiesFormProps) {
  return (
    <div className="space-y-3 text-xs text-slate-200">
      <label className="block">
        <span className="mb-1 block text-slate-400">Table name</span>
        <input
          value={value.tableName}
          onChange={(event) => onChange({ ...value, tableName: event.target.value })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        />
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-slate-400">Fields</span>
          <button
            type="button"
            onClick={() => onChange({ ...value, fields: [...value.fields, { name: "", type: "String", constraints: "" }] })}
            className="rounded border border-slate-700 px-2 py-1 text-[11px]"
          >
            Add field
          </button>
        </div>
        <div className="space-y-2">
          {value.fields.map((field, index) => (
            <div key={`${field.name}-${index}`} className="grid grid-cols-3 gap-2">
              <input
                value={field.name}
                onChange={(event) => {
                  const fields = [...value.fields];
                  fields[index] = { ...field, name: event.target.value };
                  onChange({ ...value, fields });
                }}
                placeholder="name"
                className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
              />
              <input
                value={field.type}
                onChange={(event) => {
                  const fields = [...value.fields];
                  fields[index] = { ...field, type: event.target.value };
                  onChange({ ...value, fields });
                }}
                placeholder="type"
                className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
              />
              <input
                value={field.constraints}
                onChange={(event) => {
                  const fields = [...value.fields];
                  fields[index] = { ...field, constraints: event.target.value };
                  onChange({ ...value, fields });
                }}
                placeholder="constraints"
                className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
