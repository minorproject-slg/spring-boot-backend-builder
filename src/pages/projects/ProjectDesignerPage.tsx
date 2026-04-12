import { Link, Navigate, useParams } from "react-router";

const phases = [
  "Project metadata",
  "Domain modeling",
  "Endpoints & security",
  "Generate & export",
];

export default function ProjectDesignerPage() {
  const { projectId } = useParams();

  if (!projectId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm font-medium text-sky-700">Designer</p>
          <h1 className="text-3xl font-bold tracking-tight">Project: {projectId}</h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Walk through each phase to configure your Spring Boot backend before generation.
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Workflow phases</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {phases.map((phase, index) => (
              <div key={phase} className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{index + 1}</p>
                <p className="font-semibold text-slate-900">{phase}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Back to projects
            </Link>
            <Link
              to={`/projects/${projectId}/review`}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Continue to review
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
