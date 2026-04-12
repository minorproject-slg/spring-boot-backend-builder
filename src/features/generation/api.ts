import type { BuilderDesign } from "../builder/model";

const DEFAULT_API_BASE_URL = "http://localhost:8080";
const GENERATE_ENDPOINT = "/api/generation";

export interface GenerationRequestPayload {
  design: BuilderDesign;
  dependencies: string[];
}

interface GenerationResponseBody {
  zipUrl?: string;
  jobId?: string;
  diagnostics?: string[];
  message?: string;
}

export interface GenerationResult {
  jobId?: string;
  zipUrl?: string;
  zipBlob?: Blob;
  fileName?: string;
  diagnostics: string[];
}

export class GenerationApiError extends Error {
  readonly status: number;
  readonly diagnostics: string[];

  constructor(message: string, options: { status: number; diagnostics?: string[] }) {
    super(message);
    this.name = "GenerationApiError";
    this.status = options.status;
    this.diagnostics = options.diagnostics ?? [];
  }
}

const normalizeBaseUrl = (value?: string): string => {
  if (!value?.trim()) {
    return DEFAULT_API_BASE_URL;
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const getApiBaseUrl = (): string => normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const parseFileName = (contentDisposition: string | null): string | undefined => {
  if (!contentDisposition) {
    return undefined;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const quotedMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

  return quotedMatch?.[1];
};

const parseJsonSafely = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const toAbsoluteUrl = (url: string): string => new URL(url, `${getApiBaseUrl()}/`).toString();

export const buildGenerationPayload = (design: BuilderDesign, dependencies: string[]): GenerationRequestPayload => ({
  design,
  dependencies,
});

export async function requestProjectGeneration(payload: GenerationRequestPayload): Promise<GenerationResult> {
  const response = await fetch(toAbsoluteUrl(GENERATE_ENDPOINT), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, application/zip",
    },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (!response.ok) {
    const errorBody = await parseJsonSafely<GenerationResponseBody>(response);
    const diagnostics = errorBody?.diagnostics ?? [];

    throw new GenerationApiError(
      errorBody?.message ?? `Generation failed with status ${response.status}.`,
      { status: response.status, diagnostics },
    );
  }

  if (contentType.includes("application/zip") || contentType.includes("application/octet-stream")) {
    const zipBlob = await response.blob();

    return {
      zipBlob,
      fileName: parseFileName(response.headers.get("content-disposition")) ?? "spring-boot-project.zip",
      diagnostics: [],
    };
  }

  const body = await parseJsonSafely<GenerationResponseBody>(response);

  return {
    jobId: body?.jobId,
    zipUrl: body?.zipUrl,
    diagnostics: body?.diagnostics ?? [],
  };
}

export async function downloadGeneratedArtifact(result: GenerationResult): Promise<void> {
  let blob = result.zipBlob;

  if (!blob && result.zipUrl) {
    const response = await fetch(toAbsoluteUrl(result.zipUrl));

    if (!response.ok) {
      throw new GenerationApiError(`Artifact download failed with status ${response.status}.`, {
        status: response.status,
      });
    }

    blob = await response.blob();
  }

  if (!blob) {
    throw new GenerationApiError("No downloadable artifact was returned by the generator.", { status: 500 });
  }

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = result.fileName ?? "spring-boot-project.zip";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
}
