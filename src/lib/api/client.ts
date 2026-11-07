type ApiFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  /** Abort the request after this many ms. Defaults to DEFAULT_TIMEOUT_MS. */
  timeoutMs?: number;
};

const API_URL = process.env.API_URL ?? "http://localhost:4000";

// Node's fetch waits minutes for a response from a backend that accepted the
// connection but never answers, which hangs whatever page or route awaits it.
// Fail well inside Next's 60s page-generation limit instead.
const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildHeaders(init?: RequestInit) {
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

export async function apiFetch<T>(
  path: string,
  init?: ApiFetchOptions,
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...requestInit } = init ?? {};
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const signal = requestInit.signal
    ? AbortSignal.any([requestInit.signal, timeoutSignal])
    : timeoutSignal;

  let response: Response;
  let body: unknown;

  // The timeout covers reading the body too, so a response that stalls
  // mid-stream also fails instead of hanging.
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...requestInit,
      headers: buildHeaders(requestInit),
      signal,
    });
    const contentType = response.headers.get("content-type") ?? "";
    body = contentType.includes("application/json")
      ? await response.json().catch((error: unknown) => {
          if (timeoutSignal.aborted) throw error;
          return null;
        })
      : null;
  } catch (error) {
    if (timeoutSignal.aborted) {
      throw new ApiError(504, `API request to ${path} timed out`);
    }
    throw error;
  }

  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : response.statusText;

    throw new ApiError(response.status, message);
  }

  return body as T;
}