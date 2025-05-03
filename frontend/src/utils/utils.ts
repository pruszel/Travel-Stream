// frontend/src/utils/utils.ts

/**
 * Type-safe convert FormDataEntryValue to string.
 */
export function convertFormDataToStringSafely(
  value: FormDataEntryValue | null | undefined,
): string {
  return typeof value === "string" ? value : "";
}
