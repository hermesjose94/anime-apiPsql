const express = require("express");
const router = express.Router();

const AuthService = require("../../servicies/auth");
const authService = new AuthService();
const UserService = require("../../servicies/users");
const userService = new UserService();

// const {
//   refreshTokens,
//   clearTokens,
//   COOKIE_OPTIONS,
// } = require("../../auth/cookie");

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
      // refresh token list to manage the xsrf token
      // refreshTokens[signin.refreshToken] = signin.tokenObj.xsrfToken;

      // set cookies
      // res.cookie("refreshToken", signin.refreshToken, COOKIE_OPTIONS);
      // res.cookie("XSRF-TOKEN", signin.tokenObj.xsrfToken);
      return handleResponse(
        req,
        res,
        200,
        {
          user: signin.user,
          token: signin.token,
          // expiredAt: signin.tokenObj.expiredAt,
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
    return handleResponse(req, res, 204, null, null);
  }

  // verify xsrf token
  const xsrfToken = req.headers["x-xsrf-token"];
  console.log("xsrfToken=> ", xsrfToken);
  console.log("\n refreshToken=> ", refreshToken);

  if (
    !xsrfToken ||
    !(refreshToken in refreshTokens) ||
    refreshTokens[refreshToken] !== xsrfToken
  ) {
    return handleResponse(req, res, 401, null, null);
  }

  // verify refresh token
  authService.verifyToken(refreshToken, "", async (err, payload) => {
    if (err) {
      return handleResponse(req, res, 401, null, null);
    } else {
      console.log(payload.userId);
      const user = await userService.getUser(payload.userId);
      console.log(user);

      if (!user) {
        return handleResponse(req, res, 401, null, null);
      }

      // get basic user details
      const userObj = authService.getCleanUser(user);

      // generate access token
      const tokenObj = authService.generateToken(user);

      // refresh token list to manage the xsrf token
      refreshTokens[refreshToken] = tokenObj.xsrfToken;
      res.cookie("XSRF-TOKEN", tokenObj.xsrfToken);

      // return the token along with user details
      return handleResponse(
        req,
        res,
        200,
        {
          user: userObj,
          token: tokenObj.token,
          expiredAt: tokenObj.expiredAt,
        },
        null
      );
    }
  });
});

router.post("/logout", async function (req, res, next) {
  clearTokens(req, res);
  return handleResponse(req, res, 204);
});

module.exports = router;
