import { toast } from "sonner";

/**
 * Strips verbose Convex error format down to the human-readable message.
 * Convex errors look like:
 * "Uncaught Error: [Request ID: abc123] Server Error ... handler: <actual message>"
 */
export function parseConvexError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);

  // Try to extract the last meaningful sentence after "handler:"
  const handlerMatch = raw.match(/handler:\s*([\s\S]+)/);
  if (handlerMatch) return handlerMatch[1].trim().split("\n")[0].trim();

  // Try to get content after "Server Error"
  const serverErrorMatch = raw.match(/Server Error\s*([\s\S]+)/);
  if (serverErrorMatch) return serverErrorMatch[1].trim().split("\n")[0].trim();

  // If it's short enough, use as-is
  if (raw.length < 200) return raw;

  return "Something went wrong. Please try again.";
}

export function successToast(message: string) {
  toast.success(message);
}

export function errorToast(err: unknown) {
  toast.error(parseConvexError(err));
}
