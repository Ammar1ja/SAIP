export function getUniqueOptions<T>(data: T[], key: keyof T) {
  const set = new Set(data.map((item) => item[key]).filter(Boolean));
  return Array.from(set).map((value) => ({
    value: value?.toString() ?? '',
    label: value as string,
  }));
}
