/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { Embed } = require("../../classes");
module.exports = {
    name: "np",
    aliases: ["now-playing"],
    //description: "The details of song which is being played now",
    guildOnly: true,
    cooldown: 5,
    category: "Music",
    execute(message, args, guildDB, t) {
        const queue = message.client.player.getQueue(message.guild);
        const voice = message.member.voice.channel;
        if (!voice) return message.reply(t("cmds:play.voiceNotJoined"));
        if (!queue) return message.reply(t("cmds:stop.notPlaying"));
        const track = queue.nowPlaying();
        const progress = queue.createProgressBar().split(" ┃ ");
        let embed = new Embed({ color: "blue", timestamp: true })
            .setTitle(t("cmds:np.playing"))
            .setDescription(track.title)
            .setImage(track.thumbnail)
            .addField(
                "Details",
                "> " +
                    t("cmds:play.details", {
                        source: track.source,
                        link: `[${track.url.slice(0, 35)}...](${track.url})`,
                        views: `${track.views}`,
                        duration: track.duration,
                        progress: `${progress[0]} | ${progress[2]}\n${progress[1]}`,
                    })
                        .split("\n")
                        .join("\n> ")
            );
        message.channel.send({ embeds: [embed] });
    },
};
