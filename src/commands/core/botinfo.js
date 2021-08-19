/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
//eslint-disable-next-line no-unused-vars
const { Embed, Command } = require("../../classes");
const { version } = require("discord.js");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "botinfo",
                aliases: ["bi", "binfo", "info", "stats", "about"],
                memberPerms: [],
                botPerms: [],
                usage: "(--dm)",
                disabled: false,
                cooldown: 5,
                category: "Core",
            },
            client
        );
    }

    //eslint-disable-next-line no-unused-vars
    async execute({ message, args }, t) {
        //TODO: Add translation
        if (args[1]) {
            args[1] = args[1].toLowerCase();
        }
        const promises = [
            this.client.shard.fetchClientValues("guilds.cache.size"),
            this.client.shard.broadcastEval((c) =>
                c.guilds.cache.reduce(
                    (acc, guild) => acc + guild.memberCount,
                    0
                )
            ),
        ];
        const counts = await Promise.all(promises).then((results) => {
            const totalGuilds = results[0].reduce(
                (acc, guildCount) => acc + guildCount,
                0
            );
            const totalMembers = results[1].reduce(
                (acc, memberCount) => acc + memberCount,
                0
            );
            return { totalGuilds, totalMembers };
        });
        const inline = true;
        const embed = new Embed({
            color: "success",
            timestamp: true,
            footer: t("cmds:botinfo.footer"),
        })
            .setTitle(
                `${message.client.user.username} v${message.client.package.version}`
            )
            .setDescription(`${this.client.application.description}`)
            .setThumbnail("https://welcome-bot.github.io/assets/img/logo.png")
            .addField(
                `:pencil: __${t("categories:general")}__`,
                `> Servers: ${counts.totalGuilds} servers\n` +
                    `> Users: ${counts.totalMembers} users\n` +
                    `> Channels: ${message.client.channels.cache.size} channels\n` +
                    `> Version: ${message.client.package.version}\n` +
                    `> Commands: ${message.client.commands.enabled.size} commands`
            )
            .addField(
                `:gear: __${t("misc:system")}__`,
                `> ${message.client.customEmojis.nodejs} Node.js: ${process.version}\n` +
                    `> ${message.client.customEmojis.djs} Discord.js: v${version}\n` +
                    `> ${message.client.customEmojis.ram} ${t(
                        "misc:ram_used"
                    )}: \`${(
                        process.memoryUsage().heapUsed /
                        1024 /
                        1024
                    ).toFixed(2)}MB\``
            )
            .addField(
                `${message.client.customEmojis.owner} Bot owners`,
                `Welcome-Bot was created by ${message.client.ownersTags.join(
                    ", "
                )}`
            )
            .addField(
                "🧾 Bot lists:",
                "> [discordextremelist.xyz](https://discordextremelist.xyz/en-US/bots/welcome-bot)\n" +
                    "> [disbotlist.xyz](https://disbotlist.xyz/bot/848459799783669790)\n" +
                    "> [dblist.xyz](https://dblist.xyz/bot/848459799783669790)\n" +
                    "> [discordservices.net](https://discordservices.net/bot/848459799783669790)\n" +
                    "> [discordlist.space](https://discordlist.space/bot/848459799783669790)\n" +
                    "> [discord.boats](https://discord.boats/bot/848459799783669790)\n" +
                    "> [top.gg](https://top.gg/bot/848459799783669790)\n",
                inline
            )
            .addField(
                "🔗 Useful links:",
                `> [Support server](${message.client.config.supportGuildInvite})\n` +
                    "> [GitHub](https://github.com/Welcome-Bot/welcome-bot/)\n" +
                    "> [Privacy policy](https://welcome-bot.github.io/docs/privacy-policy.html) and [Terms of service](https://welcome-bot.github.io/docs/terms.html)\n" +
                    "> [Documentation](https://welcome-bot.github.io/docs)",
                inline
            )
            .setImage(
                "https://welcome-bot.github.io/assets/img/graphics3-standard.gif"
            );
        switch (args[0]) {
            case "--dm":
                message.author.send({ embeds: [embed] });
                message.reply(`Check out your DMs, ${message.author}`);
                break;
            default:
                message.reply({ embeds: [embed] });
                break;
        }
    }
};
