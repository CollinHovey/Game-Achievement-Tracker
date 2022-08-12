require('dotenv/config');
const authorizationMiddleware = require('./authorization-middleware');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const pg = require('pg');
const path = require('path');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
} else {
  app.use(express.static(publicPath));
}

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.post('/api/users/signIn', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  const sql = `
  select "userId",
         "password"
    from "users"
    where "username" = $1;
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, password: hashedPassword } = user;
      // console.log(user);
      // console.log('hashedpassword', hashedPassword, 'userId', userId);
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          // console.log('ismatching?', isMatching);
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.post('/api/users/signUp', (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    throw new ClientError(400, 'username, password, and email are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "password", "email")
        values ($1, $2, $3)
        `;
      const params = [username, hashedPassword, email];
      db.query(sql, params)
        .then(result => {
          const [user] = result.rows;
          res.status(201).json(user);
        })
        .catch(err => next(err));
    });
});

app.use(authorizationMiddleware);

app.get('/api/achievements', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
  select "g"."gameId",
         "g"."gameName",
         "g"."dateCreated" as "gameDate",
         "a"."achievementId",
         "a"."name" as "achievementName",
         "a"."description" as "achievementDescription",
         "a"."dateCreated" as "achievementDate"
    from "games" as "g"
    left join "achievements" as "a" on "g"."gameId" = "a"."gameId"
    where "g"."userId" = $1
    group by "g"."gameId", "a"."achievementId"
    order by "g"."dateCreated"
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      const allData = result.rows;
      const games = [];
      const gameIds = [];
      for (let x = 0; x < allData.length; x++) {
        if (!gameIds.includes(allData[x].gameId)) {
          const newGame = {
            gameId: allData[x].gameId,
            gameName: allData[x].gameName,
            gameDate: allData[x].gameDate,
            achievements: []
          };
          games.unshift(newGame);
          gameIds.push(allData[x].gameId);
        }
        if (allData[x].achievementId !== null) {
          const newAchievement = {
            achievementId: allData[x].achievementId,
            achievementName: allData[x].achievementName,
            achievementDescription: allData[x].achievementDescription,
            achievementDate: allData[x].achievementDate
          };
          games[0].achievements.push(newAchievement);
        }
      }
      res.json(games);
    })
    .catch(err => next(err));
});

app.post('/api/games', (req, res, next) => {
  const { userId } = req.user;
  const { game } = req.body;
  const params = [game, userId];
  const sql = `
  insert into "games" ("gameName", "userId")
  values ($1, $2)
  returning *
  `;
  db.query(sql, params)
    .then(result => {
      const game = result.rows[0];
      const newGame = {
        gameId: game.gameId,
        gameName: game.gameName,
        gameDate: game.dateCreated
      };
      res.json(newGame);
    })
    .catch(err => next(err));
});

app.patch('/api/games', (req, res, next) => {
  const { userId } = req.user;
  const { game, gameId } = req.body;
  const params = [game, gameId, userId];
  const sql = `
  update "games"
     set "gameName" = $1
     where "userId" = $3
     and "gameId" = $2
     returning *
  `;
  db.query(sql, params)
    .then(result => {
      const game = result.rows[0];
      const newGame = {
        gameName: game.gameName
      };
      res.json(newGame);
    })
    .catch(err => next(err));
});

app.post('/api/achievements', (req, res, next) => {
  const { achName, achDetails, gameId } = req.body;
  const params = [achName, achDetails, gameId];
  const sql = `
  insert into "achievements" ("name", "description", "gameId")
  values ($1, $2, $3)
  returning *
  `;
  db.query(sql, params)
    .then(result => {
      const newAch = result.rows[0];
      res.json(newAch);
    })
    .catch(err => next(err));
});

app.patch('/api/achievements', (req, res, next) => {
  const { achName, achDetails, gameId, achievementId } = req.body;
  const params = [achName, achDetails, gameId, achievementId];
  const sql = `
  update "achievements"
     set "name" = $1,
         "description" = $2
     where "achievementId" = $4
     and "gameId" = $3
  returning *
  `;
  db.query(sql, params)
    .then(result => {
      const newAch = result.rows[0];
      res.json(newAch);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
