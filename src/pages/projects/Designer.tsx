import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { useBuilderSelectors, useBuilderState } from "../../features/builder/store";

type CatalogNode = {
  id: string;
  label: string;
  category: "Database" | "Logic" | "Auth" | "Integration";
  description: string;
  defaults: Record<string, string>;
};

const CATALOG_NODES: CatalogNode[] = [
  {
    id: "postgres",
    label: "PostgreSQL",
    category: "Database",
    description: "Relational persistence with Spring Data JPA.",
    defaults: { dialect: "PostgreSQL", migration: "Flyway", poolSize: "10" },
  },
  {
    id: "redis",
    label: "Redis Cache",
    category: "Database",
    description: "In-memory caching for read-heavy endpoints.",
    defaults: { mode: "Standalone", ttl: "300", prefix: "cache:" },
  },
  {
    id: "workflow",
    label: "Workflow Rule",
    category: "Logic",
    description: "Branch business logic by condition and outcome.",
    defaults: { timeoutMs: "5000", retries: "2", fallback: "none" },
  },
  {
    id: "transform",
    label: "Payload Transform",
    category: "Logic",
    description: "Map payloads between API and domain contracts.",
    defaults: { direction: "request", strictMode: "true", version: "v1" },
  },
  {
    id: "jwt",
    label: "JWT Guard",
    category: "Auth",
    description: "Token validation with role checks.",
    defaults: { issuer: "internal", audience: "api", role: "USER" },
  },
  {
    id: "oauth",
    label: "OAuth2 Client",
    category: "Auth",
    description: "Federated login against identity providers.",
    defaults: { provider: "google", scope: "openid profile", callback: "/oauth/callback" },
  },
  {
    id: "kafka",
    label: "Kafka Producer",
    category: "Integration",
    description: "Publish domain events to external consumers.",
    defaults: { topic: "events.domain", acks: "all", serializer: "json" },
  },
  {
    id: "webhook",
    label: "Webhook Outbound",
    category: "Integration",
    description: "Deliver signed HTTP callbacks to partners.",
    defaults: { method: "POST", retryPolicy: "exponential", timeoutMs: "3000" },
  },
];

const CATEGORIES: Array<CatalogNode["category"]> = ["Database", "Logic", "Auth", "Integration"];

export default function Designer() {
  const { projectId } = useParams();
  const state = useBuilderState();
  const { endpointCount, entityCount } = useBuilderSelectors();
  const [selectedNodeId, setSelectedNodeId] = useState(CATALOG_NODES[0].id);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  const selectedNode = useMemo(
    () => CATALOG_NODES.find((node) => node.id === selectedNodeId) ?? CATALOG_NODES[0],
    [selectedNodeId],
  );

  if (!projectId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1800px] items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setLeftOpen((open) => !open)}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 lg:hidden"
          >
            Catalog
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-400">Projects / {projectId} / Designer</p>
            <h1 className="truncate text-sm font-semibold sm:text-base">
              {state.draft.project.name?.trim() || "Untitled project"}
            </h1>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 sm:flex">
            <span>Nodes: {entityCount}</span>
            <span className="text-slate-600">|</span>
            <span>Connections: {endpointCount}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSaveStatus("saved");
              window.setTimeout(() => setSaveStatus("idle"), 1600);
            }}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
          >
            {saveStatus === "saved" ? "Saved" : "Save"}
          </button>
          <Link
            to={`/projects/${projectId}/review`}
            className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500"
          >
            Generate Code
          </Link>

          <button
            type="button"
            onClick={() => setRightOpen((open) => !open)}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 lg:hidden"
          >
            Properties
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1800px] flex-1 grid-cols-1 gap-0 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside
          className={`${leftOpen ? "block" : "hidden"} border-b border-slate-800 bg-slate-900/70 lg:block lg:border-b-0 lg:border-r`}
        >
          <div className="h-full p-4">
            <h2 className="mb-4 text-sm font-semibold text-slate-200">Component catalog</h2>
            <div className="space-y-5">
              {CATEGORIES.map((category) => (
                <section key={category}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{category}</h3>
                  <div className="space-y-2">
                    {CATALOG_NODES.filter((node) => node.category === category).map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`w-full rounded-lg border p-3 text-left text-xs transition ${
                          selectedNode.id === node.id
                            ? "border-sky-500 bg-sky-500/10 text-sky-100"
                            : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <p className="font-semibold">{node.label}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{node.description}</p>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </aside>

        <section className="relative min-h-[60vh] border-b border-slate-800 lg:border-b-0 lg:border-r">
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "#020617",
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.2) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative h-full min-h-[60vh] overflow-auto p-6">
            <div className="min-h-[900px] min-w-[900px] rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Infinite canvas</p>
              <div className="mt-4 inline-flex items-center rounded-md border border-sky-600/60 bg-sky-500/15 px-3 py-2 text-xs text-sky-100">
                Selected: {selectedNode.label}
              </div>
            </div>
          </div>
        </section>

        <aside
          className={`${rightOpen ? "block" : "hidden"} border-b border-slate-800 bg-slate-900/70 lg:block lg:border-b-0`}
        >
          <div className="h-full p-4">
            <h2 className="text-sm font-semibold text-slate-200">Properties</h2>
            <p className="mt-1 text-xs text-slate-400">Configure settings for the selected node.</p>

            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Node</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{selectedNode.label}</p>
              <p className="mt-1 text-xs text-slate-400">{selectedNode.description}</p>
            </div>

            <div className="mt-3 space-y-3">
              {Object.entries(selectedNode.defaults).map(([key, value]) => (
                <label key={key} className="block text-xs text-slate-300">
                  <span className="mb-1 block capitalize text-slate-400">{key}</span>
                  <input
                    readOnly
                    value={value}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-200"
                  />
                </label>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
