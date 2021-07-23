/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { CheckAuth } = require("./utils");
const express = require("express");
const router = express.Router();
//GET /dashboard
router.get("/", CheckAuth, (req, res) => {
    res.sendStatus(200);
});
module.exports = router;
