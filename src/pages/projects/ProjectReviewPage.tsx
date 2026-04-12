import { Link, Navigate, useParams } from "react-router";

export default function ProjectReviewPage() {
  const { projectId } = useParams();

  if (!projectId) {
    return <Navigate to="/" replace />;
  }

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
          <p className="text-sm text-slate-700">
            This page is a scaffold for validation, summary diffs, and export options.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/projects/${projectId}/designer`}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Back to designer
            </Link>
            <button
              type="button"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Generate export
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
