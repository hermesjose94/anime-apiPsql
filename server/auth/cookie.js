const dev = process.env.NODE_ENV !== "production";

// refresh token list to manage the xsrf token
const refreshTokens = {};

// cookie options to create refresh token
const COOKIE_OPTIONS = {
  // domain: "localhost",
  httpOnly: true,
  secure: !dev,
  signed: true,
};

// clear tokens from cookie
function clearTokens(req, res) {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  delete refreshTokens[refreshToken];
  res.clearCookie("XSRF-TOKEN");
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
}

module.exports = { dev, refreshTokens, clearTokens, COOKIE_OPTIONS };
