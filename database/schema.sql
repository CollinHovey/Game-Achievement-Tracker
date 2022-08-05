set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL,
	"password" TEXT NOT NULL,
  "email" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "posts" (
	"postId" serial NOT NULL,
	"topic" TEXT NOT NULL,
	"caption" TEXT NOT NULL,
	"userId" int NOT NULL,
	"datecreated" timestamp with time zone NOT NULL,
	CONSTRAINT "posts_pk" PRIMARY KEY ("postId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "comments" (
	"commentId" serial NOT NULL,
	"userId" int NOT NULL,
	"postId" int NOT NULL,
	"comment" TEXT NOT NULL,
	CONSTRAINT "comments_pk" PRIMARY KEY ("commentId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "games" (
	"gameId" serial NOT NULL,
	"gameName" TEXT NOT NULL,
	"userId" int NOT NULL,
	"dateCreated" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "games_pk" PRIMARY KEY ("gameId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "achievements" (
	"achievementId" serial NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"gameId" int NOT NULL,
	"dateCreated" TIMESTAMP NOT NULL,
	CONSTRAINT "achievements_pk" PRIMARY KEY ("achievementId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "friends" (
	"friendId" serial NOT NULL,
	"user1Id" int NOT NULL,
	"user2Id" int NOT NULL,
	"isActive" int NOT NULL,
	CONSTRAINT "friends_pk" PRIMARY KEY ("friendId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "friendRequests" (
	"requestId" serial NOT NULL,
	"userSend" int NOT NULL,
	"userRecieve" int NOT NULL,
	"isActive" int NOT NULL,
	CONSTRAINT "friendRequests_pk" PRIMARY KEY ("requestId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "likes" (
	"userId" int NOT NULL,
	"postId" int NOT NULL,
	CONSTRAINT "likes_pk" PRIMARY KEY ("userId","postId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "comments" ADD CONSTRAINT "comments_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("postId");

ALTER TABLE "games" ADD CONSTRAINT "games_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "achievements" ADD CONSTRAINT "achievements_fk0" FOREIGN KEY ("gameId") REFERENCES "games"("gameId");

ALTER TABLE "friends" ADD CONSTRAINT "friends_fk0" FOREIGN KEY ("user1Id") REFERENCES "users"("userId");
ALTER TABLE "friends" ADD CONSTRAINT "friends_fk1" FOREIGN KEY ("user2Id") REFERENCES "users"("userId");

ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_fk0" FOREIGN KEY ("userSend") REFERENCES "users"("userId");
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_fk1" FOREIGN KEY ("userRecieve") REFERENCES "users"("userId");

ALTER TABLE "likes" ADD CONSTRAINT "likes_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("postId");
