# Mobile CDISC Library Browser Editor

A CDISC Library browser optimized for mobile devices

Visit [defineeditor.com/cla-mobile](http://defineeditor.com/cla-mobile) to learn more about the Browser.

# Support

* [Github Issues](https://github.com/defineEditor/cla-mobile/issues)
* [Telegram](https://t.me/defineeditor)
* [support@defineeditor.com](support@defineeditor.com)

# Building the application from source

### Prerequisites

The following software is needed to compile the application:
* Git
* Node.js
* NPM

### Installing

Clone the repository:
```
git clone https://github.com/defineEditor/cla-mobile.git
```
Install all required dependencies:
```
npm install
```

## Running in development mode
The application is served using HTTPS protocol. It is needed to generate local certificates and make them trusted by your browser. This can be achieved with [mkcert](https://github.com/FiloSottile/mkcert). The files should be placed in a cert subfolder (localhost.pem and localhost-key.pem).

To run the application in a development mode use the following command:
```
npm start
```
After that you should be able to access the application using [https://localhost:3000](https://localhost:3000)

## Authors

* [**Dmitry Kolosov**](https://www.linkedin.com/in/dmitry-kolosov-91751413/)

## License

This project is licensed under the MIT - see the [LICENSE.txt](LICENSE.txt) file for details.
