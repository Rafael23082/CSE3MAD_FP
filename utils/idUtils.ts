export const normalizeId = (id: string): string => {
  return id.replace(/([A-Z])/g, "_$1").toLowerCase();
};

export const kebabToSnake = (key: string): string => {
  return key.replace(/-/g, "_");
};