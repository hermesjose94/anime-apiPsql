const express = require("express");
const router = express.Router();

const UsersService = require("../../servicies/users");
const validation = require("../../middlewares/validatationHandler");
const authMiddleware = require("../../middlewares/auth");

const { userCreateSchema, userUpdateSchema } = require("../../schemas/users");

const usersService = new UsersService();

router.get("/", async function (req, res, next) {
  const { tags } = req.query;

  try {
    const users = await usersService.getUsers();

    res.status(200).json({
      users: users,
      message: "Users Listed",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", authMiddleware, async function (req, res, next) {
  const { userId } = req.params;

  try {
    const user = await usersService.getUser(userId);

    res.status(200).json({
      data: user,
      message: "User Retrived",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validation(userCreateSchema), async function (req, res, next) {
  const { body: user } = req;

  try {
    const createdUser = await usersService.createUser({ user });

    res.status(201).json({
      data: createdUser,
      message: "User Created",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:userId", validation(userUpdateSchema), async function (
  req,
  res,
  next
) {
  const { userId } = req.params;
  const { body: user } = req;

  try {
    const updateUser = await usersService.updateUser({ userId, user });

    res.status(200).json({
      data: updateUser,
      message: "User update",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:userId", async function (req, res, next) {
  const { userId } = req.params;

  try {
    const deleteUser = await usersService.deleteUser({ userId });

    res.status(200).json({
      data: deleteUser,
      message: "User delete",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
