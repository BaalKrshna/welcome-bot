/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { MessageActionRow, MessageButton } = require("discord.js");
const { Embed, Command } = require("../../classes");
module.exports = class CMD extends Command {
    constructor (client) {
        super({
            name: "support",
            aliases: ["support-server"],
            memberPerms: [],
            botPerms: [],
            disabled: false,
            cooldown: 20,
            category: "Core",
        }, client);
    }

    execute ({message, args}, t) {
        //TODO: Add translation
        const embed = new Embed({
            color: "green",
            timestamp: true,
            footer: "Official Support Discord for Welcome-Bot",
        })
            .setTitle("Get Support for Welcome-Bot")
            .addField(
                "\u200b",
                `Join the support server: ${message.client.supportGuildInvite}`
            )
            .addField(
                "🔗 Links:",
                "> [GitHub](https://github.com/Welcome-Bot/welcome-bot/)\n" +
                    "> [Documentation](https://welcome-bot.github.io/docs)"
            );
        let button = new MessageButton()
            .setLabel("Join the support server")
            .setURL(message.client.supportGuildInvite)
            .setStyle("LINK");
        const row = new MessageActionRow().addComponents(button);
        message.channel.send({
            embeds: [embed],
            //ephemeral: true,
            components: [row],
        });
    }
};
