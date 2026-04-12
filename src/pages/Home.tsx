import ProjectCard from "../components/projects/ProjectCard";
import type { ProjectSummary } from "../features/projects/types";

const mockProjects: ProjectSummary[] = [
  {
    id: "project-1",
    name: "Payments Gateway",
    description: "Spring Boot API for payment orchestration, fraud checks, and settlement workflows.",
    springVersion: "3.3.5",
    javaVersion: "21",
    packageName: "com.acme.payments",
  },
  {
    id: "project-2",
    name: "Customer Profile Service",
    description: "Manages customer identity, preferences, and account profile lifecycle events.",
    springVersion: "3.2.9",
    javaVersion: "17",
    packageName: "com.acme.customer",
  },
  {
    id: "project-3",
    name: "Inventory Command API",
    description: "Inventory command endpoint handling stock reservations and reconciliation jobs.",
    springVersion: "3.3.2",
    javaVersion: "21",
    packageName: "com.acme.inventory",
  },
  {
    id: "project-4",
    name: "Notifications Hub",
    description: "Dispatches email, push, and webhook notifications with retry strategies.",
    springVersion: "3.1.12",
    javaVersion: "17",
    packageName: "com.acme.notifications",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Spring Builder</p>
            <h1 className="text-lg font-semibold text-slate-900">Projects</h1>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            New Project
          </button>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="mb-8 space-y-3 lg:mb-10">
          <p className="text-sm font-medium text-sky-700">Starter templates</p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Create your next Spring Boot backend</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Pick a project template to quickly bootstrap your API. Update Java and Spring versions, package name,
            and more before generation.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
