require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const fs = require("fs");
const { 
  Client, 
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");
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

  if (message.content === "!ticket-panel") {

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("create_ticket")
      .setLabel("📩 فتح تذكرة")
      .setStyle(ButtonStyle.Primary)
  );

  message.channel.send({
    content: "🎫 اضغط الزر لفتح تذكرة دعم",
    components: [row]
  });
}
  
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


client.on("interactionCreate", async (interaction) => {

  // فتح التذكرة
  if (interaction.customId === "create_ticket") {

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }
      ]
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("🔒 إغلاق التذكرة")
        .setStyle(ButtonStyle.Danger)
    );

    channel.send({
      content: `👋 أهلاً ${interaction.user}`,
      components: [row]
    });

    interaction.reply({ content: `✅ تم فتح التذكرة: ${channel}`, ephemeral: true });
  }

  // إغلاق التذكرة
  if (interaction.customId === "close_ticket") {

    await interaction.reply("🔒 سيتم الإغلاق...");

    setTimeout(() => {
      interaction.channel.delete();
    }, 3000);
  }

});
// ===== LOGIN =====
client.login(process.env.TOKEN);
