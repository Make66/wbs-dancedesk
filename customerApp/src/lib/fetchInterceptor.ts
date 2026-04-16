const originalFetch = window.fetch;
const authServiceURL = import.meta.env.VITE_APP_AUTH_SERVER_URL;

if (!authServiceURL) {
  console.error("No Auth service set");
}

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

  const isOwnApi = !!authServiceURL && (url.startsWith(authServiceURL) || url.startsWith("/"));

  const requestInit: RequestInit = {
    ...init,
    credentials: isOwnApi ? "include" : "omit",
  };

  let res = await originalFetch(input, requestInit);

  if (!isOwnApi) {
    return res;
  }

  const authHeader = res.headers.get("www-authenticate");

  if (authHeader?.includes("token_expired")) {
    const refreshRes = await originalFetch(`${authServiceURL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Login required");
    }

    res = await originalFetch(input, requestInit);
  }

  return res;
};

export { authServiceURL };
