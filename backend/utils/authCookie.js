const baseOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
};

export const authCookieOptions = () => ({
  ...baseOptions(),
  maxAge: 24 * 60 * 60 * 1000,
});

export const clearAuthCookieOptions = () => baseOptions();
