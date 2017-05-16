# seemē

The dating, swiping app with 10s pictures - no reading profile info, no writing "about me's". Just Watch, Swipe and chat

## Screenshots
Include a one or two screenshots of main UI/UX points of your app and how it solves a problem

## Technologies used
You can give a brief listing of the technologies you've learned and applied here
- node.js
- Express
- Handblebars
- Firebase (Storage)
- MySQL
- Sequelize
- Bootstrap
- jQuery
- jTinder
- socket.io
- geocoder
- transform2d.js
- validate.js

## Getting Started

Clone / download a zip file. If you download a zip, unzip the package. Run node (nodemon) server. Run 'npm install --save" to acquire all packages needed to run the app. At first, you will have no users in the database, so you can simply sign up a few fake users, record videos for them by click on the "profile icon" in their profile page. Simply follow the intuitive UI to play around.

### Prerequisities

----
- All prerequisites in package.json. Simply run npm install --save to install all necessary packages
- SLACK MIKE FOR FIRBASE LOGIN CREDENTIALS - to review firebase storage
----

## Built With

* VS CODE (mainly), SUBLIME 
* Adobe Photoshop/Illustrator for some icons, and visuals  

## Walk throughs of code
Most of our routes, utilize helpers (found in /helpers) to shorten our route code, and make it a little more difficult to understand if you're trying to steal code ;)

An ajax call was used in recordvideo.js to send video url's (retrieved from firbase) to a route where our app could retrieve and store in mySQL

## Authors

* **Michael Wolf** - *Full Stack - Specializing in Front End* - [Michael Wolf](https://github.com/mikelearning91)
* **Anthony Lubrino** - *Back End* - [Anthony Lubrino](https://github.com/Apofenic)
* **Ashmy Selvamony** - *Back End* - [Ashmy Selvamony](https://github.com/premiash)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Hat tip to anyone who's code was used. Especially:
* jTinder
* wNumb
* transform2d.js
* validate.js