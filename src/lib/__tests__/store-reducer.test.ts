import { describe, it, expect } from "vitest";

type Role = "employee" | "manager";

interface TimeOffBalance {
  employeeId: string;
  employeeName: string;
  locationId: string;
  locationName: string;
  totalDays: number;
  usedDays: number;
  availableDays: number;
  accrualDate?: string;
}

interface TimeOffRequest {
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

interface Notification {
  type: "success" | "error";
  message: string;
}

interface State {
  role: Role;
  currentEmployeeId: string;
  currentEmployeeName: string;
  balances: TimeOffBalance[];
  balancesLoading: boolean;
  balancesStale: boolean;
  balancesError: string | null;
  lastSyncedAt: string | null;
  pendingRequests: TimeOffRequest[];
  requestsLoading: boolean;
  requestsError: string | null;
  submitting: boolean;
  submitError: string | null;
  notification: Notification | null;
}

type Action =
  | { type: "SET_ROLE"; role: Role }
  | { type: "BALANCES_LOADING" }
  | { type: "BALANCES_SUCCESS"; balances: TimeOffBalance[]; syncedAt: string }
  | { type: "BALANCES_ERROR"; error: string }
  | { type: "BALANCES_STALE"; stale: boolean }
  | { type: "REQUESTS_LOADING" }
  | { type: "REQUESTS_SUCCESS"; requests: TimeOffRequest[] }
  | { type: "REQUESTS_ERROR"; error: string }
  | { type: "SUBMITTING" }
  | { type: "SUBMIT_SUCCESS"; request: TimeOffRequest }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "REMOVE_REQUEST"; requestId: string }
  | { type: "SET_NOTIFICATION"; notification: Notification | null };

const initialState: State = {
  role: "employee",
  currentEmployeeId: "emp-1",
  currentEmployeeName: "Alice Johnson",
  balances: [],
  balancesLoading: true,
  balancesStale: false,
  balancesError: null,
  lastSyncedAt: null,
  pendingRequests: [],
  requestsLoading: true,
  requestsError: null,
  submitting: false,
  submitError: null,
  notification: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.role };
    case "BALANCES_LOADING":
      return { ...state, balancesLoading: true, balancesError: null };
    case "BALANCES_SUCCESS":
      return {
        ...state,
        balances: action.balances,
        balancesLoading: false,
        balancesStale: false,
        balancesError: null,
        lastSyncedAt: action.syncedAt,
      };
    case "BALANCES_ERROR":
      return {
        ...state,
        balancesLoading: false,
        balancesError: action.error,
        balancesStale: true,
      };
    case "BALANCES_STALE":
      return { ...state, balancesStale: action.stale };
    case "REQUESTS_LOADING":
      return { ...state, requestsLoading: true, requestsError: null };
    case "REQUESTS_SUCCESS":
      return {
        ...state,
        pendingRequests: action.requests,
        requestsLoading: false,
        requestsError: null,
      };
    case "REQUESTS_ERROR":
      return { ...state, requestsLoading: false, requestsError: action.error };
    case "SUBMITTING":
      return { ...state, submitting: true, submitError: null };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        pendingRequests: [...state.pendingRequests, action.request],
        submitting: false,
      };
    case "SUBMIT_ERROR":
      return {
        ...state,
        submitting: false,
        submitError: action.error,
        notification: { type: "error", message: action.error },
      };
    case "REMOVE_REQUEST":
      return {
        ...state,
        pendingRequests: state.pendingRequests.filter(
          (r) => r.id !== action.requestId
        ),
      };
    case "SET_NOTIFICATION":
      return { ...state, notification: action.notification };
    default:
      return state;
  }
}

