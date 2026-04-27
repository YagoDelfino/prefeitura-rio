const AUTH_TOKEN_COOKIE_NAME = "pf_rio_token";

async function verifyAuthToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/auth/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

function getCookieValue(cookieString: string | undefined, cookieName: string): string | null {
  if (!cookieString) {
    return null;
  }

  const cookieEntry = cookieString
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${cookieName}=`));

  if (!cookieEntry) {
    return null;
  }

  return decodeURIComponent(cookieEntry.slice(cookieName.length + 1));
}

function getBrowserAuthToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  return getCookieValue(document.cookie, AUTH_TOKEN_COOKIE_NAME);
}

function buildAuthTokenCookie(token: string): string {
  const cookieParts = [
    `${AUTH_TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "SameSite=Lax",
  ];

  return cookieParts.join("; ");
}

function clearAuthTokenCookie(): string {
  return `${AUTH_TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export {
  AUTH_TOKEN_COOKIE_NAME,
  buildAuthTokenCookie,
  clearAuthTokenCookie,
  getBrowserAuthToken,
  getCookieValue,
  verifyAuthToken,
};
