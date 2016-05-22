# ExpresSJ



## Installation and Usage

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
git clone https://github.com/CoreDevo/ExpresSJ.git
cd ExpresSJ/
npm install
node bin/www.js
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

```
|-- Github',
    |-- .DS_Store',
    |-- .gitignore',
    |-- README.md',
    |-- app.js',
    |-- package.json',
    |-- bin',
    |   |-- www.js',
    |-- modules',
    |   |-- mongo-service.js',
    |   |-- mongolia.js',
    |   |-- socket-service.js',
    |   |-- socket_private_room.js',
    |   |-- utils.js',
    |-- public',
    |   |-- .DS_Store',
    |   |-- chat.html',
    |   |-- login.html',
    |   |-- notFound.html',
    |   |-- css',
    |   |   |-- chat.css',
    |   |   |-- login.css',
    |   |   |-- notFound.css',
    |   |-- img',
    |   |   |-- .DS_Store',
    |   |   |-- avatar-left.jpg',
    |   |   |-- avatar-right.jpg',
    |   |   |-- userLIstAvatar.png',
    |   |   |-- avatars',
    |   |   |   |-- avatar_1.jpg',
    |   |   |   |-- avatar_2.jpg',
    |   |   |   |-- avatar_3.jpg',
    |   |   |   |-- avatar_4.jpg',
    |   |   |   |-- avatar_5.jpg',
    |   |   |   |-- avatar_6.jpg',
    |   |   |   |-- avatar_7.jpg',
    |   |   |-- emoji',
    |   |       |-- Diao.jpg',
    |   |       |-- Kappa.jpg',
    |   |       |-- edward_mad.jpg',
    |   |       |-- pd_worth.jpg',
    |   |       |-- seven_laugh.jpg',
    |   |-- js',
    |   |   |-- chat.js',
    |   |   |-- login.js',
    |   |   |-- notFound.js',
    |   |-- lib',
    |       |-- jquery-1.12.3.min.js',
    |       |-- jquery.nicescroll.js',
    |       |-- socket.io-1.4.5.js',
    |-- routers',
        |-- auth_router.js',
        |-- chat_router.js',
        |-- index_router.js',
        |-- login_router.js',
  ```
