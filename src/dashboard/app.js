/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
require("dotenv").config();
const fs = require("fs");
const { CheckAuth, fetchUser } = require("./utils");
const path = require("path");
const express = require("express");

module.exports.load = (client) => {
    const session = require("express-session");
    const MongoDBStore = require("connect-mongodb-session")(session);
    const store = new MongoDBStore({
        uri: process.env.MONOGO_URL,
        collection: "Sessions",
    });
    // Catch errors
    store.on("error", (err) => {
        console.log(err);
    });
    //const csurf = require("csurf");
    //const csrf = csurf();
    if (client.debug) client.logger.log("loading dashboard");
    const app = express();
    app.use(express.urlencoded({ extended: true }))
        .use(express.json())
        //Set engine to html for embedded js template
        .engine("html", require("ejs").renderFile)
        .set("view engine", "ejs")
        // Set the ejs templates to ./views
        .set("views", path.join(__dirname, "/views"))
        //Set express session
        .use(
            session({
                secret: client.config.dashboard.secret,
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
                },
                store: store,
                resave: true,
                saveUninitialized: false,
            })
        )
        //Set port
        .set("port", client.config.dashboard.port || 3000)
        //Adding new shortcuts by extending like a plugin
        .use(async (req, res, next) => {
            req.client = client;
            req.userData = req.session.user ?? null;
            req.user = null;
            if (req.userData) {
                const userInfos = await fetchUser(req.userData, req.client);
                req.user = userInfos.user;
                req.userData = userInfos.userData;
            }
            if (!req.user) req.user = null;
            req.userDB = req.user
                ? await client.userDbFuncs.getUser(req.user.id)
                : null;
            req.locale = "en-US";
            if (req.userData && req.userData.locale)
                req.locale = req.userData.locale;
            req.translate = client.i18next.getFixedT(req.locale);
            req.currentURL = `${req.protocol}://${req.get("host")}${
                req.originalUrl
            }`;
            next();
        });
    /*.use((req, res, next) => {
            if (req.url.indexOf("webhook") !== -1) return next();
            csrf(req, res, next);
        })*/

    const routesFolder = path.join(__dirname, "/routes");
    const routesFiles = fs
        .readdirSync(routesFolder)
        .filter((file) => file.endsWith(".js"));
    for (const file of routesFiles) {
        let f = file.replace(".js", "");
        if (f.indexOf("index") > -1) f = "/";
        else f = `/${f}`;
        try {
            app.use(f, require(`${routesFolder}/${f}`));
        } catch (e) {
            console.error(e);
        }
    }

    app
        // Since this is the last non-error-handling we assume 404.
        .use((req, res) => {
            if (req.accepts("html")) {
                res.render("404", {
                    user: req.user,
                    userData: req.userData,
                    userDB: req.userDB,
                    translate: req.translate,
                    currentURL: req.currentURL,
                });
            } else if (req.accepts("json")) {
                res.json({ error: "404", message: "Page Not Found" });
            } else {
                return res.type("txt").sendStatus(404);
            }
            res.status(404);
            res.end();
        })
        //Error handler
        .use(CheckAuth, (err, req, res) => {
            console.error(err.stack);
            if (!req.user) return res.redirect("/");
            if (req.accepts("html")) {
                res.render("500", {
                    user: req.user,
                    userData: req.userData,
                    userDB: req.userDB,
                    translate: req.translate,
                    currentURL: req.currentURL,
                });
            } else if (req.accepts("json")) {
                res.json({ error: "500", message: "Internal Server Error" });
            } else {
                return res.type("txt").sendStatus(500);
            }
            res.status(500);
            res.end();
        });

    app.listen(app.get("port"), () => {
        console.log(`Dashboard running on port ${app.get("port")}`);
    });
};
