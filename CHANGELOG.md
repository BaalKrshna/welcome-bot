# Changelog v2

The Changelog of the major version 2 of Discord Welcome-Bot.

The displayed date is in the format `DD-MM-YYYY`

[Older changelogs](#older-changelogs)

[Legend](#legend)

## [v2.0.0]

> **Released:** `TBA`

### Breaking Changes

- `modChannel` in db is changed to `plugins.modlogs`
- `channel` in db is dropped in favour of `plugins.welcome.channel`
- fix(goodbye): They are disabled by default now!
- Default welcome message is changed to `Welcome {mention} to the {server} server!\nYou are our #{members_formatted} member`
- Default goodbye message is changed to `Good Bye {mention}!\nWe are sad to see you go!\nWithout you, we are {{members}} members`

### Bug fixes

- fix(channel): fix error `ReferenceError: channelIdFromMention is not defined`
- fix(goodbye): Sometimes, an error would occur to send goodbye logs
- fix(lang): after switching another language, an error occures when you try to switch back to english
- fix(addemoji): fix not responding after emoji is added.

### New features

- feat: New cmd `emojify`
- feat: New cmd `daily` and new category `Economy`
- feat: New cmds `balance`, `deposit`, `give`, `beg`, `withdraw`, `profile`, `setbio`, `rob`, `vote`, `use`, `inventory`
- feat: New item `banknote`
- feat: New cmd `report`
- feat: New cmd `duck`
- feat: add `{username}`, `{members_formatted}` placeholders for welcome & goodbye messages
- feat: New cmd `membercount`
- Dashboard
- feat: New cmd `welcome`
- feat: New cmd `goodbye`
- feat: New cmd `modlogs`
- feat: New cmd `seek`
- refactor: translations for command usages
- feat: New cmd `staff`
- feat: New cmds `chanid`, `roleid`, `serverid`, `userid`
- feat: New cmd `autorole` & new plugin autorole
- feat: New cmd `reverse`
- feat: New slash commands `ping`, `staff`, `mute`, `listemojis`
- feat: New cmd `config`
- feat: Add `-f` option for prune cmd
- feat: New cmd `djsdocs`

### Changes

- refactor(goodbye logs): Goodbye logs now use embeds!
- refactor(disable cmd): disable commands using disable cmd!
- refactor(enable): enable commands using enable cmd!
- refactor(translations): Lot more translations

[v2.0.0]: https://github.com/Welcome-Bot/welcome-bot/releases/tag/v2.0.0

## Legend

- `perms` = `permissions`
- `djs` = `discord.js`

## Older changelogs

- [v1](https://github.com/Welcome-Bot/welcome-bot/blob/v1.13.2/CHANGELOG.md)
- [v0](https://github.com/Welcome-Bot/welcome-bot/blob/v0.1.0/CHANGELOG.md)
