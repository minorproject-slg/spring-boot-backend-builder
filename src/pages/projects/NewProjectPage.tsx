import { Link } from "react-router";

const workflowSteps = [
  {
    title: "Project metadata",
    description: "Define app name, package, Java version, and Spring Boot baseline.",
  },
  {
    title: "Domain modeling",
    description: "Model aggregates, entities, and relationships for your core business flows.",
  },
  {
    title: "Endpoints & security",
    description: "Configure REST endpoints, validation, auth, and role-based access policies.",
  },
  {
    title: "Generate & export",
    description: "Produce the project scaffold and export as zip or Git-ready structure.",
  },
];

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-sm font-medium text-sky-700">Project setup</p>
          <h1 className="text-3xl font-bold tracking-tight">Create a new backend project</h1>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Start with project metadata, then move through domain design, endpoints/security, and final generation.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Workflow</h2>
          <ol className="mt-4 space-y-3">
            {workflowSteps.map((step, index) => (
              <li key={step.title} className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Step {index + 1}</p>
                <p className="mt-1 font-semibold text-slate-900">{step.title}</p>
                <p className="text-sm text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Back to projects
            </Link>
            <Link
              to="/projects/new-project/designer"
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Continue to designer
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
