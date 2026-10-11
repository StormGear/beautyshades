export function isNextRedirect(error: unknown) {
  return typeof error === "object" && error !== null && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT");
}

export function valuesToFormData(values: Record<string, unknown>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "boolean") {
      if (value) formData.append(key, "on");
      continue;
    }
    formData.append(key, String(value));
  }
  return formData;
}
