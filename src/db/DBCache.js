/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { Collection } = require("discord.js");
module.exports = class DBCache {
    constructor(client) {
        this.client = client;
        this.guilds = new Collection();
        this.users = new Collection();
        this.guildSchema = require("../schema/guildSchema");
        this.userSchema = require("../schema/userSchema");
        setInterval(() => {
            this.client.logger.log("Refreshing db cache", "debug");
            this.guilds.each((guildDB) => {
                const { guildId: id } = guildDB;
                this.guilds.delete(id);
                this.findOrCreateGuild(id);
            });
            this.users.each((userDB) => {
                const { userId: id } = userDB;
                this.users.delete(id);
                this.findOrCreateUser(id);
            });
        }, this.client.config.dbCacheRefreshInterval);
    }

    async findOrCreateGuild(guildId, lang = "en-US") {
        if (this.guilds.get(guildId)) {
            return this.guilds.get(guildId);
        } else {
            let guildDB = await this.guildSchema.findOne({ guildId });
            if (guildDB) {
                this.guilds.set(guildDB.guildId, guildDB);
                return guildDB;
            } else {
                guildDB = new this.guildSchema({ guildId, lang });
                await guildDB.save();
                this.guilds.set(guildDB.guildId, guildDB);
                return guildDB;
            }
        }
    }

    async findOrCreateUser(userId) {
        if (this.users.get(userId)) {
            return this.users.get(userId);
        } else {
            let userDB = await this.userSchema.findOne({ userId });
            if (userDB) {
                this.users.set(userDB.userId, userDB);
                return userDB;
            } else {
                userDB = new this.userSchema({ userId });
                await userDB.save();
                this.users.set(userDB.userId, userDB);
                return userDB;
            }
        }
    }

    deleteGuild(guildId) {
        return new Promise((resolve, reject) => {
            this.guildSchema.where({ guildId }).deleteOne((err) => {
                if (err) {
                    return reject("Could not delete guild");
                } else {
                    this.guilds.delete(guildId);
                    return resolve("Guild Deleted");
                }
            });
        });
    }

    deleteUser(userId) {
        return new Promise((resolve, reject) => {
            this.userSchema.where({ userId }).deleteOne((err) => {
                if (err) {
                    return reject("Could not delete user");
                } else {
                    this.users.delete(userId);
                    return resolve("User Deleted");
                }
            });
        });
    }
};
