const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const randtoken = require("rand-token");
const ms = require("ms");
// const conexion = require("../lib/pgsql");
const UserService = require("./users");
const userService = new UserService();

class AuthService {
  constructor() {
    this.userService = userService;
  }

  generateToken(user) {
    //1. Don't use password and other sensitive fields
    //2. Use the information that are useful in other parts
    if (!user) return null;

    const u = {
      userId: user.id,
      name: user.name,
      username: user.username,
      // isAdmin: user.isAdmin,
      email: user.email,
    };

    return jwt.sign(u, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24, // expires in 24 hours
    });

    // generat xsrf token and use it to generate access token
    // const xsrfToken = randtoken.generate(24);

    // create private key by combining JWT secret and xsrf token
    // const privateKey = process.env.JWT_SECRET + xsrfToken;

    // generate access token and expiry date
    // const token = jwt.sign(u, privateKey, {
    //   expiresIn: process.env.ACCESS_TOKEN_LIFE,
    // });

    // expiry time of the access token
    // const expiredAt = moment()
    //   .add(ms(process.env.ACCESS_TOKEN_LIFE), "ms")
    //   .valueOf();

    // return {
    //   token,
    //   expiredAt,
    //   xsrfToken,
    // };
  }

  getCleanUser(user) {
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      //   isAdmin: user.isAdmin,
      email: user.email,
    };
  }

  // generateRefreshToken(userId) {
  //   if (!userId) return null;

  //   return jwt.sign({ userId }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.REFRESH_TOKEN_LIFE,
  //   });
  // }

  // verify access token and refresh token
  // verifyToken(token, xsrfToken = "", cb) {
  //   const privateKey = process.env.JWT_SECRET + xsrfToken;
  //   jwt.verify(token, privateKey, cb);
  // }

  async signIn({ data }) {
    const { username, password } = data;

    if (!username || !password) {
      return { error: 400, message: "Usuario y contraseña requerida." };
    }

    const user = await userService.getUserName(username);

    if (!user) {
      return { error: 401, message: "Usuario o contraseña invalido." };
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return { error: 401, message: "Usuario o contraseña invalido." };
    }

    const token = this.generateToken(user);
    const userClean = this.getCleanUser(user);

    return {
      user: userClean,
      token: token,
    };

    // // get basic user details
    // const userObj = this.getCleanUser(user);

    // // generate access token
    // const tokenObj = this.generateToken(user);

    // // generate refresh token
    // const refreshToken = this.generateRefreshToken(userObj.id);

    // return {
    //   user: userObj,
    //   tokenObj: tokenObj,
    //   refreshToken: refreshToken,
    // };
  }
}

module.exports = AuthService;
