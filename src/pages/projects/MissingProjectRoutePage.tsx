import { Link } from "react-router";

export default function MissingProjectRoutePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-amber-700">Missing project context</p>
        <h1 className="text-3xl font-bold tracking-tight">Project ID is required</h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Choose a project from the dashboard or start a new project flow before opening designer/review pages.
        </p>
        <div className="mt-2">
          <Link
            to="/"
            className="inline-flex rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Go to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
