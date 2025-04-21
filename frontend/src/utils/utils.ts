// frontend/src/utils/utils.ts

export function convertFormDataToStringSafely(
  value: FormDataEntryValue | null | undefined,
): string {
  return typeof value === "string" ? value : "";
}
