/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */

module.exports = (client) => {
    const fs = require("fs");
    const { categories } = client;
    const commands = client.commands.enabled;
    let text = fs.readFileSync(__dirname + "/cmdTemplate.md", "utf8");
    let toc = "# Table of contents\n\n"; //Table of contents
    const t = client.i18next.getFixedT("en-US");
    categories.forEach((cat) => {
        const cmds = commands
            .filter((cmd) => cmd.category === cat.name)
            .array();
        toc += `- [${cat.name}](#${cat.name
            .toLowerCase()
            .replace(" ", "-")})\n`;
        text += `\n## ${cat.name} (${cmds.length} commands)\n`;
        cmds.forEach((cmd) => {
            let subcommands;
            if (cmd.subcommands) {
                subcommands = [];
                for (var i = 0; i < cmd.subcommands.length; i++) {
                    subcommands.push(
                        `\`${cmd.subcommands[i].name}\` - ${cmd.subcommands[i].desc}`
                    );
                }
            }
            text +=
                `\n### \`${cmd.name}\`\n\n` +
                `##### Subcommands:\n\n- ${
                    subcommands ? subcommands.join("\n- ") : "None"
                }\n\n##### Cmd info\n\n` +
                `- Description: ${t(`cmds:${cmd.name}.cmdDesc`)}\n` +
                `- Usage: ${cmd.usage ? cmd.usage : "None"}\n` +
                `- Aliases: ${
                    cmd.aliases ? `\`${cmd.aliases.join("`, `")}\`` : "None"
                }\n` +
                `- Cooldown: ${cmd.metadata.cooldown}\n`;
        });
    });
    text = text
        .replace("{commandsRoundToTen}", `${Math.floor(commands.size / 10)}0`)
        .replace("{categoriesSize}", categories.length)
        .replace("{toc}", toc);
    fs.writeFileSync("./commands.md", `${text}`);
    client.logger.log("Docs updated!", "debug");
};
