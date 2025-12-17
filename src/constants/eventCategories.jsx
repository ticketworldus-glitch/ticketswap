// src/constants/eventCategories.js

export const EVENT_CATEGORIES = [
  { value: "concerts", label: "Concerts" },
  { value: "sports", label: "Sports" },
  { value: "theatre_comedy", label: "Theatre & Comedy" },
  { value: "festivals", label: "Festivals" },
  { value: "club_nights", label: "Club nights" },
  { value: "amusement_parks", label: "Amusement parks" },
  { value: "museums", label: "Museums" },
  { value: "other", label: "Other" },
];

export function getCategoryLabel(value) {
  const match = EVENT_CATEGORIES.find((c) => c.value === value);
  return match ? match.label : "Other";
}
