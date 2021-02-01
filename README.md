<!-- markdownlint-disable MD033 -->
# [BossaBox](https://www.bossabox.com)-VUTTR-Challenge

[![Build Status](https://travis-ci.com/CaioStoduto/BossaBox-VUTTR-Challenge.svg?branch=master)](https://travis-ci.com/CaioStoduto/BossaBox-VUTTR-Challenge)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9dbda74fa87e42e5afc6a0e59ff75e11)](https://app.codacy.com/gh/CaioStoduto/BossaBox-VUTTR-Challenge?utm_source=github.com&utm_medium=referral&utm_content=CaioStoduto/BossaBox-VUTTR-Challenge&utm_campaign=Badge_Grade)
[![CodeFactor](https://www.codefactor.io/repository/github/caiostoduto/bossabox-vuttr-challenge/badge)](https://www.codefactor.io/repository/github/caiostoduto/bossabox-vuttr-challenge)
[![Known Vulnerabilities](https://snyk.io/test/github/CaioStoduto/BossaBox-VUTTR-Challenge/badge.svg?targetFile=package.json)](https://snyk.io/test/github/CaioStoduto/BossaBox-VUTTR-Challenge?targetFile=package.json)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/0447cdcc7321450ab9d6d386ffe89cd7)](https://www.codacy.com/gh/CaioStoduto/BossaBox-VUTTR-Challenge/dashboard?utm_source=github.com&utm_medium=referral&utm_content=CaioStoduto/BossaBox-VUTTR-Challenge&utm_campaign=Badge_Coverage)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCaioStoduto%2FBossaBox-VUTTR-Challenge.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FCaioStoduto%2FBossaBox-VUTTR-Challenge?ref=badge_shield)

Your task is to build an API and database for the VUTTR (Very Useful Tools to Remember) application. The application is a simple repository for managing tools with their names, links, descriptions and tags.

## Summary

- [Challenge](#challenge)
- [Documentation](#documentation)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Tools used](#tools-used)
- [Learnings](#learnings)
- [Tests](#tests)
- [License](#license)

## Challenge

Your task is to build an API and database for the VUTTR (Very Useful Tools to Remember) application. The application is a simple repository for managing tools with their names, links, descriptions and tags. Use a Git repository (public, preferably) for versioning and making the code available.<br/><br/><br/>

![Challenge image (Google Translated)](https://raw.githubusercontent.com/CaioStoduto/BossaBox-VUTTR-Challenge/master/assets/screencapture-app-bossabox-profile-skills-challenges-5e3c53a13e80520008f25397-2021-02-01-09_47_00.png)

## Documentation

All the files have comments in the code.

### Description of the API (each route)

The function of each route is described in the file [index.apib](./index.apib).

## Installation

```bash
# yarn
yarn install

# npm
npm install
```

### Requirements

- [MongoDB](https://www.mongodb.com/);
- A GitHub account that to create a [GitHub OAuth application](https://github.com/settings/applications/new)

## How to Use

Create in the root the file `.env` containing:

```JavaScript
COOKIES_SECRET=
DB_AUTH=
DB_NAME=
GITHUB_PUBLIC=
GITHUB_SECRET=
JWT_SECRET=
```

The application will listen to the port `3000`. However you can set to listen to another port adding **PORT=**{port} to `.env`.

- **COOKIES_SECRET** [(More info)](https://www.npmjs.com/package/cookie-parser#cookieparsersecret-options)<br/>
    A random string that will encrypt and sign the cookies 🍪<br/>
    Example: `Vanilla`

- **DB_AUTH**<br/>
    A string that contains the database protocol, the username, password and host<br/>
    **mongodb+srv://\<username\>:\<password\>@cluster0.aaaaa.bbb.mongodb.net**/\<dbname\>

- **DB_NAME**<br/>
    The database name<br/>
    mongodb+srv://\<username\>:\<password\>@cluster0.aaaaa.bbb.mongodb.net/**\<dbname\>**

- [**GITHUB_PUBLIC**](https://github.com/settings/applications/new)<br/>
    The GitHub OAuth public key<br/>
    Example: `f5234892909e905f5eee`

- [**GITHUB_SECRET**](https://github.com/settings/applications/new)<br/>
    The GitHub OAuth secret key<br/>
    Example: `6953076013f8e8a79b601781da3ea84a7f70415c`

- **JWT_SECRET** [(More info)](https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)<br/>
    A random string that will encrypt and sign the JWT ([JSON Web Token](https://jwt.io/))<br/>
    Example: `idk, a random string`<br/>

### .env.example

```JavaScript
COOKIES_SECRET=Vanilla
JWT_SECRET=1234567890
DB_AUTH=mongodb+srv://user:password@cluster0.abcde.gcp.mongodb.net
DB_NAME=database
GITHUB_PUBLIC=f5234892909e905f5eee
GITHUB_SECRET=6953076013f8e8a79b601781da3ea84a7f70415c
PORT=897
```

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCaioStoduto%2FBossaBox-VUTTR-Challenge.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FCaioStoduto%2FBossaBox-VUTTR-Challenge?ref=badge_large)
