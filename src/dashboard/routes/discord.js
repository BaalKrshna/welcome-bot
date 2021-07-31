/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const express = require("express");
const router = express.Router();
const { Embed } = require("../../classes");
const btoa = require("btoa");
const fetch = require("node-fetch");
//GET /login
router.get("/login", (req, res) => {
    if (req.user) res.redirect("/dashboard");
    else
        res.redirect(
            `https://discord.com/api/oauth2/authorize?client_id=${
                req.client.user.id
            }&redirect_uri=${encodeURIComponent(
                `${req.protocol}://${req.get("host")}/discord/callback`
            )}&response_type=code&scope=identify%20guilds&state=${
                req.query?.state || "null"
            }`
        );
});
//GET /callback
router.get("/callback", async (req, res) => {
    if (!req.query.code) return res.redirect("/");
    const redirectUrl =
        req.client.dashboard.states[req.query?.state] ?? "/dashboard";
    const params = new URLSearchParams();
    params.set("grant_type", "authorization_code");
    params.set("code", req.query.code);
    params.set(
        "redirect_uri",
        `${req.protocol}://${req.get("host")}/discord/callback`
    );
    let response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: params.toString(),
        headers: {
            Authorization: `Basic ${btoa(
                `${req.client.user.id}:${req.client.config.dashboard.secret}`
            )}`,
            "User-Agent": process.env.userAgent,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    const tokens = await response.json();
    if (tokens.error || !tokens.access_token) {
        if (req.client.debug && process.env.NODE_ENV === "development")
            console.log(tokens);
        return res.redirect(`/discord/login?state=${req.query?.state}`);
    }
    const userData = {
        infos: null, //Basic info like user id, tag, username, etc.
        guilds: null,
    };
    while (!userData.infos || !userData.guilds) {
        if (!userData.infos) {
            response = await fetch("http://discord.com/api/users/@me", {
                method: "GET",
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });
            const json = await response.json();
            if (json.retry_after) await req.client.wait(json.retry_after);
            else userData.infos = json;
        }

        if (!userData.guilds) {
            response = await fetch("http://discord.com/api/users/@me/guilds", {
                method: "GET",
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });
            const json = await response.json();
            if (json.retry_after) await req.client.wait(json.retry_after);
            else userData.guilds = json;
        }
    }
    /* Change format (from "0": { data }, "1": { data }, etc... to [ { data }, { data } ]) */
    const guilds = [];
    for (const index in userData.guilds) guilds.push(userData.guilds[index]);
    req.session.user = {
        ...userData.infos,
        guilds,
    };
    const user = await req.client.users.fetch(req.session.user.id);
    const userDB = await req.client.userDbFuncs.getUser(req.session.user.id);
    const logsChannel = req.client.channels.cache.get(
        req.client.config.dashboard.logs
    );
    if (!userDB.logged && logsChannel && user) {
        const embed = new Embed({ color: "pink" })
            .setAuthor(user.tag, user.displayAvatarURL())
            .setDesc(
                `${user.tag} has logged in to the dashboard first time ever! :tada:`
            );
        logsChannel.send({ embeds: [embed] });
        await req.client.userDbFuncs.updateUser(
            req.session.user.id,
            "logged",
            true
        );
    } else if (!userDB.logged && user) {
        await req.client.userDbFuncs.updateUser(
            req.session.user.id,
            "logged",
            true
        );
    }
    res.redirect(redirectUrl);
});
module.exports = router;
