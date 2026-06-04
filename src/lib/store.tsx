"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type {
  TimeOffBalance,
  TimeOffRequest,
  SubmitRequestPayload,
  ApproveDenyPayload,
} from "./types";
import * as Hcm from "./hcm-client";

type Role = "employee" | "manager";

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

const EMPLOYEE_ID = "emp-1";
const EMPLOYEE_NAME = "Alice Johnson";

const initialState: State = {
  role: "employee",
  currentEmployeeId: EMPLOYEE_ID,
  currentEmployeeName: EMPLOYEE_NAME,
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

interface StoreContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  loadBalances: () => Promise<void>;
  loadRequests: () => Promise<void>;
  submitTimeOff: (payload: SubmitRequestPayload) => Promise<void>;
  handleApproveDeny: (payload: ApproveDenyPayload) => Promise<void>;
  clearNotification: () => void;
  switchRole: (role: Role) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadBalances = useCallback(async () => {
    dispatch({ type: "BALANCES_LOADING" });
    try {
      const data = await Hcm.fetchEmployeeBalances(state.currentEmployeeId);
      dispatch({
        type: "BALANCES_SUCCESS",
        balances: data.balances,
        syncedAt: data.syncedAt,
      });
    } catch (err) {
      dispatch({
        type: "BALANCES_ERROR",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, [state.currentEmployeeId]);

  const loadRequests = useCallback(async () => {
    dispatch({ type: "REQUESTS_LOADING" });
    try {
      const data = await Hcm.fetchPendingRequests();
      dispatch({
        type: "REQUESTS_SUCCESS",
        requests: data.requests,
      });
    } catch (err) {
      dispatch({
        type: "REQUESTS_ERROR",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, []);

  const submitTimeOff = useCallback(
    async (payload: SubmitRequestPayload) => {
      dispatch({ type: "SUBMITTING" });

      const optimisticId = `opt-${Date.now()}`;
      const optimisticRequest: TimeOffRequest = {
        id: optimisticId,
        employeeId: payload.employeeId,
        employeeName: state.currentEmployeeName,
        locationId: payload.locationId,
        locationName:
          state.balances.find((b) => b.locationId === payload.locationId)
            ?.locationName ?? "",
        daysRequested: payload.daysRequested,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: "SUBMIT_SUCCESS", request: optimisticRequest });
      dispatch({
        type: "SET_NOTIFICATION",
        notification: {
          type: "success",
          message: "Request submitted (pending confirmation)...",
        },
      });

      try {
        const result = await Hcm.submitRequest(payload);
        dispatch({ type: "REMOVE_REQUEST", requestId: optimisticId });
        dispatch({ type: "SUBMIT_SUCCESS", request: result.request });
        dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            type: "success",
            message: "Time-off request submitted successfully!",
          },
        });
        loadBalances();
      } catch (err) {
        dispatch({ type: "REMOVE_REQUEST", requestId: optimisticId });
        dispatch({
          type: "SUBMIT_ERROR",
          error:
            err instanceof Error ? err.message : "Failed to submit request",
        });
        dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            type: "error",
            message:
              err instanceof Error
                ? err.message
                : "Failed to submit request",
          },
        });
      }
    },
    [state.currentEmployeeName, state.balances, loadBalances]
  );

  const handleApproveDeny = useCallback(
    async (payload: ApproveDenyPayload) => {
      dispatch({ type: "REMOVE_REQUEST", requestId: payload.requestId });

      try {
        await Hcm.approveOrDenyRequest(payload);
        dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            type: "success",
            message:
              payload.action === "approved"
                ? "Request approved"
                : "Request denied",
          },
        });
        loadRequests();
        loadBalances();
      } catch {
        dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            type: "error",
            message: "Failed to update request. Please try again.",
          },
        });
        loadRequests();
      }
    },
    [loadRequests, loadBalances]
  );

  const clearNotification = useCallback(() => {
    dispatch({ type: "SET_NOTIFICATION", notification: null });
  }, []);

  const switchRole = useCallback((role: Role) => {
    dispatch({ type: "SET_ROLE", role });
  }, []);

  useEffect(() => {
    loadBalances();
    loadRequests();

    intervalRef.current = setInterval(() => {
      loadBalances();
      loadRequests();
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadBalances, loadRequests]);

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        loadBalances,
        loadRequests,
        submitTimeOff,
        handleApproveDeny,
        clearNotification,
        switchRole,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
