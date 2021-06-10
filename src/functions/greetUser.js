/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const getGuild = require("../db/functions/getGuild");
const genImage = require("./genImage");
const fs = require("fs");
module.exports = async (member) => {
    const { Attachment } = require("discord.js");
    let guildDB = await getGuild(member.guild.id);
    let channel = member.guild.channels.cache.find(
        (ch) => ch.name === guildDB.channel
    );
    let image;
    const file = "./tempImage.jpg";
    if (!channel) {
        return;
    }
    channel.startTyping(1);
    let msg = guildDB.welcomeMessage;
    //Replace Placeholders with their values
    msg = msg
        .replace("{mention}", `${member}`)
        .replace("{server}", `${member.guild.name}`)
        .replace("{members}", `${member.guild.memberCount}`);
    image = genImage(member);
    if (image) {
        fs.writeFile(file, image, function (err) {
            if (err) throw err;
        });
        channel.send(msg, new Attachment(file, "welcome-image.jpg"));
    } else {
        channel.send(msg);
    }
    channel.stopTyping();
};
