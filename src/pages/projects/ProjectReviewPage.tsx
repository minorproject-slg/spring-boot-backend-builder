import { Link, Navigate, useParams } from "react-router";
import { useBuilderSelectors } from "../../features/builder/store";

export default function ProjectReviewPage() {
  const { projectId } = useParams();
  const { entityCount, endpointCount, readinessStatus, validationWarnings } = useBuilderSelectors();

  if (!projectId) {
    return <Navigate to="/" replace />;
  }

  const canGenerate = readinessStatus === "ready";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm font-medium text-sky-700">Review</p>
          <h1 className="text-3xl font-bold tracking-tight">Review configuration for {projectId}</h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Finalize metadata, domain model, and API/security definitions before generating your project export.
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-2 rounded-lg bg-slate-50 p-4 sm:grid-cols-3">
            <p className="text-sm text-slate-700">Entities: <span className="font-semibold">{entityCount}</span></p>
            <p className="text-sm text-slate-700">Endpoints: <span className="font-semibold">{endpointCount}</span></p>
            <p className="text-sm text-slate-700">Status: <span className="font-semibold">{readinessStatus}</span></p>
          </div>

          {validationWarnings.length > 0 && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h2 className="font-semibold text-amber-900">Validation warnings</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800">
                {validationWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/projects/${projectId}/designer`}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Back to designer
            </Link>
            <button
              type="button"
              disabled={!canGenerate}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Generate export
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
