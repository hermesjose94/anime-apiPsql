const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

    const u = this.getCleanUser(user);

    return jwt.sign(u, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24, // expires in 24 hours
    });
  }

  getCleanUser(user) {
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
  }

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
  }

  async verifyToken(body, query) {
    // check header or url parameters or post parameters for token
    var token = body.token || query.token;

    if (!token) {
      return { error: 404, message: "Token requerido." };
    }
    try {
      var decode = jwt.verify(token, process.env.JWT_SECRET);
      const User = await userService.getUserName(decode.username);
      // return 401 status if the userId does not match.
      if (!User) {
        return { error: 401, message: "Usuario Invalido." };
      }
      const userClean = this.getCleanUser(User);
      return { error: false, user: userClean, token: token };
    } catch (error) {
      return { error: 401, message: "Token Invalido." };
    }
  }
}

module.exports = AuthService;
