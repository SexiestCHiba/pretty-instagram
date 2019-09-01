# pretty-instagram

a node.js web page to display the latest posts of your favorite personalities

![Screenshot](screenshot.jpg)

Photo credit by [davidderueda](https://www.instagram.com/davidderueda/)


## Feature

* Admire your friends' instagram posts without any disturbing interactions (likes, comments, etc.) to stay focused on the essential.
* *Lazy Loader* - all posts you don't see on your screen will never load on your device.

### Future features

* See posts in fullscreen.
* possibility to see more than 50 posts (thank to ajax).

## Dependencies

`npm i express dotenv serve-favicon body-parser instagram-web-api` to install all dependencies.

**The instagram-web-api dependencies on npm is outdated**, install it on npm to install his dependencies, then remove the instagram-web-api/ folder in node_modules/ and install the last version from github by using git:
`git clone https://github.com/jlobos/instagram-web-api`

Then modify index.js file in instagram-web-api/lib/ folder and change
```Javascript
// Change
async getUserIdPhotos({ id, first = 12, after = '' } = {}) {
// by
async getUserIdPhotos({ id, first = 50, after = '' } = {}) {
```

*body-parser will be use in futures update*

## Licences

The repositories and all files insides, are available under the MIT licences

## Contact

You can contact me at [quentin3157.github@gmail.com](mailto:quentin3157.github@gmail.com).
