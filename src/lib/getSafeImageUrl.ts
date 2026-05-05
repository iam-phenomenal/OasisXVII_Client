export function getSafeImageUrl(images: unknown, index = 0): string | undefined {
  if (!Array.isArray(images) || images.length === 0) return undefined;
  const item = images[index];
  if (typeof item === "string" && item.length > 0) return item;
  if (item !== null && typeof item === "object" && "url" in item && typeof (item as { url: unknown }).url === "string") {
    return (item as { url: string }).url;
  }
  return undefined;
}
