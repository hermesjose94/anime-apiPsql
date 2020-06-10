const conexion = require("../lib/pgsql");
const bcrypt = require("bcrypt");

class UsersService {
  constructor() {
    this.conexion = conexion;
  }

  //------------------------- CRUD USERS

  async getUsers() {
    const users = await this.conexion.query(
      `select * from users order by name ASC`
    );

    return Promise.resolve(users.rows);
  }

  async getUserName(userName) {
    const user = await this.conexion.query(
      `select * from users where username = $1`,
      [userName]
    );

    return Promise.resolve(user.rows[0]);
  }

  async getUser(userId) {
    const user = await this.conexion.query(
      `select * from users where id = $1`,
      [userId]
    );

    return Promise.resolve(user.rows[0]);
  }

  async createUser({ user }) {
    const { name, avatar, username, email, password } = user;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.conexion.query(
      `insert into users
        (name, avatar, username, email, password)
        values
        ($1, $2, $3, $4, $5)`,
      [name, avatar, username, email, hashedPassword]
    );

    return Promise.resolve(result.message);
  }

  async updateUser({ userId, user }) {
    const { name, avatar, username, email, password } = user;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.conexion.query(
      `UPDATE users SET
        name=$1, avatar=$2, username=$3, email=$4, password=$5
        WHERE id = $6`,
      [name, avatar, username, email, hashedPassword, userId]
    );

    return Promise.resolve(result.message);
  }

  async deleteUser({ userId }) {
    const result = conexion.query(`delete from users where id = $1`, [userId]);

    return Promise.resolve(result.message);
  }
}

module.exports = UsersService;
