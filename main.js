require('dotenv').config()
const Telegraf = require("telegraf");
const low = require("lowdb");
const characters = require("./characters.json");
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

bot.command("rotations", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/ji2jwd/genshin_impact_guide_album_v04/)`;
  ctx.replyWithPhoto("https://i.imgur.com/b76dEGS.png", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("respawn", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/ji3uhp/updated_respawns_infographic/)`;
  ctx.replyWithPhoto("https://i.imgur.com/xGupAcE.png", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("materialRoutes", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/j9q810/i_made_a_little_character_ascension_material)`;
  ctx.replyWithPhoto("https://i.imgur.com/udQD7pD.jpeg", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("weapons", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/jf8ed6/table_of_weapon_types_and_character_elements/)`;
  ctx.replyWithPhoto("https://i.imgur.com/sa9CFDw.png", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("charExp", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/j9942t/exp_requirements_per_ascensionphase/)`;
  ctx.replyWithPhoto("https://i.imgur.com/gE0YL3Q.png", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("talentCost", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/jf8awf/talent_ascension_grind_cheat_sheet/)`;
  ctx.replyWithPhoto("https://i.imgur.com/m87oXqx.jpeg", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("talentCost2", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/jhtnni/table_of_material_types_for_leveling_6_talents/)`;
  ctx.replyWithPhoto("https://i.imgur.com/g3NAhtf.png", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("dishes", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/jcxkwo/i_created_a_spreadsheet_to_visualize_all/g949miw/)`;
  ctx.replyWithPhoto("https://i.imgur.com/MZjSvex.jpeg", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("artifactStats", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/jcz6rg/artifact_stats_handbook/)`;
  ctx.replyWithPhoto("https://i.imgur.com/9DcOeYb.png", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("reactions", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/j9qevf/guide_how_stats_work_and_why_you_shouldnt_only/)`;
  ctx.replyWithPhoto("https://i.imgur.com/eBaGQdl.png", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("mobs", ctx => {
  const text = `[Source](https://www.reddit.com/r/Genshin_Impact/comments/j6yngs/another_mob_map_gallery/g84gj8l/)`;
  ctx.replyWithPhoto("https://i.imgur.com/qM4WwG9.jpeg", {
    caption: text,
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

bot.command("ascensionItems", ctx => {
  const text = `[Biiiig image ⚓️](https://i.imgur.com/2utiAJY.jpeg)`;
  ctx.reply(text, {
    parse_mode: "markdown",
    reply_to_message_id: ctx.update.message.message_id
  });
});

for (const char of characters) {
  bot.command(char.key, ctx => {
    const text = 
`[${char.name}](${char.page})`;

    if (!char.image) {
      return ctx.reply(text, {
        parse_mode: "markdown",
        reply_to_message_id: ctx.update.message.message_id
      });
    }

    return ctx.replyWithPhoto(char.image, {
      caption: text,
      parse_mode: "markdown",
      reply_to_message_id: ctx.update.message.message_id
    });
  })
}

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
