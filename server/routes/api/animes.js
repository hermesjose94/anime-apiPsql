const express = require("express");
const router = express.Router();

const AnimesService = require("../../servicies/animes");
const validation = require("../../middlewares/validatationHandler");

const {
  animeUpdateSchema,
  animeCreateSchema,
} = require("../../schemas/animes");

const animesService = new AnimesService();

router.get("/", async function (req, res, next) {
  const { tags } = req.query;

  try {
    const animes = await animesService.getAnimes({ tags });

    res.status(200).json({
      animes: animes,
      message: "Animes Listed",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/online", async function (req, res, next) {
  try {
    const animes = await animesService.getAnimesOnline("Online");

    res.status(200).json({
      animes: animes,
      message: "Animes Online Listed",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/follow/:userId", async function (req, res, next) {
  const { userId } = req.params;
  try {
    const response = await animesService.getAnimesFollow({ userId });

    res.status(200).json({
      animes: response.animes,
      follow: response.follow,
      message: "Animes Follow Listed",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:animeId", async function (req, res, next) {
  const { animeId } = req.params;

  try {
    const anime = await animesService.getAnime({ animeId });

    res.status(200).json({
      data: anime,
      message: "Anime Retrived",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:animeId/:userId", async function (req, res, next) {
  const { animeId, userId } = req.params;

  try {
    const anime = await animesService.getAnimeUser(animeId, userId);

    res.status(200).json({
      data: anime,
      message: "Anime User Retrived",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validation(animeCreateSchema), async function (
  req,
  res,
  next
) {
  const { body: anime } = req;

  try {
    const createdAnime = await animesService.createAnime({ anime });

    res.status(201).json({
      data: createdAnime,
      message: "Anime Created",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/follow/:userId/:animeId", async function (req, res, next) {
  const { animeId, userId } = req.params;

  try {
    const response = await animesService.addAnimeFollow({ userId, animeId });

    res.status(201).json({
      data: response,
      message: "Anime added your list",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/follow/:userId/:animeId", async function (req, res, next) {
  const { animeId, userId } = req.params;
  const { body: data } = req;

  try {
    const updateAnime = await animesService.updateAnimeFollow({
      animeId,
      userId,
      data,
    });

    res.status(200).json({
      data: updateAnime,
      message: "Update follow",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:animeId", validation(animeUpdateSchema), async function (
  req,
  res,
  next
) {
  const { animeId } = req.params;
  const { body: anime } = req;

  try {
    const updateAnime = await animesService.updateAnime({ animeId, anime });

    res.status(200).json({
      data: updateAnime,
      message: "Anime update",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:animeId", async function (req, res, next) {
  const { animeId } = req.params;

  try {
    const deleteAnime = await animesService.deleteAnime({ animeId });

    res.status(200).json({
      data: deleteAnime,
      message: "Anime delete",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/follow/:userId/:animeId", async function (req, res, next) {
  const { animeId, userId } = req.params;

  try {
    const deleteAnime = await animesService.deleteAnimeFollow({
      userId,
      animeId,
    });

    res.status(200).json({
      data: deleteAnime,
      message: "Anime removed list",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
