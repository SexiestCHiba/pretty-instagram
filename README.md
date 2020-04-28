# pretty-instagram [![CodeFactor](https://www.codefactor.io/repository/github/sexiestchiba/pretty-instagram/badge)](https://www.codefactor.io/repository/github/sexiestchiba/pretty-instagram)

a simple node.js web page that display the latest posts of your Friends.

If you have a suggestion to improve pretty-instagram(new fonctionnality(ies), bugs or backends improvements), I invite you to open an issue post or/and fork and open a pull request.

![Screenshot](docs/screenshot.jpg)

Photo credit by [davidderueda](https://www.instagram.com/davidderueda/)

## Feature

* Admire your friends' instagram posts and story without any disturbing interactions (likes, comments, etc.) to stay focused on the essential.
* **Lazy Loader** - all posts you don't see on your screen will never load on your device.

### Installation

* Put `server.js`, `.env`, `package-lock.json` and `public/` in an empty folder folder.
* Edit `.env` file, change YOUR_USERNAME by your instagram username and YOUR_PASSWORD by your instagram password
* Install all dependencies (see ddependencies section below)
* Start the server with: `node server.js`
* See your server page in <http://your.domain.name:3000>

I recommand you to use `screen` to execute the server in background:

`screen -S screenName node server.js`

### Dependencies

* Nodejs 12.13 or newer (<https://nodejs.org>)
* npm 6.12.1 or newer (<https://nomjs.com>)
* git 2.20.1 or newer (<https://git-scm.com/>)

 `npm i express dotenv serve-favicon body-parser instagram-web-api compression` to install node modules

**The instagram-web-api dependencies on npm is outdated**, install it on npm to install his dependencies, then remove the instagram-web-api/ folder in node_modules/ and install the last version from github by using git:
`git clone https://github.com/jlobos/instagram-web-api`

## Licence

The repositories and all files insides, are available under the MIT licences

## Contact

You can contact me at [quentin3157.github@gmail.com](mailto:quentin3157.github@gmail.com).
