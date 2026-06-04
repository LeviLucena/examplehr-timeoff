import type { TimeOffBalance, TimeOffRequest } from "./types";

const EMPLOYEES = [
  { id: "emp-1", name: "Alice Johnson" },
  { id: "emp-2", name: "Bob Smith" },
  { id: "emp-3", name: "Carol Davis" },
];

const LOCATIONS = [
  { id: "loc-1", name: "New York" },
  { id: "loc-2", name: "London" },
  { id: "loc-3", name: "Tokyo" },
];

function generateBalances(): TimeOffBalance[] {
  const balances: TimeOffBalance[] = [];
  for (const emp of EMPLOYEES) {
    for (const loc of LOCATIONS) {
      balances.push({
        employeeId: emp.id,
        employeeName: emp.name,
        locationId: loc.id,
        locationName: loc.name,
        totalDays: 20,
        usedDays: Math.floor(Math.random() * 10),
        availableDays: 0,
        accrualDate: new Date(
          Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
        ).toISOString(),
      });
    }
    balances[balances.length - 1].accrualDate = new Date(
      Date.now() - 5000
    ).toISOString();
  }
  for (const b of balances) {
    b.availableDays = b.totalDays - b.usedDays;
  }
  return balances;
}

const balances: TimeOffBalance[] = generateBalances();
const requests: TimeOffRequest[] = [
  {
    id: "req-1",
    employeeId: "emp-1",
    employeeName: "Alice Johnson",
    locationId: "loc-1",
    locationName: "New York",
    daysRequested: 2,
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "req-2",
    employeeId: "emp-2",
    employeeName: "Bob Smith",
    locationId: "loc-2",
    locationName: "London",
    daysRequested: 3,
    status: "pending",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

let requestCounter = 3;

function shouldRandomlyFail(): boolean {
  return Math.random() < 0.1;
}

function randomDelay(): number {
  return 50 + Math.random() * 300;
}

export function getAllBalances(): Promise<{
  balances: TimeOffBalance[];
  syncedAt: string;
}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldRandomlyFail()) {
        reject(new Error("HCM batch endpoint temporarily unavailable"));
        return;
      }
      resolve({
        balances: balances.map((b) => ({ ...b })),
        syncedAt: new Date().toISOString(),
      });
    }, randomDelay());
  });
}

export function getSingleBalance(
  employeeId: string,
  locationId: string
): Promise<{ balance: TimeOffBalance; syncedAt: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldRandomlyFail()) {
        reject(
          new Error(
            JSON.stringify({
              code: "SILENT_FAILURE",
              message: "HCM did not respond",
            })
          )
        );
        return;
      }
      const balance = balances.find(
        (b) => b.employeeId === employeeId && b.locationId === locationId
      );
      if (!balance) {
        reject(
          new Error(
            JSON.stringify({
              code: "INVALID_DIMENSION",
              message: `No balance found for employee ${employeeId} at location ${locationId}`,
            })
          )
        );
        return;
      }
      resolve({
        balance: { ...balance },
        syncedAt: new Date().toISOString(),
      });
    }, randomDelay());
  });
}

