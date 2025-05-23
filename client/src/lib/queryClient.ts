import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_BASE_URL, getAuthHeader, logout } from "@/lib/auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Handle authentication errors specifically
    if (res.status === 401) {
      // Token might be expired, trigger logout
      logout();
    }

    try {
      const json = await res.json();
      throw new Error(json.message || res.statusText || "Unknown error");
    } catch (e) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
  }
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown | undefined,
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...getAuthHeader(),
  };
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const endpoint = queryKey[0] as string;
    const url = `${API_BASE_URL}${endpoint}`;
    
    const res = await fetch(url, {
      headers: getAuthHeader(),
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    if (res.status === 401) {
      logout();
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
      retry: 1,
      refetchOnMount: true
    },
    mutations: {
      retry: 1,
    },
  },
});
