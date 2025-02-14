import { ApiErrorResponse } from "@/state/api";

export function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return typeof error === "object" && error !== null && "data" in error;
}
