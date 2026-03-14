export function makeDeptCode(department: string): string {
  return department.trim().slice(0, 3).toUpperCase();
}

export function generateEmployeeId(
  department: string,
  existingCount: number
): string {
  const code = makeDeptCode(department);
  const seq = String(existingCount + 1).padStart(3, "0");
  return `${code}-${seq}`;
}
