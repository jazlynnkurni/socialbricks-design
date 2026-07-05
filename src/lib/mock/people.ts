// Mock Person directory. 25 people, generated deterministically (no
// Math.random) so server and client renders agree. The first six are the
// named people carried over from the original mock; the rest are synthetic.

import type { Person } from "@/lib/types/contract";
import { MOCK_USER } from "./user";

const STAFF_ID = MOCK_USER.id;

// Days-ago helper for last-contact dates, computed at module load.
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

const named: Person[] = [
  {
    id: "person-1",
    fullName: "Marisol Vega",
    dateOfBirth: "1988-03-14",
    phone: "(555) 014-2213",
    email: "marisol.vega@example.org",
    address: "482 Alder Court, Apt 3B, Riverside",
    preferredLanguage: "Spanish",
    householdSize: 4,
    monthlyIncome: { amountCents: 234000, currency: "USD" },
    lastContact: daysAgo(2),
    assignedTo: STAFF_ID,
  },
  {
    id: "person-2",
    fullName: "Darnell Okafor",
    dateOfBirth: "1979-11-02",
    phone: "(555) 014-3390",
    email: "darnell.okafor@example.org",
    address: "1170 Birchwood Ave, Eastgate",
    preferredLanguage: "English",
    householdSize: 3,
    monthlyIncome: { amountCents: 301500, currency: "USD" },
    lastContact: daysAgo(5),
    assignedTo: STAFF_ID,
  },
  {
    id: "person-3",
    fullName: "Priya Raghunathan",
    dateOfBirth: "1991-06-21",
    phone: "(555) 014-7781",
    email: "priya.raghunathan@example.org",
    address: "56 Cedar Lane, Northfield",
    preferredLanguage: "English",
    householdSize: 2,
    monthlyIncome: { amountCents: 268000, currency: "USD" },
    lastContact: daysAgo(1),
    assignedTo: STAFF_ID,
  },
  {
    id: "person-4",
    fullName: "Tommy Lindqvist",
    dateOfBirth: "1985-01-09",
    phone: "(555) 014-5502",
    email: "tommy.lindqvist@example.org",
    address: "903 Elm Street, Southbrook",
    preferredLanguage: "Swedish",
    householdSize: 5,
    monthlyIncome: { amountCents: 189000, currency: "USD" },
    lastContact: daysAgo(9),
    assignedTo: STAFF_ID,
  },
  {
    id: "person-5",
    fullName: "Aisha Bello",
    dateOfBirth: "1994-09-30",
    phone: "(555) 014-6614",
    email: "aisha.bello@example.org",
    address: "22 Maple Court, Westhaven",
    preferredLanguage: "English",
    householdSize: 1,
    monthlyIncome: { amountCents: 152000, currency: "USD" },
    lastContact: daysAgo(14),
    assignedTo: STAFF_ID,
  },
  {
    id: "person-6",
    fullName: "Rosa Delgado",
    dateOfBirth: "1972-04-18",
    phone: "(555) 014-8829",
    email: "rosa.delgado@example.org",
    address: "715 Willow Road, Riverside",
    preferredLanguage: "Spanish",
    householdSize: 3,
    monthlyIncome: { amountCents: 224500, currency: "USD" },
    lastContact: daysAgo(3),
    assignedTo: STAFF_ID,
  },
];

const FIRST_NAMES = [
  "Elena", "Marcus", "Yuki", "Omar", "Ingrid", "Devon", "Fatima", "Carlos",
  "Nadia", "Theo", "Amara", "Viktor", "Leilani", "Samuel", "Beatriz",
  "Hassan", "Greta", "Mateo", "Zara",
];

const LAST_NAMES = [
  "Moreno", "Achebe", "Tanaka", "Haddad", "Sorensen", "Whitaker", "Rahman",
  "Ibarra", "Kovacs", "Mbeki", "Larsen", "Petrov", "Kealoha", "Osei",
  "Duarte", "Farah", "Lindgren", "Costa", "Nawaz",
];

const STREETS = [
  "Alder Court", "Birchwood Ave", "Cedar Lane", "Elm Street", "Maple Court",
  "Willow Road", "Oak Terrace", "Pine Hollow", "Spruce Way", "Aspen Drive",
];

const DISTRICTS = ["Riverside", "Eastgate", "Northfield", "Southbrook", "Westhaven"];

const LANGUAGES = [
  "English", "English", "English", "Spanish", "English", "Somali",
  "English", "Tagalog", "English", "Vietnamese", "English", "Mandarin",
];

const generated: Person[] = Array.from({ length: 19 }, (_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length];
  const birthYear = 1962 + ((i * 7) % 38);
  const birthMonth = String(((i * 5) % 12) + 1).padStart(2, "0");
  const birthDay = String(((i * 11) % 27) + 1).padStart(2, "0");
  return {
    id: `person-${i + 7}`,
    fullName: `${first} ${last}`,
    dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
    phone: `(555) 015-${String(1000 + i * 37).padStart(4, "0")}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.org`,
    address: `${120 + i * 13} ${STREETS[i % STREETS.length]}, ${DISTRICTS[i % DISTRICTS.length]}`,
    preferredLanguage: LANGUAGES[i % LANGUAGES.length],
    householdSize: (i % 5) + 1,
    monthlyIncome: { amountCents: 150000 + (i * 8300) % 220000, currency: "USD" },
    lastContact: daysAgo(1 + ((i * 3) % 29)),
    assignedTo: STAFF_ID,
  };
});

export const mockPeople: Person[] = [...named, ...generated];

const PEOPLE_BY_ID: Record<string, Person> = Object.fromEntries(
  mockPeople.map((person) => [person.id, person]),
);

export function getPerson(id: string): Person | undefined {
  return PEOPLE_BY_ID[id];
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
