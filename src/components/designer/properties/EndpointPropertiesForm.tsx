import type { EndpointProperties } from "./types";

type EndpointPropertiesFormProps = {
  value: EndpointProperties;
  onChange: (next: EndpointProperties) => void;
};

export function EndpointPropertiesForm({ value, onChange }: EndpointPropertiesFormProps) {
  return (
    <div className="space-y-3 text-xs text-slate-200">
      <label className="block">
        <span className="mb-1 block text-slate-400">Path</span>
        <input
          value={value.path}
          onChange={(event) => onChange({ ...value, path: event.target.value })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-slate-400">HTTP method</span>
        <select
          value={value.httpMethod}
          onChange={(event) =>
            onChange({ ...value, httpMethod: event.target.value as EndpointProperties["httpMethod"] })
          }
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        >
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
        <span>Auth required</span>
        <input
          type="checkbox"
          checked={value.authRequired}
          onChange={(event) => onChange({ ...value, authRequired: event.target.checked })}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-slate-400">Request mapping</span>
        <input
          value={value.requestMapping}
          onChange={(event) => onChange({ ...value, requestMapping: event.target.value })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-slate-400">Response mapping</span>
        <input
          value={value.responseMapping}
          onChange={(event) => onChange({ ...value, responseMapping: event.target.value })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        />
      </label>
    </div>
  );
}
