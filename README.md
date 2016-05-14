# ExpresSJ



## Installation and Usage

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
git clone https://github.com/CoreDevo/ExpresSJ.git
cd ExpresSJ/
npm install
node bin/www.js
cd
```



## Dependencies

- [body-parser](https://github.com/expressjs/body-parser): Node.js body parsing middleware
- [cookie-parser](https://github.com/expressjs/cookie-parser): cookie parsing with signatures
- [express](https://github.com/expressjs/express): Fast, unopinionated, minimalist web framework
- [js-cookie](https://github.com/js-cookie/js-cookie): A simple, lightweight JavaScript API for handling cookies
- [mongodb](https://github.com/mongodb/node-mongodb-native): The official MongoDB driver for Node.js
- [morgan](https://github.com/expressjs/morgan): HTTP request logger middleware for node.js
- [socket.io](https://github.com/Automattic/socket.io): node.js realtime framework server
- [debug](https://github.com/visionmedia/debug): small debugging utility

## File Tree

```sh
|-- Github',
    |-- .DS_Store',
    |-- .gitignore',
    |-- README2.md',
    |-- app.js',
    |-- list.md',
    |-- package.json',
    |-- bin',
    |   |-- www.js',
    |-- modules',
    |   |-- mongo-service.js',
    |   |-- socket-service.js',
    |   |-- utils.js',
    |-- public',
    |   |-- chat.html',
    |   |-- login.html',
    |   |-- notFound.html',
    |   |-- css',
    |   |   |-- chat.css',
    |   |   |-- login.css',
    |   |-- img',
    |   |   |-- avatar-left.jpg',
    |   |   |-- avatar-right.jpg',
    |   |   |-- userLIstAvatar.png',
    |   |   |-- emoji',
    |   |       |-- Diao.jpg',
    |   |       |-- EdwardMad.jpg',
    |   |       |-- Kappa.jpg',
    |   |       |-- PDWorth.jpg',
    |   |       |-- SevenLaugh.jpg',
    |   |-- js',
    |   |   |-- chat.js',
    |   |   |-- login.js',
    |   |-- lib',
    |       |-- jquery-1.12.3.min.js',
    |       |-- jquery.nicescroll.js',
    |       |-- socket.io-1.4.5.js',
    |-- routers',
        |-- accessCode.js',
        |-- chat_router.js',
        |-- index.js',
        |-- login.js',
```
