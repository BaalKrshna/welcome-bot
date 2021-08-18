/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
//eslint-disable-next-line no-unused-vars
const { Embed, Command } = require("../../classes");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "djsdocs",
                aliases: ["djs"],
                memberPerms: [],
                botPerms: [],
                requirements: {
                    args: true,
                },
                disabled: false,
                cooldown: 10,
                category: "General",
                slash: false,
                options: [
                    {
                        name: "Query",
                        description: "Search query",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "source",
                        description: "Source to use, default: stable",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            client
        );
        this.VALID_SOURCES = ["stable", "master", "commando", "rpc", "akairo-master", "collection"];
    }

    //eslint-disable-next-line no-unused-vars
    async execute({ message, args }, t) {
        let query = args.join(" ");
        let source = "stable";
        let index = null;
        if (args.find(arg => arg === "--source")) index = args.indexOf(args.find(arg => arg === "--source")) ?? null;
        if (index) {
            if (args[index + 1] && typeof args[index + 1] === "string") source = args[index + 1];
            query = query.replace(args[index], "");
        }
        if (!this.VALID_SOURCES.includes(source) && isNaN(parseInt(source)) {
            source = "stable";
        }
        query = query.replace(source, "");
        const queryParams = new URLSearchParams({ src: source, q: query });
        const json = await this.fetchJson(`https://djsdocs.sorta.moe/v2/embed?${queryParams}`);
        message.channel.send({
            embeds: [json],
        });
    }

    //eslint-disable-next-line no-unused-vars
    run({ interaction }, t) {
        condt query = interaction.options.getString("query");
        let source = interaction.options.getString("source") ?? null;
        if (!this.VALID_SOURCES.includes(source) && isNaN(parseInt(source)) {
            source = "stable";
        }
        const queryParams = new URLSearchParams({ src: source, q: query });
        const json = await this.fetchJson(`https://djsdocs.sorta.moe/v2/embed?${queryParams}`);
        interaction.editReply({
            embeds: [json],
        });
    }
};
