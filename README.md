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
  - [Requirements](#requirements)
- [How to Use](#how-to-use)
  - [Description (.env)](#Description-(.env))
  - [Example (.env)](#Example-(.env))
- [Tools Used](#tools-used)
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

# or npm
npm install
```

### Requirements

- [*Yarn*](https://yarnpkg.com/) or [npm](https://www.npmjs.com/get-npm);
- [Nodejs](https://nodejs.org/en/);
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/);
- A GitHub account to create a [GitHub OAuth application](https://github.com/settings/applications/new)

## How to Use

You need to edit the file .env, above explains what each option does

### Description (.env)

- **COOKIES_SECRET** [(More info)](https://www.npmjs.com/package/cookie-parser#cookieparsersecret-options)<br/>
    A random string that will encrypt and sign the cookies 🍪<br/>
    Example: `Vanilla`

- **DB_AUTH**<br/>
    A string that contains the database protocol, the username, password and host<br/>
    `mongodb+srv://<username>:<password>@cluster0.aaaaa.bbb.mongodb.net`/\<dbname\>

- **DB_NAME**<br/>
    The database name<br/>
    mongodb+srv://\<username\>:\<password\>@cluster0.aaaaa.bbb.mongodb.net/`<dbname>`

- [**GITHUB_PUBLIC**](https://github.com/settings/applications/new)<br/>
    The GitHub OAuth public key<br/>
    Example: `f5234892909e905f5eee`

- [**GITHUB_SECRET**](https://github.com/settings/applications/new)<br/>
    The GitHub OAuth secret key<br/>
    Example: `6953076013f8e8a79b601781da3ea84a7f70415c`

- **JWT_SECRET** [(More info)](https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)<br/>
    A random string that will encrypt and sign the JWT ([JSON Web Token](https://jwt.io/))<br/>
    Example: `idk, a random string`<br/>

- **PORT** [(More info)](https://expressjs.com/en/api.html#app.listen)<br/>
    "A 16-bit unsigned number, known as the port number" ~ [Wikipedia](https://en.wikipedia.org/wiki/Port_(computer_networking))<br/>
    Default: `3000`

### Example (.env)

```dosini
COOKIES_SECRET=Gradma´s love
JWT_SECRET=1234567890
DB_AUTH=mongodb+srv://user:password@cluster0.abcde.gcp.mongodb.net
DB_NAME=database
GITHUB_PUBLIC=f5234892909e905f5eee
GITHUB_SECRET=6953076013f8e8a79b601781da3ea84a7f70415c
PORT=897
```

## Tools Used

- [**Apiary**](https://apiary.io/) as [API Blueprint](https://apiblueprint.org/) Editor
- [**Codacy**](https://codacy.com) as Code Grade and [Code Coverage](https://en.wikipedia.org/wiki/Code_coverage) analyser
- [**Travis CI**](https://travis-ci.com/) as [Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) (CI) <br/>
- [**Talend API Tester**](https://chrome.google.com/webstore/detail/talend-api-tester-free-ed/aejoelaoggembcahagimdiliamlcdmfm?hl=en) as API Tester
- [**VS Code Insiders**](https://code.visualstudio.com/insiders/) as [Integrated Development Environment](https://en.wikipedia.org/wiki/Integrated_development_environment) (IDE), with the extensions:
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) is used to check syntax, find problems and enforce code style in JavaScript
  - [GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=github.vscode-pull-request-github)
  - [Jest](https://marketplace.visualstudio.com/items?itemName=orta.vscode-jest) is used to automatically execute jest tests and facilitate test debugging
  - [Jest Snippets](https://marketplace.visualstudio.com/items?itemName=andys8.jest-snippets) adds jest snippets to the VSCode
  - [markdownlint](https://marketplace.visualstudio.com/items?itemName=davidanson.vscode-markdownlint) is used to check syntax, find problems and enforce code style in Markdown
  - [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense) autocompletes npm modules in import statements
- **Dependencies**
  - [axios](https://www.npmjs.com/package/axios) is my favourite promise based HTTP client
  - [cookie-parser](https://www.npmjs.com/package/cookie-parser) is used as a [Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) 🍪 parser that handles signed Cookies 🍪🍪
  - [dotenv](https://www.npmjs.com/package/dotenv) is a simple module to load environment variables from a .env file
  - [express](https://www.npmjs.com/package/express) is my favourite web framework for node
  - [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) is a simple [rate limiter](https://en.wikipedia.org/wiki/Rate_limiting) to express to prevent [DDOS](https://en.wikipedia.org/wiki/Denial-of-service_attack) and [authentication vulnerabilities](https://owasp.org/www-chapter-singapore/assets/presos/Securing_your_APIs_-_OWASP_API_Top_10_2019,_Real-life_Case.pdf) [(More info)](https://cloud.google.com/solutions/rate-limiting-strategies-techniques)
  - [helmet](https://www.npmjs.com/package/helmet) is used to protect the server against some web vulnerabilites [(More info)](https://expressjs.com/en/advanced/best-practice-security.html)
  - [joi](https://www.npmjs.com/package/joi) is used to validate the user [POST] request at /tools
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) is a module that implements Json Web Token [(Learn more about)](https://jwt.io/) that is used in the proccess of the user authentication
  - [mongoose](https://www.npmjs.com/package/mongoose) is a MongoDB object modeling, that is used as a module to access the MongoDB
- **Dev Dependencies**
  - [{@commitlint/config-conventional, @commitlint/cli}](https://github.com/conventional-changelog/commitlint), [{commitizen, cz-conventional-changelog}](https://github.com/commitizen/cz-cli) and [husky](https://www.npmjs.com/package/husky) are used to enforce a commit style
  - [@commitlint/travis-cli](https://www.npmjs.com/package/@commitlint/travis-cli) is used to implement commitlint to Travis CI
  - [eslint](https://www.npmjs.com/package/eslint) is used to check syntax, find problems and enforce code style, with the [standard popular guide](https://github.com/standard/standard)
  - [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) is a plugin that implements Jest to the ESLint
  - [jest](https://www.npmjs.com/package/jest) is used to make tests
  - [nodemon](https://www.npmjs.com/package/nodemon) is used to facilitate the development, because it restarts the node application when file changes in the directory are detected
  - [set-cookie-parser](https://www.npmjs.com/package/set-cookie-parser) is a simple module that parsers the Set-Cookie header to an object that is used in tests
  - [supertest](https://www.npmjs.com/package/supertest) is used to test routes and middlewares

## Tests

[![Build Status](https://travis-ci.com/CaioStoduto/BossaBox-VUTTR-Challenge.svg?branch=master)](https://travis-ci.com/CaioStoduto/BossaBox-VUTTR-Challenge)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/0447cdcc7321450ab9d6d386ffe89cd7)](https://www.codacy.com/gh/CaioStoduto/BossaBox-VUTTR-Challenge/dashboard?utm_source=github.com&utm_medium=referral&utm_content=CaioStoduto/BossaBox-VUTTR-Challenge&utm_campaign=Badge_Coverage)

The only missing tests are errors that are difficult to reproduce, but their results are predictable and tested, and OAuths, that cannot be tested automatically.

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCaioStoduto%2FBossaBox-VUTTR-Challenge.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FCaioStoduto%2FBossaBox-VUTTR-Challenge?ref=badge_large)
