/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
require("dotenv").config();
const WelcomeBot = require("./WelcomeBot");
const { Embed } = require("./classes");

const client = new WelcomeBot({
    debug: process.env.NODE_ENV === "development",
});

require("./db/connection");
const getGuild = require("./db/functions/guild/getGuild");
const dbAuditor = require("./db/functions/dbAuditor");

process.env.userAgent = "Discord Welcome-Bot " + client.package.version;
process.on("unhandledRejection", (error) => {
    if (
        error.toString().indexOf("No guild with guild ID") !== -1 &&
        client &&
        dbAuditor
    ) {
        dbAuditor(client);
    } else {
        client.logger.log("Unhandled promise rejection", "error");
        console.error(error);
        const channel =
            client.channels.cache.get(client.config?.errorLogsChannelId) ??
            null;
        if (channel) channel.send(`${error}`).catch(() => {});
    }
});
process.on("exit", (code) => {
    client.destroy();
});

const getT = async (guildId) => {
    const guildDB = await getGuild(guildId);
    return client.i18next.getFixedT(guildDB.lang || "en-US");
};

let embed = new Embed({ color: "success" });
client.player
    .on("trackAdd", async (queue, track) => {
        embed = new Embed({ color: "success" });
        const t = await getT(queue.metadata.guild.id);
        embed
            .setTitle(`🎶 | ${t("cmds:play.queueAdded")}`)
            .setDescription(track.title)
            .setImage(track.thumbnail);
        queue.metadata.channel.send({ embeds: [embed] });
    })
    .on("trackStart", async (queue, track) => {
        embed = new Embed({ color: "success" });
        const t = await getT(queue.metadata.guild.id);
        embed
            .setTitle(`🥁 | ${t("cmds:play.starting")}`)
            .setDescription(track.title)
            .setImage(track.thumbnail);
        queue.metadata.channel.send({ embeds: [embed] });
    })
    .on("playlistStart", async (queue, playlist, track) => {
        embed = new Embed({ color: "blue" });
        const t = await getT(queue.metadata.guild.id);
        embed.setTitle(
            t("cmds.play.playlistStart", {
                playlistTitle: playlist.title,
                songName: track.title,
            })
        );
        queue.metadata.channel.send({ embeds: [embed] });
    })
    .on("playlistAdd", async (queue, playlist) => {
        embed = new Embed({ color: "blue" });
        const t = await getT(queue.metadata.guild.id);
        embed.setTitle(
            t("cmds.play.queueAddCount", {
                songCount: playlist.items.length,
            })
        );
        queue.metadata.channel.send({ embeds: [embed] });
    })
    .on("debug", (queue, message) => {
        if (client.debug) client.logger.log(message, "debug", ["VOICE"]);
    })
    .on("botDisconnect", async (queue) => {
        const t = await getT(queue.metadata.guild.id);
        queue.metadata.channel.send(t("cmds:play.botDisconnected"));
    })
    .on("noResults", async (queue) => {
        const t = await getT(queue.metadata.guild.id);
        queue.metadata.channel.send(t("cmds:play.noResults"));
    })
    .on("queueEnd", async (queue) => {
        const t = await getT(queue.metadata.guild.id);
        queue.metadata.channel.send(t("cmds:play.queueEnd"));
    })
    .on("channelEmpty", () => {
        // do nothing, leaveOnEmpty is not enabled
    })
    .on("connectionCreate", (queue, connection) => {
        if (client.debug)
            client.logger.log("Joined voice channel", "debug", ["VOICE"]);
    })
    .on("connectionError", (queue, err) => {
        client.logger.log("Connection Error:", "error", ["VOICE"]);
        console.log(err);
    })
    .on("error", async (queue, error) => {
        const t = await getT(queue.metadata.guild.id);
        switch (error.message.replace("Error:", "").trim()) {
            case "Status Code: 429":
                queue.metadata.reply(t("cmds:play.rateLimited"));
                break;
            case "Status Code: 403":
                queue.metadata.reply(t("cmds:play.forbidden"));
                break;
            case "Cannot use destroyed queue":
                queue.metadata.reply(t("cmds:play.destroyedQueue"));
                break;
            default:
                queue.metadata.reply(
                    t("cmds:play.errorOccurred", { error: error.message })
                );
                break;
        }
    });

// Login
client.login(process.env.DISCORD_TOKEN);
