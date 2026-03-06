export const SIDEBAR_DEFAULT = 300;
export const SIDEBAR_MIN = 50;
export const SIDEBAR_MAX = 900;
export const COLLAPSE_THRESHOLD = 140;
export const COLLAPSED_WIDTH = 44;

export const DAY_FILTER_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "all", label: "All" },
] as const;

export const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export const TODAY = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate(),
);

export const ALL_APPS_VALUE = "all";
export const ALL_GROUPS_VALUE = "All";
