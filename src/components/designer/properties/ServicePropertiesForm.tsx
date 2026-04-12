import type { ServiceProperties } from "./types";

type ServicePropertiesFormProps = {
  value: ServiceProperties;
  onChange: (next: ServiceProperties) => void;
};

export function ServicePropertiesForm({ value, onChange }: ServicePropertiesFormProps) {
  return (
    <div className="space-y-3 text-xs text-slate-200">
      <label className="block">
        <span className="mb-1 block text-slate-400">Service name</span>
        <input
          value={value.serviceName}
          onChange={(event) => onChange({ ...value, serviceName: event.target.value })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        />
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-slate-400">Methods</span>
          <button
            type="button"
            onClick={() => onChange({ ...value, methods: [...value.methods, { name: "", transactional: false }] })}
            className="rounded border border-slate-700 px-2 py-1 text-[11px]"
          >
            Add method
          </button>
        </div>

        <div className="space-y-2">
          {value.methods.map((method, index) => (
            <div key={`${method.name}-${index}`} className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5">
              <input
                value={method.name}
                placeholder="method"
                onChange={(event) => {
                  const methods = [...value.methods];
                  methods[index] = { ...method, name: event.target.value };
                  onChange({ ...value, methods });
                }}
                className="flex-1 bg-transparent outline-none"
              />
              <label className="flex items-center gap-1 text-[11px] text-slate-400">
                Tx
                <input
                  type="checkbox"
                  checked={method.transactional}
                  onChange={(event) => {
                    const methods = [...value.methods];
                    methods[index] = { ...method, transactional: event.target.checked };
                    onChange({ ...value, methods });
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
