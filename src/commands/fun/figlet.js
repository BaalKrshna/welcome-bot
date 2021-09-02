/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { Embed, Command } = require("../../classes");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "figlet",
                aliases: ["asciify", "bigtext"],
                memberPerms: [],
                botPerms: [],
                requirements: {
                    args: true,
                },
                disabled: false,
                cooldown: 5,
                category: "Fun",
            },
            client
        );
    }

    async execute({ message, args }, t) {
        const figlet = require("figlet");
        const figletAsync = require("util").promisify(figlet);
        const text = args.join(" ");
        if (text.length > 20) {
            return message.channel.send(t("cmds:figlet.error"));
        }
        const result = await figletAsync(text);
        message.reply("```" + result + "```");
    }
};
