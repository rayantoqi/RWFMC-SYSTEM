const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// بوت جاهز
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// أمر بسيط
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("Pong 🏓");
  }
});

// تسجيل الدخول من متغير بيئة
client.login(process.env.TOKEN);


// Express Server
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
