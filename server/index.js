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
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

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
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
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

app.get('/api/posts', (req, res, next) => {
  const sql = `
  select "p"."postId",
         "p"."topic",
         "p"."caption",
         "p"."userId",
         (select "username" from "users" where "userId" = "p"."userId"),
         "p"."datecreated",
         count("l"."userId") as "likes"
    from "posts" as "p"
    left join "likes" as "l" using("postId")
    group by "p"."postId"
    order by "p"."datecreated" desc
  `;

  db.query(sql)
    .then(result => {
      const posts = result.rows;
      res.json(posts);
    })
    .catch(err => next(err));
});

app.get('/api/visitorData/:userId', (req, res, next) => {
  const { userId } = req.params;
  const sql1 = `
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
  const sql2 = `
  select "username"
    from "users"
    where "userId" = $1
  `;
  const params = [userId];
  db.query(sql1, params)
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
      db.query(sql2, params)
        .then(result => {
          const username = result.rows[0].username;
          const newUser = {
            games,
            username
          };
          res.json(newUser);
        });
    })
    .catch(err => next(err));
});

app.get('/api/isFriend/:userId/:friendId', (req, res, next) => {
  const { userId, friendId } = req.params;
  const sql = `
  select *
    from "friends"
    where ("user1Id" = $1 or "user1Id" = $2) and ("user2Id" = $1 or "user2Id" = $2)
  `;
  const params = [userId, friendId];
  db.query(sql, params)
    .then(result => {
      let answer = { isActive: 0 };
      if (result.rows[0] !== undefined) {
        answer = result.rows[0];
      }
      res.json(answer);
    });
});

io.on('connection', socket => {
  socket.on('join room', room => {
    socket.join(`${room}`);
    socket.on('chat message', msg => {
      io.to(`${room}`).emit('broadcast message', msg);
    });
  });
  socket.on('disconnect', () => {
  });
});

app.use(authorizationMiddleware);

app.post('/api/newMessage', (req, res, next) => {
  const { message, sender, recipient, friendId } = req.body;
  const sql = `
  insert into "messages" ("message", "senderId", "recipientId", "friendId")
  values ($1, $2, $3, $4)
  returning*
  `;
  const params = [message, sender, recipient, friendId];
  db.query(sql, params)
    .then(result => {
      const newMessage = {
        message: result.rows[0].message,
        senderId: result.rows[0].senderId,
        recipient: result.rows[0].recipientId,
        friendId: result.rows[0].friendId
      };
      res.json(newMessage);
    });
});

app.get('/api/messages/:friendId', (req, res, next) => {
  const { userId } = req.user;
  const { friendId } = req.params;
  const sql = `
  select * from "messages" where "friendId" = $1 order by "messageId" desc
  `;
  const params = [friendId];
  db.query(sql, params)
    .then(result => {
      const newMessages = [];
      for (let x = 0; x < result.rows.length; x++) {
        if (result.rows[x].senderId === userId) {
          result.rows[x].status = 'sent';
          newMessages.push(result.rows[x]);
        } else {
          result.rows[x].status = 'recieved';
          newMessages.push(result.rows[x]);
        }
      }
      res.json(newMessages);
    });
});

app.delete('/api/deleteRequest/:senderId', (req, res, next) => {
  const { userId } = req.user;
  const { senderId } = req.params;
  const sql = `
  delete from "friendRequests" where "userSend" = $1 and "userRecieve" = $2 returning *
  `;
  const params = [senderId, userId];
  db.query(sql, params)
    .then(result => {
      const deletedRequest = result.rows[0];
      res.json(deletedRequest);
    });
});

app.delete('/api/removeFriend/:friendId', (req, res, next) => {
  const { friendId } = req.params;
  const sql = `
    delete from "friends" where "friendId" = $1 returning *
  `;
  const params = [friendId];
  db.query(sql, params)
    .then(result => {
      res.json(friendId);
    });
});

app.post('/api/friendAccept', (req, res, next) => {
  const { userId, username } = req.user;
  const { sendId, sendUsername } = req.body;
  const sql = `
    insert into "friends" ("user1Id", "user1name", "user2Id", "user2name")
    values ($1, $2, $3, $4)
    returning*
  `;
  const params = [userId, username, sendId, sendUsername];
  db.query(sql, params)
    .then(result => {
      const newFriend = result.rows[0];
      const sql2 = `
      delete from "friendRequests"
        where "userSend" = $1 and "userRecieve" = $2
      `;
      const params2 = [sendId, userId];
      db.query(sql2, params2)
        .then(result2 => {
          res.json(newFriend);
        });
    });
});

app.get('/api/friendRequests/:userId', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
  select "r"."userSend" as "userId",
         "users"."username"
    from "friendRequests" as "r"
    left join "users" on "r"."userSend" = "users"."userId"
    where "r"."userRecieve" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/friends/:userId', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
  select "f"."friendId",
         "f"."user1Id",
         "f"."user1name" as "user1name",
         "f"."user2Id",
         "f"."user2name" as "user2name"
  from "friends" as "f"
  where "user1Id" = $1 or "user2Id" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      const friends = result.rows;
      const newFriends = [];
      for (let x = 0; x < friends.length; x++) {
        const friendEntry = {};
        if (friends[x].user1Id === userId) {
          friendEntry.friendUserId = friends[x].user2Id;
          friendEntry.friendUsername = friends[x].user2name;
          friendEntry.friendId = friends[x].friendId;
          newFriends.push(friendEntry);
        } else {
          friendEntry.friendUserId = friends[x].user1Id;
          friendEntry.friendUsername = friends[x].user1name;
          friendEntry.friendId = friends[x].friendId;
          newFriends.push(friendEntry);
        }
      }
      res.json(newFriends);
    });
});

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

app.delete('/api/games', (req, res, next) => {
  const { game } = req.body;
  const params = [game];
  const sql1 = `
  delete from "games"
    where "gameId" = $1
    returning *
  `;
  const sql2 = `
  delete from "achievements"
    where "gameId" = $1
    returning *
  `;
  db.query(sql2, params)
    .then(result => {
      const deletedAchievements = result.rows;
      db.query(sql1, params)
        .then(result2 => {
          const deletedGame = result.rows[0];
          const data = {
            game: deletedGame,
            achievements: deletedAchievements
          };
          res.json(data);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.delete('/api/achievements', (req, res, next) => {
  const { game, achievement } = req.body;
  const params = [game, achievement];
  const sql = `
  delete from "achievements"
    where "gameId" = $1
    and "achievementId" = $2
    returning *
  `;
  db.query(sql, params)
    .then(result => {
      const deletedAch = result.rows[0];
      const data = {
        achievement: deletedAch
      };
      res.json(data);
    })
    .catch(err => next(err));
});

app.post('/api/post', (req, res, next) => {
  const { topic, detail } = req.body;
  const { userId } = req.user;
  const params = [topic, detail, userId];
  const sql = `
  insert into "posts" ("topic", "caption", "userId")
  values ($1, $2, $3)
  returning *
  `;
  db.query(sql, params)
    .then(result => {
      const newPost = result.rows[0];
      const data = {
        postId: newPost.postId,
        topic: newPost.topic,
        caption: newPost.caption,
        datecreated: newPost.datecreated,
        userId: newPost.userId
      };
      res.json(data);
    })
    .catch(err => next(err));
});

app.post('/api/addFriend', (req, res, next) => {
  const { userId } = req.user;
  const { reciever } = req.body;
  const sql = `
  insert into "friendRequests" ("userSend", "userRecieve")
  values ($1, $2)
  returning *
  `;
  const params = [userId, reciever];
  db.query(sql, params)
    .then(result => {
      const newRequest = result.rows[0];
      res.json(newRequest);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
