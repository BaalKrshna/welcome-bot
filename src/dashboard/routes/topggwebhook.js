/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const express = require("express");
const router = express.Router();
const { webhook } = require("../../classes/Topgg");
//POST /topggwebhook
router.post(
    "/",
    webhook.listener(async (vote, req, res) => {
        if (vote.type.toLowerCase() === "test")
            return console.log("topggwebhook test success");
        const { client } = req;
        const vUser = await client.users.fetch(vote.user);
        if (!vUser) return;
        await client.userDbFuncs.addUser(vUser.id);
        const userDB = await client.userDbFuncs.getUser(vUser.id);
        await client.userDbFuncs.updateUser(
            vUser.id,
            "wallet",
            parseInt(userDB.wallet) + 500
        ); //Give user 500 coins
        if (client.config.votesChannelId) {
            client.channels.cache
                .get(client.config.votesChannelId)
                .send(
                    `⬆️ **${vUser.tag}** (\`${vUser.id}\`) voted for **${
                        client.username
                    }${
                        vote.guild ? " Support server" : " itself"
                    }** on top.gg and got 500 wcoins 🎉!`
                )
                .catch(console.log);
        } else {
            console.log("No votesChannelId in config");
        }
        res.sendStatus(200);
        res.end();
    })
);
module.exports = router;
