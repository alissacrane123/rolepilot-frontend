import type { DAY_FILTER_OPTIONS } from "./constants";

export type DayFilterId = (typeof DAY_FILTER_OPTIONS)[number]["id"];

export interface TaskFilterState {
  dayFilter: DayFilterId;
  groupId: string | null;
}
