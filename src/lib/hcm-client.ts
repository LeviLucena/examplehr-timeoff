import type {
  TimeOffBalance,
  TimeOffRequest,
  HcmResponse,
  SubmitRequestPayload,
  ApproveDenyPayload,
} from "./types";

const BASE_URL = "/api/hcm";

async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<HcmResponse<T>> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  return json as HcmResponse<T>;
}

export async function fetchAllBalances(): Promise<{
  balances: TimeOffBalance[];
  syncedAt: string;
}> {
  const res = await fetchJson<{ balances: TimeOffBalance[]; syncedAt: string }>(
    `${BASE_URL}/balances`
  );
  if (!res.success || !res.data) {
    throw new Error(res.error?.message ?? "Failed to fetch balances");
  }
  return res.data;
}

export async function fetchEmployeeBalances(
  employeeId: string
): Promise<{ balances: TimeOffBalance[]; syncedAt: string }> {
  const res = await fetchJson<{
    balances: TimeOffBalance[];
    syncedAt: string;
  }>(`${BASE_URL}/balances?employeeId=${employeeId}`);
  if (!res.success || !res.data) {
    throw new Error(res.error?.message ?? "Failed to fetch employee balances");
  }
  return res.data;
}

export async function fetchSingleBalance(
  employeeId: string,
  locationId: string
): Promise<{ balance: TimeOffBalance; syncedAt: string }> {
  const res = await fetchJson<{ balance: TimeOffBalance; syncedAt: string }>(
    `${BASE_URL}/balance?employeeId=${employeeId}&locationId=${locationId}`
  );
  if (!res.success || !res.data) {
    throw new Error(res.error?.message ?? "Failed to fetch balance");
  }
  return res.data;
}

export async function submitRequest(
  payload: SubmitRequestPayload
): Promise<{ request: TimeOffRequest; syncedAt: string }> {
  const res = await fetchJson<{ request: TimeOffRequest; syncedAt: string }>(
    `${BASE_URL}/requests`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  if (!res.success || !res.data) {
    const err = new Error(res.error?.message ?? "Failed to submit request");
    (err as unknown as Record<string, unknown>).code = res.error?.code;
    throw err;
  }
  return res.data;
}

export async function fetchPendingRequests(): Promise<{
  requests: TimeOffRequest[];
  syncedAt: string;
}> {
  const res = await fetchJson<{ requests: TimeOffRequest[]; syncedAt: string }>(
    `${BASE_URL}/requests`
  );
  if (!res.success || !res.data) {
    throw new Error(res.error?.message ?? "Failed to fetch requests");
  }
  return res.data;
}

export async function approveOrDenyRequest(
  payload: ApproveDenyPayload
): Promise<{ request: TimeOffRequest; syncedAt: string }> {
  const res = await fetchJson<{ request: TimeOffRequest; syncedAt: string }>(
    `${BASE_URL}/requests`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
  if (!res.success || !res.data) {
    const err = new Error(res.error?.message ?? "Failed to update request");
    (err as unknown as Record<string, unknown>).code = res.error?.code;
    throw err;
  }
  return res.data;
}
