// The signed-in mock staff user, shared by the profile row, greeting card,
// and Person.assignedTo. One staff user exists in this prototype.

import type { StaffUser } from "@/lib/types/contract";

export const MOCK_USER: StaffUser = {
  id: "staff-1",
  fullName: "Jazlynn Kurniandra",
  firstName: "Jazlynn",
  role: "Case Manager",
  initials: "JK",
};

const STAFF: Record<string, StaffUser> = {
  [MOCK_USER.id]: MOCK_USER,
};

export function getStaff(id: string): StaffUser | undefined {
  return STAFF[id];
}

export function getStaffName(id: string): string {
  return STAFF[id]?.fullName ?? "Unassigned";
}