describe("Store Reducer", () => {
  it("switches role", () => {
    const state = reducer(initialState, { type: "SET_ROLE", role: "manager" });
    expect(state.role).toBe("manager");
  });

  it("sets loading state for balances", () => {
    const state = reducer(initialState, { type: "BALANCES_LOADING" });
    expect(state.balancesLoading).toBe(true);
    expect(state.balancesError).toBeNull();
  });

  it("handles balances success", () => {
    const balances: TimeOffBalance[] = [
      {
        employeeId: "emp-1",
        employeeName: "Alice",
        locationId: "loc-1",
        locationName: "NYC",
        totalDays: 20,
        usedDays: 5,
        availableDays: 15,
      },
    ];
    const syncedAt = new Date().toISOString();
    const state = reducer(
      { ...initialState, balancesLoading: true },
      { type: "BALANCES_SUCCESS", balances, syncedAt }
    );
    expect(state.balances).toEqual(balances);
    expect(state.balancesLoading).toBe(false);
    expect(state.balancesStale).toBe(false);
    expect(state.lastSyncedAt).toBe(syncedAt);
  });

  it("handles balances error", () => {
    const state = reducer(
      { ...initialState, balancesLoading: true },
      { type: "BALANCES_ERROR", error: "HCM unavailable" }
    );
    expect(state.balancesLoading).toBe(false);
    expect(state.balancesError).toBe("HCM unavailable");
    expect(state.balancesStale).toBe(true);
  });

  it("sets balances stale flag", () => {
    const state = reducer(initialState, {
      type: "BALANCES_STALE",
      stale: true,
    });
    expect(state.balancesStale).toBe(true);
  });

  it("handles requests success", () => {
    const requests: TimeOffRequest[] = [
      {
        id: "req-1",
        employeeId: "emp-1",
        employeeName: "Alice",
        locationId: "loc-1",
        locationName: "NYC",
        daysRequested: 2,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ];
    const state = reducer(
      { ...initialState, requestsLoading: true },
      { type: "REQUESTS_SUCCESS", requests }
    );
    expect(state.pendingRequests).toEqual(requests);
    expect(state.requestsLoading).toBe(false);
  });

  it("handles requests error", () => {
    const state = reducer(
      { ...initialState, requestsLoading: true },
      { type: "REQUESTS_ERROR", error: "Failed" }
    );
    expect(state.requestsLoading).toBe(false);
    expect(state.requestsError).toBe("Failed");
  });

  it("sets submitting state", () => {
    const state = reducer(initialState, { type: "SUBMITTING" });
    expect(state.submitting).toBe(true);
    expect(state.submitError).toBeNull();
  });

  it("adds request on submit success", () => {
    const request: TimeOffRequest = {
      id: "req-new",
      employeeId: "emp-1",
      employeeName: "Alice",
      locationId: "loc-1",
      locationName: "NYC",
      daysRequested: 2,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const state = reducer(
      { ...initialState, submitting: true },
      { type: "SUBMIT_SUCCESS", request }
    );
    expect(state.pendingRequests).toHaveLength(1);
    expect(state.pendingRequests[0].id).toBe("req-new");
    expect(state.submitting).toBe(false);
  });

  it("handles submit error", () => {
    const state = reducer(
      { ...initialState, submitting: true },
      { type: "SUBMIT_ERROR", error: "Insufficient balance" }
    );
    expect(state.submitting).toBe(false);
    expect(state.submitError).toBe("Insufficient balance");
    expect(state.notification).toEqual({
      type: "error",
      message: "Insufficient balance",
    });
  });

  it("removes a request by id", () => {
    const req1: TimeOffRequest = {
      id: "req-1",
      employeeId: "emp-1",
      employeeName: "Alice",
      locationId: "loc-1",
      locationName: "NYC",
      daysRequested: 2,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const req2: TimeOffRequest = {
      id: "req-2",
      employeeId: "emp-2",
      employeeName: "Bob",
      locationId: "loc-2",
      locationName: "London",
      daysRequested: 3,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const withRequests = { ...initialState, pendingRequests: [req1, req2] };
    const state = reducer(withRequests, {
      type: "REMOVE_REQUEST",
      requestId: "req-1",
    });
    expect(state.pendingRequests).toHaveLength(1);
    expect(state.pendingRequests[0].id).toBe("req-2");
  });

  it("sets and clears notification", () => {
    const notif: Notification = { type: "success", message: "Done!" };
    const withNotif = reducer(initialState, {
      type: "SET_NOTIFICATION",
      notification: notif,
    });
    expect(withNotif.notification).toEqual(notif);
    const cleared = reducer(withNotif, {
      type: "SET_NOTIFICATION",
      notification: null,
    });
    expect(cleared.notification).toBeNull();
  });
});
