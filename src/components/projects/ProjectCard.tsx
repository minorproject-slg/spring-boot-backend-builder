import type { MouseEventHandler } from "react";
import type { ProjectSummary } from "../../features/projects/types";

type ProjectCardProps = {
  project: ProjectSummary;
  onClick?: MouseEventHandler<HTMLElement>;
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <article
      onClick={onClick}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
    >
      <header className="mb-4 space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">{project.name}</h2>
        <p className="text-sm leading-relaxed text-slate-600">{project.description}</p>
      </header>

      <dl className="mt-auto grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Spring</dt>
          <dd className="mt-1 font-semibold text-slate-800">{project.springVersion}</dd>
        </div>

        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Java</dt>
          <dd className="mt-1 font-semibold text-slate-800">{project.javaVersion}</dd>
        </div>

        <div className="rounded-lg bg-slate-50 px-3 py-2 sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Package</dt>
          <dd className="mt-1 font-semibold text-slate-800">{project.packageName}</dd>
        </div>
      </dl>
    </article>
  );
}
