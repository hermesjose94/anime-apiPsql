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
  const result = await authService.verifyToken(req.body, req.query);

  if (result.error) {
    return handleResponse(
      req,
      res,
      parseInt(result.error),
      null,
      result.message
    );
  } else {
    return handleResponse(
      req,
      res,
      200,
      {
        user: result.user,
        token: result.token,
      },
      null
    );
  }
});

router.post("/logout", async function (req, res, next) {
  // clearTokens(req, res);
  return handleResponse(req, res, 204);
});

module.exports = router;
