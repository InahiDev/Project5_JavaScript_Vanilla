# Kanap #

This is the front end and back end server for Project 5 of the Web Developer path.

### Back end Prerequisites ###

You will need to have Node and `npm` installed locally on your machine.

### Back end Installation ###

Clone this repo. From the "back" folder of the project, run `npm install`. You 
can then run the server with `node server`. 
The server should run on `localhost` with default port `3000`. If the
server runs on another port for any reason, this is printed to the
console when the server starts, e.g. `Listening on port 3001`.

## Front end work made by the student Gabriel Delaigue ##

My tasks were to dynamically insert and control datas.</br>
The data store is implemented directly in the backend part, and can be reached with a fetch (GET verb) on the port the backend server runs.</br>
My job was then to get these infos and create the code, following HTML examples commented, to create and insert in the DOM everything needed.</br>
Once the second part was the check, and the exchange of informations between pages, in a secured manner.</br>
Finally once everything correctly formatted and verified, fetching the "API" once again but with a POST method to retrieve an id for the order.</br>
The bonuses i settled in this project were oriented toward the check and feedback for the user inputs.</br>
Every input has its own error message dynamically changing if the changes made are in a certain way not expected by the application.</br>
Some improvments could be made by adding popups to confirm actions, but since this project still needs to be generally validated byt he grand jury, those improvments will have to stay stached.
