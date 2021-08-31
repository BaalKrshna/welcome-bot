/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const express = require("express");
const router = express.Router();
//POST /webhooks/bls
router.post("/bls", async (req, res) => {
    if (req.client.debug) console.log("/webhooks/bls");
    if (!process.env.BLS_Wtoken) return res.sendStatus(500);
    if (
        !req.headers.authorization ||
        req.headers.authorization !== process.env.BLS_Wtoken
    )
        return res.sendStatus(401);
    const { client } = req;
    const vUser = await client.users.fetch(req.body.user.id);
    if (!vUser) {
        res.sendStatus(500);
        return console.log("bls webhook: User not found to give vote rewards");
    }
    if (!(await client.userDbFuncs.getUser(vUser.id)))
        await client.userDbFuncs.addUser(vUser.id);
    const userDB = await client.userDbFuncs.getUser(vUser.id);
    userDB.wallet = parseInt(userDB.wallet) + 500; //Give 500 coins
    userDB.markModified("wallet");
    userDB.inventory.banknote = parseInt(userDB.inventory.banknote) + 3; //Give 3 banknotes
    userDB.markModified("inventory.banknote");
    await userDB.save();
    const member = client.guilds.cache
        .get(client.config.botGuildId)
        .members.cache.get(vUser.id);
    if (member) member.roles.add(client.config.votersRole);
    if (process.env.NODE_ENV !== "production") {
        console.log(
            "NODE_ENV not in production so not sending any messages for voting on botlist.space"
        );
        res.sendStatus(200);
        return res.end();
    }
    if (client.config.votesChannelId) {
        client.channels.cache
            .get(client.config.votesChannelId)
            .send(
                `⬆️ **${vUser.tag}** (\`${vUser.id}\`) voted for **${client.username}** on botlist.space and got 500 WCoins with other rewards 🎉!`
            )
            .catch(console.log);
    } else {
        console.log("No votesChannelId in config");
    }
    const t = req.client.i18next.getFixedT(req.locale ?? "en-US");
    vUser
        .send(t("misc:thanks.vote", { site: "botlist.space" }))
        .catch(() => {});
    res.sendStatus(200);
    res.end();
});
//GET /webhooks/bls
router.get("/bls", (req, res) => {
    res.send("Use POST request instead of GET");
    res.end();
});
const { webhook } = require("../../classes/Topgg");
//POST /webhooks/topgg
router.post(
    "/topgg",
    webhook.listener(async (vote, req, res) => {
        if (req.client.debug) console.log("/webhooks/topgg");
        if (vote.type.toLowerCase() === "test")
            return console.log("topggwebhook test success");
        const { client } = req;
        const vUser = await client.users.fetch(vote.user);
        if (!vUser) {
            res.sendStatus(500);
            return console.log(
                "topgg webhook: User not found to give vote rewards"
            );
        }
        if (!(await client.userDbFuncs.getUser(vUser.id)))
            await client.userDbFuncs.addUser(vUser.id);
        const userDB = await client.userDbFuncs.getUser(vUser.id);
        userDB.wallet = parseInt(userDB.wallet) + 500; //Give 500 coins
        userDB.markModified("wallet");
        userDB.inventory.banknote = parseInt(userDB.inventory.banknote) + 3; //Give 3 banknotes
        userDB.markModified("inventory.banknote");
        await userDB.save();
        const member = client.guilds.cache
            .get(client.config.botGuildId)
            .members.cache.get(vUser.id);
        if (member) member.roles.add(client.config.votersRole);
        if (client.config.votesChannelId) {
            client.channels.cache
                .get(client.config.votesChannelId)
                .send(
                    `⬆️ **${vUser.tag}** (\`${vUser.id}\`) voted for **${
                        client.username
                    } ${
                        vote.guild ? "Support server" : "itself"
                    }** on top.gg and got 500 WCoins with other rewards 🎉!`
                )
                .catch(console.log);
        } else {
            console.log("No votesChannelId in config");
        }
        const t = req.client.i18next.getFixedT(req.locale ?? "en-US");
        vUser
            .send(t("misc:thanks.vote", { site: "top.gg" }))
            .catch(() => {})
            .catch(() => {});
        res.sendStatus(200);
        res.end();
    })
);
//GET /webhooks/topgg
router.get("/topgg", (req, res) => {
    res.send("Use POST request instead of GET");
    res.end();
});
module.exports = router;
