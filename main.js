require('dotenv').config()
const Telegraf = require("telegraf");
const low = require("lowdb");
const got = require("got");
const stripHtml = require("string-strip-html");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({
  supports: {
    na: {},
    eu: {},
    sea: {},
    cn: {},
  },
}).write();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch(err => {
  console.error("[Exception]", err);
});

bot.use((ctx, next) => {
  try {
    if (ctx.update.inline_query && ctx.update.inline_query.query) {
      const { inline_query } = ctx.update;
      const name = inline_query.from.username
        ? `@${inline_query.from.username}`
        : inline_query.from.first_name;
      console.info("[inline]", name, inline_query.query);
    }

    if (
      ctx.update.message &&
      ctx.update.message.text &&
      ctx.update.message.text[0] === "/"
    ) {
      const { message } = ctx.update;
      const maybeTitle =
        message.chat.type === "group" || message.chat.type === "supergroup"
          ? message.chat.username
            ? `[@${message.chat.username}]`
            : `[${message.chat.title}]`
          : "";
      const name = message.from.username
        ? `@${message.from.username}`
        : message.from.first_name;
      console.info("[command]", ...[maybeTitle], name, message.text);
    }
  } catch (err) {
    console.error(err);
  }

  return next();
});

bot.command("start", ctx => {
  ctx.reply(
    `Genshin Impact Utility Bot.
  
Run /help to learn how to use.`,
    {
      reply_to_message_id: ctx.update.message.message_id
    }
  );
});

bot.command("help", ctx => {
  const text = `
*Friend code*

/friendna - Show or update NA friend code
/friendeu - Show or update EU friend code
/friendsea - Show or update SEA friend code
/friendcn - Show or update CN friend code
/friend - Learn how to update friend code

*Support*

[Call senpai](https://t.me/lubien)
`;

  ctx.replyWithMarkdown(text, {
    reply_to_message_id: ctx.update.message.message_id
  });
});

function supportCommandFactory(server) {
  return ctx => {
    const { reply_to_message } = ctx.update.message;

    const userId = ctx.update.message.from.id;
    const key = `supports.${server}.${userId}`;
    const support = db.get(key).value() || {
      file_id: undefined,
      code: undefined
    };

    // Update Code
    const { text } = ctx.update.message;
    const [, ...argsArr] = text.trim().split(" ");
    const code = argsArr.join(" ");

    if (code.length) {
      db.set(key, {
        ...support,
        code
      }).write();

      return ctx.reply(`Updated friend code`, {
        reply_to_message_id: ctx.update.message.message_id
      });
    }

    // Show support
    if (!reply_to_message) {
      if (!support || !support.file_id) {
        return ctx.replyWithMarkdown(
          `No ${server.toUpperCase()} friend code. Use /friend to learn how to setup`
        );
      }

      return ctx.replyWithPhoto(support.file_id, {
        caption: support.code || `No ${server.toUpperCase()} friend code`,
        parse_mode: "markdown",
        reply_to_message_id: ctx.update.message.message_id
      });
    }

    // Update photo
    const photos = reply_to_message.photo;
    const photo = Array.isArray(photos) ? photos[photos.length - 1] : photos;
    const hasPhotos = Boolean(photo);

    if (!hasPhotos) {
      return ctx.reply(`Reply to a photo`, {
        reply_to_message_id: ctx.update.message.message_id
      });
    }

    db.set(key, {
      ...support,
      file_id: photo.file_id
    }).write();

    return ctx.replyWithMarkdown(`Updated ${server.toUpperCase()} support`, {
      reply_to_message_id: ctx.update.message.message_id
    });
  };
}

bot.command("friendna", supportCommandFactory("na"));
bot.command("friendeu", supportCommandFactory("eu"));
bot.command("friendsea", supportCommandFactory("sea"));
bot.command("friendcn", supportCommandFactory("cn"));

bot.command("friend", ctx => {
  const text = `*Servers:*

/friendna - Show or update NA support
/friendeu - Show or update EU support
/friendsea - Show or update SEA support
/friendcn - Show or update CN support`;

  ctx.replyWithDocument(
    "https://github.com/lubien/imgur/blob/master/bbchanne-support.gif?raw=true",
    {
      caption: text,
      parse_mode: "markdown",
      reply_to_message_id: ctx.update.message.message_id
    }
  );
});

bot.launch();
