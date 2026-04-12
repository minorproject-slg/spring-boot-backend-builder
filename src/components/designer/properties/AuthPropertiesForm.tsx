import type { AuthProperties } from "./types";

type AuthPropertiesFormProps = {
  value: AuthProperties;
  onChange: (next: AuthProperties) => void;
};

export function AuthPropertiesForm({ value, onChange }: AuthPropertiesFormProps) {
  return (
    <div className="space-y-3 text-xs text-slate-200">
      <label className="block">
        <span className="mb-1 block text-slate-400">Provider</span>
        <select
          value={value.provider}
          onChange={(event) => onChange({ ...value, provider: event.target.value as AuthProperties["provider"] })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        >
          <option value="jwt">JWT</option>
          <option value="oauth2">OAuth2</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-slate-400">Issuer</span>
        <input
          value={value.issuer}
          onChange={(event) => onChange({ ...value, issuer: event.target.value })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-slate-400">Audience</span>
        <input
          value={value.audience}
          onChange={(event) => onChange({ ...value, audience: event.target.value })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-slate-400">JWKS URL</span>
        <input
          value={value.jwksUrl}
          onChange={(event) => onChange({ ...value, jwksUrl: event.target.value })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        />
      </label>

      {value.provider === "oauth2" && (
        <>
          <label className="block">
            <span className="mb-1 block text-slate-400">Client ID</span>
            <input
              value={value.clientId}
              onChange={(event) => onChange({ ...value, clientId: event.target.value })}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-slate-400">Client secret</span>
            <input
              type="password"
              value={value.clientSecret}
              onChange={(event) => onChange({ ...value, clientSecret: event.target.value })}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-slate-400">Token URL</span>
            <input
              value={value.tokenUrl}
              onChange={(event) => onChange({ ...value, tokenUrl: event.target.value })}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
            />
          </label>
        </>
      )}

      <label className="block">
        <span className="mb-1 block text-slate-400">Scopes</span>
        <input
          value={value.scopes}
          onChange={(event) => onChange({ ...value, scopes: event.target.value })}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5"
        />
      </label>
    </div>
  );
}
