const express = require("express");
const router = express.Router();

const AuthService = require("../../servicies/auth");
const authService = new AuthService();

const handleResponse = require("../../auth/handleResponse");

router.post("/signin", async function (req, res, next) {
  const { body: data } = req;
  try {
    const signin = await authService.signIn({ data });
    if (signin.error) {
      return handleResponse(
        req,
        res,
        parseInt(signin.error),
        null,
        signin.message
      );
    } else {
      return handleResponse(
        req,
        res,
        200,
        {
          user: signin.user,
          token: signin.token,
        },
        null
      );
    }
  } catch (error) {
    next(error);
  }
});

router.post("/verifyToken", async function (req, res, next) {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken) {
    return handleResponse(req, res, 204);
  }

  // verify xsrf token
  const xsrfToken = req.headers["x-xsrf-token"];
  if (
    !xsrfToken ||
    !(refreshToken in refreshTokens) ||
    refreshTokens[refreshToken] !== xsrfToken
  ) {
    return handleResponse(req, res, 401);
  }

  // verify refresh token
  verifyToken(refreshToken, "", (err, payload) => {
    if (err) {
      return handleResponse(req, res, 401);
    } else {
      const userData = userList.find((x) => x.userId === payload.userId);
      if (!userData) {
        return handleResponse(req, res, 401);
      }

      // get basic user details
      const userObj = getCleanUser(userData);

      // generate access token
      const tokenObj = generateToken(userData);

      // refresh token list to manage the xsrf token
      refreshTokens[refreshToken] = tokenObj.xsrfToken;
      res.cookie("XSRF-TOKEN", tokenObj.xsrfToken);

      // return the token along with user details
      return handleResponse(req, res, 200, {
        user: userObj,
        token: tokenObj.token,
        expiredAt: tokenObj.expiredAt,
      });
    }
  });
});

router.post("/logout", async function (req, res, next) {
  // clearTokens(req, res);
  return handleResponse(req, res, 204);
});

module.exports = router;