export function submitTimeOffRequest(payload: {
  employeeId: string;
  locationId: string;
  daysRequested: number;
}): Promise<{ request: TimeOffRequest; syncedAt: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldRandomlyFail()) {
        reject(
          new Error(
            JSON.stringify({
              code: "SILENT_FAILURE",
              message: "HCM did not respond to request submission",
            })
          )
        );
        return;
      }

      const balanceIndex = balances.findIndex(
        (b) =>
          b.employeeId === payload.employeeId &&
          b.locationId === payload.locationId
      );
      if (balanceIndex === -1) {
        reject(
          new Error(
            JSON.stringify({
              code: "INVALID_DIMENSION",
              message: "Invalid employee/location combination",
            })
          )
        );
        return;
      }

      const balance = balances[balanceIndex];
      const conflictCheck = Math.random() < 0.05;
      if (conflictCheck || payload.daysRequested > balance.availableDays) {
        reject(
          new Error(
            JSON.stringify({
              code: "INSUFFICIENT_BALANCE",
              message: `Requested ${payload.daysRequested} days but only ${balance.availableDays} available`,
              details: {
                requested: payload.daysRequested,
                available: balance.availableDays,
              },
            })
          )
        );
        return;
      }

      const employee = EMPLOYEES.find((e) => e.id === payload.employeeId);
      const location = LOCATIONS.find((l) => l.id === payload.locationId);

      const newRequest: TimeOffRequest = {
        id: `req-${requestCounter++}`,
        employeeId: payload.employeeId,
        employeeName: employee?.name ?? "Unknown",
        locationId: payload.locationId,
        locationName: location?.name ?? "Unknown",
        daysRequested: payload.daysRequested,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      requests.push(newRequest);

      balances[balanceIndex] = {
        ...balance,
        usedDays: balance.usedDays + payload.daysRequested,
        availableDays: balance.availableDays - payload.daysRequested,
      };

      resolve({
        request: { ...newRequest },
        syncedAt: new Date().toISOString(),
      });
    }, randomDelay());
  });
}

export function getPendingRequests(): Promise<{
  requests: TimeOffRequest[];
  syncedAt: string;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        requests: requests
          .filter((r) => r.status === "pending")
          .map((r) => ({ ...r })),
        syncedAt: new Date().toISOString(),
      });
    }, randomDelay());
  });
}

export function approveDenyRequest(
  requestId: string,
  action: "approved" | "denied",
  reviewerId: string
): Promise<{ request: TimeOffRequest; syncedAt: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reqIndex = requests.findIndex((r) => r.id === requestId);
      if (reqIndex === -1) {
        reject(
          new Error(
            JSON.stringify({
              code: "INVALID_DIMENSION",
              message: "Request not found",
            })
          )
        );
        return;
      }

      if (requests[reqIndex].status !== "pending") {
        reject(
          new Error(
            JSON.stringify({
              code: "CONFLICT",
              message: `Request ${requestId} was already ${requests[reqIndex].status}`,
            })
          )
        );
        return;
      }

      requests[reqIndex] = {
        ...requests[reqIndex],
        status: action,
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerId,
      };

      if (action === "denied") {
        const balanceIndex = balances.findIndex(
          (b) =>
            b.employeeId === requests[reqIndex].employeeId &&
            b.locationId === requests[reqIndex].locationId
        );
        if (balanceIndex !== -1) {
          balances[balanceIndex] = {
            ...balances[balanceIndex],
            usedDays:
              balances[balanceIndex].usedDays -
              requests[reqIndex].daysRequested,
            availableDays:
              balances[balanceIndex].availableDays +
              requests[reqIndex].daysRequested,
          };
        }
      }

      resolve({
        request: { ...requests[reqIndex] },
        syncedAt: new Date().toISOString(),
      });
    }, randomDelay());
  });
}

export function triggerWorkAnniversaryBonus(
  employeeId: string,
  locationId: string,
  bonusDays: number = 5
): Promise<{ balance: TimeOffBalance; syncedAt: string }> {
  return new Promise((resolve) => {
    const balanceIndex = balances.findIndex(
      (b) => b.employeeId === employeeId && b.locationId === locationId
    );
    if (balanceIndex !== -1) {
      balances[balanceIndex] = {
        ...balances[balanceIndex],
        totalDays: balances[balanceIndex].totalDays + bonusDays,
        availableDays: balances[balanceIndex].availableDays + bonusDays,
        accrualDate: new Date().toISOString(),
      };
    }
    resolve({
      balance: { ...balances[balanceIndex] },
      syncedAt: new Date().toISOString(),
    });
  });
}

export function getEmployeeBalances(
  employeeId: string
): Promise<{ balances: TimeOffBalance[]; syncedAt: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        balances: balances
          .filter((b) => b.employeeId === employeeId)
          .map((b) => ({ ...b })),
        syncedAt: new Date().toISOString(),
      });
    }, randomDelay());
  });
}
