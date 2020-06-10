const conexion = require("../lib/pgsql");

class AnimesService {
  constructor() {
    this.conexion = conexion;
  }

  //---------------- CRUD ANIME

  async getAnimes() {
    const animes = await this.conexion.query(`select * from animes`);
    animes.rows.sort(function (a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return Promise.resolve(animes.rows);
  }

  async getAnime({ animeId }) {
    const anime = await this.conexion.query(
      `select * from animes where id = $1`,
      [animeId]
    );

    const follows = await this.conexion.query(
      `select * from "userAnimes" where users_id = 1 and animes_id = $1`,
      [animeId]
    );
    let follow = false;
    let episode = 0;
    if (follows.rows.length > 0) {
      follow = true;
      episode = follows.rows[0].episode;
    }
    const json = {
      anime: anime.rows[0],
      follow: {
        status: follow,
        episode: episode,
      },
    };

    return Promise.resolve(json);
  }

  async createAnime({ anime }) {
    const {
      name,
      episode,
      date,
      station,
      cover,
      description,
      source,
      status,
      season,
      premiere,
    } = anime;
    const result = await this.conexion.query(
      `insert into animes
      (name, episode, date, station, cover, description, source, status, season,premiere)
      values
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        name,
        episode,
        date,
        station,
        cover,
        description,
        source,
        status,
        season,
        premiere,
      ]
    );
    return Promise.resolve(result.message);
  }

  async updateAnime({ animeId, anime }) {
    const {
      name,
      episode,
      date,
      station,
      cover,
      description,
      source,
      status,
      season,
      premiere,
    } = anime;

    const result = await this.conexion.query(
      `UPDATE animes SET
       name=$1, episode=$2, date=$3, station=$4, cover=$5, description=$6, source=$7, status=$8, season=$9, premiere=$10
       WHERE id = $11`,
      [
        name,
        episode,
        date,
        station,
        cover,
        description,
        source,
        status,
        season,
        premiere,
        animeId,
      ]
    );
    return Promise.resolve(result.message);
  }

  async deleteAnime({ animeId }) {
    const result = conexion.query(
      `delete from animes
          where id = $1`,
      [animeId]
    );
    return Promise.resolve(result.message);
  }

  //----------------CRUD ANIME FOLLOW

  async getAnimesFollow({ userId }) {
    const animes = await await this.conexion.query(
      `select 
      animes.id as id,
      name,
      animes.episode as episode,
      date,
      station,
      cover,
      description,
      source,
      status,
      season,
      premiere,
      "userAnimes".episode  as episodeFollow
      from animes 
      inner join "userAnimes" 
      on (animes.id = "userAnimes".animes_id and "userAnimes".users_id = $1 ) 
      order by name asc`,
      [userId]
    );

    let json;

    if (animes.rows.length > 0) {
      let week = {};
      animes.rows.forEach((anime) => {
        if (anime.status !== "Finalizado") {
          if (!week.hasOwnProperty(anime.premiere)) {
            week[anime.premiere] = [];
          }
          week[anime.premiere].push(anime);
        } else {
          if (!week.hasOwnProperty("Finalizados")) {
            week["Finalizados"] = [];
          }
          week["Finalizados"].push(anime);
        }
      });

      json = {
        animes: week,
        follow: true,
      };
    } else {
      let animesAll = {};
      animesAll = await this.getAnimes();
      json = {
        animes: animesAll,
        follow: false,
      };
    }

    return Promise.resolve(json);
  }

  async addAnimeFollow({ userId, animeId }) {
    const result = await this.conexion.query(
      `insert into "userAnimes" (users_id, animes_id) values ($1, $2)`,
      [userId, animeId]
    );

    return Promise.resolve(result.message);
  }

  async updateAnimeFollow({ userId, animeId, data }) {
    const { episode } = data;

    const follows = await this.conexion.query(
      `select * from "userAnimes" where users_id = $1 and animes_id = $2`,
      [userId, animeId]
    );

    const result = await this.conexion.query(
      `UPDATE "userAnimes" SET
      episode=$1
      WHERE id = $2`,
      [episode, follows.rows[0].id]
    );

    return Promise.resolve(result.message);
  }

  async deleteAnimeFollow({ userId, animeId }) {
    const result = conexion.query(
      `delete from "userAnimes"
          where users_id = $1 and animes_id = $2`,
      [userId, animeId]
    );

    return Promise.resolve(result.message);
  }
}

module.exports = AnimesService;
