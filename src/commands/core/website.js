/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { MessageActionRow, MessageButton } = require("discord.js");
const { Embed, Command } = require("../../classes");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "website",
                aliases: ["site"],
                memberPerms: [],
                botPerms: [],
                disabled: false,
                cooldown: 10,
                category: "Core",
            },
            client
        );
    }

    execute({ message }, t) {
        //TODO: Add translation
        const embed = new Embed({
            color: "green",
            timestamp: true,
            footer: "Official Website of Welcome-Bot",
        }).setDesc(`Here's it: ${this.client.config.site}`);
        const button = new MessageButton()
            .setLabel("Website")
            .setURL(this.client.config.site)
            .setStyle("LINK");
        const row = new MessageActionRow().addComponents(button);
        message.channel.send({
            embeds: [embed],
            //ephemeral: true,
            components: [row],
        });
    }
};
