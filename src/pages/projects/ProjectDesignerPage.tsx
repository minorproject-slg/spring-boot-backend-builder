import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { useBuilderDispatch, useBuilderSelectors, useBuilderState } from "../../features/builder/store";

const phases = [
  "Project metadata",
  "Domain modeling",
  "Endpoints & security",
  "Generate & export",
];

export default function ProjectDesignerPage() {
  const { projectId } = useParams();
  const state = useBuilderState();
  const dispatch = useBuilderDispatch();
  const { entityCount, endpointCount, readinessStatus } = useBuilderSelectors();
  const [entityName, setEntityName] = useState("");

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

          <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
            <p className="text-sm text-slate-700">Entities: <span className="font-semibold">{entityCount}</span></p>
            <p className="text-sm text-slate-700">Endpoints: <span className="font-semibold">{endpointCount}</span></p>
            <p className="text-sm text-slate-700">
              Status: <span className="font-semibold capitalize">{readinessStatus.replace("-", " ")}</span>
            </p>
          </div>

          <div className="mt-6 space-y-4 rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold">Project metadata</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={state.draft.project.name}
                onChange={(event) =>
                  dispatch({
                    type: "createProject",
                    payload: {
                      ...state.draft.project,
                      name: event.target.value,
                    },
                  })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Project name"
              />
              <input
                value={state.draft.project.groupId}
                onChange={(event) =>
                  dispatch({
                    type: "createProject",
                    payload: {
                      ...state.draft.project,
                      groupId: event.target.value,
                    },
                  })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Group ID"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold">Domain model</h3>
            <div className="flex gap-2">
              <input
                value={entityName}
                onChange={(event) => setEntityName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Entity name"
              />
              <button
                type="button"
                onClick={() => {
                  if (!entityName.trim()) {
                    return;
                  }

                  dispatch({
                    type: "addEntity",
                    payload: {
                      name: entityName.trim(),
                      fields: [{ name: "id", type: "uuid" }],
                    },
                  });
                  setEntityName("");
                }}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Add entity
              </button>
            </div>

            {state.draft.entities.map((entity) => (
              <div key={entity.name} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">{entity.name}</p>
                {entity.fields.map((field) => (
                  <div key={field.name} className="mt-2 flex items-center gap-2 text-sm">
                    <span className="min-w-20 text-slate-700">{field.name}</span>
                    <input
                      value={field.type}
                      onChange={(event) =>
                        dispatch({
                          type: "updateField",
                          payload: {
                            entityName: entity.name,
                            fieldName: field.name,
                            patch: { type: event.target.value as typeof field.type },
                          },
                        })
                      }
                      className="rounded border border-slate-300 px-2 py-1"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "setSecurity",
                  payload: {
                    authType: "jwt",
                    roles: ["ADMIN", "USER"],
                    jwtEnabled: true,
                    basicEnabled: false,
                  },
                })
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Use JWT security
            </button>
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "setDependencies",
                  payload: ["spring-boot-starter-web", "spring-boot-starter-validation"],
                })
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Apply web dependencies
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "resetDraft" })}
              className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
            >
              Reset draft
            </button>
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
