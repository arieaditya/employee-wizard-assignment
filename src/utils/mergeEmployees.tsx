type BasicRecord = {
  id: number;
  fullName: string;
  email: string;
  department: string;
};

type DetailRecord = {
  id: number;
  email: string;
  employeeId: string;
  role: string;
  location: string;
  photoBase64?: string;
};

export type MergedEmployee = {
  id: string;
  name: string;
  department: string | null;
  role: string | null;
  location: string | null;
  photoBase64?: string;
};

export function mergeByEmail(
  basics: BasicRecord[],
  details: DetailRecord[]
): MergedEmployee[] {
  const detailByEmail = new Map<string, DetailRecord>();
  details.forEach((d) => {
    if (d.email) detailByEmail.set(d.email, d);
  });

  const result: MergedEmployee[] = [];

  basics.forEach((b) => {
    const d = detailByEmail.get(b.email);
    result.push({
      id: d?.employeeId || String(b.id),
      name: b.fullName,
      department: b.department || null,
      role: d?.role || null,
      location: d?.location || null,
      photoBase64: d?.photoBase64,
    });
  });

  // include pure Ops (details without basicInfo)
  details.forEach((d) => {
    const hasBasic = basics.some((b) => b.email === d.email);
    if (!hasBasic) {
      result.push({
        id: d.employeeId || String(d.id),
        name: d.email, // fallback
        department: null,
        role: d.role || null,
        location: d.location || null,
        photoBase64: d.photoBase64,
      });
    }
  });

  return result;
}
