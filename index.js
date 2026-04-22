require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ===== EXPRESS SERVER =====
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running 24/7 🚀");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});

// ===== LOAD DATA =====
let db = {};
if (fs.existsSync("./data.json")) {
  db = JSON.parse(fs.readFileSync("./data.json"));
}

// ===== READY =====
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ===== PREFIX COMMANDS =====
const prefix = process.env.PREFIX || "!";

client.on("messageCreate", message => {
  if (message.author.bot) return;

  // Anti Spam بسيط
  if (!db[message.author.id]) db[message.author.id] = { xp: 0, level: 0 };
  db[message.author.id].xp += 5;

  fs.writeFileSync("./data.json", JSON.stringify(db, null, 2));

  // Commands
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(" ");
  const cmd = args.shift().toLowerCase();

  if (cmd === "ping") {
    message.reply("🏓 Pong!");
  }

  if (cmd === "system") {
    message.reply("🤖 System Bot is working!");
  }

  // Admin Example
  if (cmd === "clear") {
    if (!message.member.permissions.has("ManageMessages")) return;
    message.channel.bulkDelete(10);
    message.reply("🧹 Cleared!");
  }
});

// ===== WELCOME =====
client.on("guildMemberAdd", member => {
  const channel = member.guild.systemChannel;
  if (channel) {
    channel.send(`👋 Welcome ${member.user.tag}`);
  }
});

// ===== LOGIN =====
client.login(process.env.TOKEN);
