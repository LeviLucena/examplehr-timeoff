export interface TimeOffBalance {
  employeeId: string;
  employeeName: string;
  locationId: string;
  locationName: string;
  totalDays: number;
  usedDays: number;
  availableDays: number;
  accrualDate?: string;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  locationId: string;
  locationName: string;
  daysRequested: number;
  status: "pending" | "approved" | "denied";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface SubmitRequestPayload {
  employeeId: string;
  locationId: string;
  daysRequested: number;
}

export interface ApproveDenyPayload {
  requestId: string;
  action: "approved" | "denied";
  reviewerId: string;
}

export interface HcmError {
  code: "INSUFFICIENT_BALANCE" | "INVALID_DIMENSION" | "CONFLICT" | "SILENT_FAILURE" | "UNKNOWN";
  message: string;
  details?: Record<string, unknown>;
}

export interface HcmResponse<T> {
  success: boolean;
  data?: T;
  error?: HcmError;
  syncedAt: string;
}

export interface RequestState {
  requests: TimeOffRequest[];
  loading: boolean;
  submitting: boolean;
  optimisticIds: Set<string>;
}

export interface BalancesState {
  balances: TimeOffBalance[];
  loading: boolean;
  stale: boolean;
  lastSyncedAt: string | null;
}

export type ViewRole = "employee" | "manager";
