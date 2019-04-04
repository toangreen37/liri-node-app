// all Requirement listed 

require("dotenv").config();

const keys = require("./keys.js");

const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

const axios = require("axios");

const fs = require("fs");

const moment = require("moment");

// variables to capture user command and user input 
let command = process.argv[2];
// splice used to join input incase user enter a input with more than 1 word
let userSearch = process.argv.slice(3).join(" ");

// Takes user command and input and put into switch/case 
function liri(command, userSearch) {
    switch (command) {
        case "movie-this":
            movieThis(userSearch);
            break;
        case "concert-this":
            concertThis(userSearch);
            break;
        case "spotify-this":
            songThis(userSearch);
            break;
        default:
            console.log("Please enter a command: 'movie-this', 'concert-this', 'spotify-this'"); 
    }
}

//function for running OMDB movie search 
function movieThis(movie) {
    // if no movie is enter, "Mr. Nobody" will be used as default 
        if (!movie) {
            movie = "Mr. Nobody";
        }
        var movieUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=6b819811";

        axios.get(movieUrl).then(
            function(response) {
                console.log("\n" + movieUrl);
                console.log("\n=====Searching=====");
                this.divider = "\n------------------------------------------------------------\n\n";

                const movieData = [

                "Movie Name: " + response.data.Title,
                "Release Year: " + response.data.Year,
                "IMDB Rating: " + response.data.imdbRating,
                "Rotten Tomato Rating: " + response.data.Ratings[1].Value,
                "Country produced in: " + response.data.Country,
                "Language: " + response.data.Language,
                "Plot: " + response.data.Plot,
                "Actor: " + response.data.Actors,
                ];
                console.log(movieData);

                fs.appendFile("log.txt", movieData + this.divider, function(err) {
                    if (err) throw err; 
                })
            }   
        )
    }

// Function for running bandsintown API search 
function concertThis(band) {
    this.divider = "\n------------------------------------------------------------\n\n";

        var bandUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";

        axios.get(bandUrl).then(
            function(response) {
                console.log("\n" + bandUrl);
                console.log("\n=====Searching=====");

                const bandData = [
                    "Name of venue: " + response.data[0].venue.name,
                    "Venue Location: " + response.data[0].venue.city,
                    "Date of event: " + moment(response.data[0].datatime).format("MM-DD-YYYY"),
                 ];
                console.log(bandData);

                fs.appendFile("log.txt", bandData + this.divider, function(err) {
                    if (err) throw err; 
                }
            
                )
            }
        )
}

//function for spotify API
function songThis(song) {

// if no song is enter, it will default to "The Sign"
    if (!song) {
        song = "The Sign";
    };


spotify.search({ type: 'track', query: song }, function (err, data) {

//Error catcher 
    if (err) {
       return console.log('Error occurred: ' + err); 
    }
    console.log("\n")
    console.log("=====Searching=====");

    const spotifyData = [

    "Artist Name: " + data.tracks.items[0].album.artists[0].name,
    "Song Name: " + data.tracks.items[0].name,
    "Song Preview : " + data.tracks.items[0].href,
    "Album: " + data.tracks.items[0].album.name, ];

    console.log(spotifyData);

    fs.appendFile("log.txt", spotifyData, this.divider, function(err) {
        if (err) throw err;
    });
    });
};


liri(command, userSearch);