import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { useBuilderSelectors, useBuilderState } from "../../features/builder/store";
import {
  buildGenerationPayload,
  downloadGeneratedArtifact,
  GenerationApiError,
  type GenerationResult,
  requestProjectGeneration,
} from "../../features/generation/api";

type GenerateStatus = "idle" | "loading" | "success" | "error";

export default function ProjectReviewPage() {
  const { projectId } = useParams();
  const state = useBuilderState();
  const { entityCount, endpointCount, readinessStatus, validationWarnings } = useBuilderSelectors();
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle");
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDiagnostics, setErrorDiagnostics] = useState<string[]>([]);

  if (!projectId) {
    return <Navigate to="/" replace />;
  }

  const canGenerate = readinessStatus === "ready";
  const project = state.draft.project;
  const database = state.draft.database;
  const security = state.draft.security;

  const generationDiagnostics = [...(generationResult?.diagnostics ?? []), ...errorDiagnostics];

  const handleGenerate = async () => {
    setGenerateStatus("loading");
    setErrorMessage(null);
    setErrorDiagnostics([]);

    try {
      const payload = buildGenerationPayload(state.draft, state.dependencies);
      const result = await requestProjectGeneration(payload);

      setGenerationResult(result);
      setGenerateStatus("success");

      if (result.zipBlob) {
        await downloadGeneratedArtifact(result);
      }
    } catch (error) {
      if (error instanceof GenerationApiError) {
        setErrorMessage(error.message);
        setErrorDiagnostics(error.diagnostics);
      } else {
        setErrorMessage("Unexpected generation failure. Please retry.");
      }

      setGenerationResult(null);
      setGenerateStatus("error");
    }
  };

  const handleDownload = async () => {
    if (!generationResult) {
      return;
    }

    try {
      await downloadGeneratedArtifact(generationResult);
    } catch (error) {
      if (error instanceof GenerationApiError) {
        setErrorMessage(error.message);
        setErrorDiagnostics(error.diagnostics);
      } else {
        setErrorMessage("Unable to download the generated zip artifact.");
      }

      setGenerateStatus("error");
    }
  };

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

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">Project metadata</h2>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>Name: <span className="font-medium">{project.name || "(missing)"}</span></li>
                <li>Group ID: <span className="font-medium">{project.groupId || "(missing)"}</span></li>
                <li>Artifact ID: <span className="font-medium">{project.artifactId || "(missing)"}</span></li>
                <li>Java: <span className="font-medium">{project.javaVersion}</span></li>
                <li>Spring Boot: <span className="font-medium">{project.springBootVersion}</span></li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">Runtime & security</h2>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>Database: <span className="font-medium">{database.engine}</span></li>
                <li>Connection profile: <span className="font-medium">{database.connectionProfile.name}</span></li>
                <li>Auth type: <span className="font-medium">{security.authType}</span></li>
                <li>Roles: <span className="font-medium">{security.roles.length ? security.roles.join(", ") : "None"}</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Entity summary</h2>
            {state.draft.entities.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No entities configured yet.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {state.draft.entities.map((entity) => (
                  <li key={entity.name} className="rounded-md bg-slate-50 px-3 py-2">
                    <p className="font-medium text-slate-900">{entity.name}</p>
                    <p className="text-slate-600">Fields: {entity.fields.map((field) => `${field.name}:${field.type}`).join(", ")}</p>
                  </li>
                ))}
              </ul>
            )}
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

          {errorMessage && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
              <h2 className="font-semibold text-rose-900">Generation failed</h2>
              <p className="mt-1 text-sm text-rose-800">{errorMessage}</p>
            </div>
          )}

          {generationDiagnostics.length > 0 && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
              <h2 className="font-semibold text-rose-900">Diagnostics</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-800">
                {generationDiagnostics.map((diagnostic, index) => (
                  <li key={`${diagnostic}-${index}`}>{diagnostic}</li>
                ))}
              </ul>
            </div>
          )}

          {generateStatus === "success" && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h2 className="font-semibold text-emerald-900">Generation succeeded</h2>
              <p className="mt-1 text-sm text-emerald-800">
                {generationResult?.jobId
                  ? `Job queued with ID ${generationResult.jobId}.`
                  : "Project artifact is ready for download."}
              </p>
              {generationResult?.zipUrl && (
                <p className="mt-1 break-all text-xs text-emerald-700">Artifact URL: {generationResult.zipUrl}</p>
              )}
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
              onClick={handleGenerate}
              disabled={!canGenerate || generateStatus === "loading"}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {generateStatus === "loading" ? "Generating..." : "Generate"}
            </button>
            {generationResult && (
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Download zip
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
