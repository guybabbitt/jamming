//Variables used across our object

//Will be used to store the user access token we get back
let accessToken;
//Developer client id associated with my app in Spotify
const clientID = '49934d924afa4383a39a384de6250b58';
//Where to return after the request is fulfilled
const redirectURI = 'http://localhost:3000/';

//Object used to interface with Spotify
const Spotify = {
    //Request an access token allowing us to work with the users Spotify account
    getAccessToken() {
        if (accessToken) {
            //Already populated so return it
            return accessToken;
        } else {
            //No token, so we need to check the URL for the info we need (access token and expires info)
            //This is returned to the querystring after a spotify login, but the downside is you have to do
            //your search again to hit this block of code to parse that out
            //Regular expression used to extract those if they exist
            const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
            const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
            //Does the URL have the info we need?
            if (accessTokenMatch && expiresInMatch) {
                accessToken = accessTokenMatch[1];
                const expiresIn = parseInt(expiresInMatch[1], 10);
                //this code block below produces an odd behavior in that it causes the result set to disappear on first search
                //after screen is reloaded - you have to search again to get results to show up
                //I am not completely clear on what these two lines of code do so unsure on how to work around
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/'); 
                return accessToken;
            //URL does not have what we need so make a call out to Spotify authorize endpoint
            } else {
                /*
                We are leveraging implicit grant flow which can be found here https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
                We have added a scope to let us modify a public playlist for the user
                https://developer.spotify.com/documentation/general/guides/scopes/#playlist-modify-public
                */
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`;
                //After login they are returned to redirect URI with the Spotify info we need appended to querystring
            }
        }
    },
    //Method used for searching Spotify
    search(term) {
        //Set our access token
        accessToken = Spotify.getAccessToken();
        //Make the search request to Spotify
        //Documentation here https://developer.spotify.com/documentation/web-api/reference/search/search/
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                //Documentation outlines the need to pass the access token
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            //Search complete - return the response
            //Problem is this is brittle as the first request to getAccessToken will not be authorized
            //We will sniff out the 401 and handle it by rejecting the promise, preventing the code 
            //from blowing when it tries to process the jsonResponse
            //Error handling seemed to be outside the scope of this exercise so this is the only place I played with it
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                //The issue with this 401 is that once the user logs in they are just dumped back to the 
                //Jamming app without any visual queue that they need to execute their search again
                //Need to think of a solution for this
                return Promise.reject('Unauthorized request');
            } else {
                this.tossCookies();
            }            
        }, error => console.log(error.message)).then(jsonResponse => {
            //Response acquired - check the structure for results
            if (jsonResponse.tracks.items) {
                //We have items in our response so build an array with the attributes we need for each track
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            };
        });
    },
    //Method used for saving Spotify playlist, needs the playlist name and an array of the tracks we want to save
    savePlaylist(playlistName, trackURIs) {
        //Are the parameters truthy?
        if (playlistName && trackURIs) {
            //Set our access token
            accessToken = Spotify.getAccessToken();
            //used to store id after initial fetch
            let user_id;
            //We will be passing our access token a few times so store the header in a variable for reuse
            const headers = {Authorization: `Bearer ${accessToken}`};
            //First up we need to get their user id from their profile
            //Make a request to the endpoint
            //https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
            return fetch(`https://api.spotify.com/v1/me`, {
                headers: headers
            }).then(response => {
                //Successful response so pass on for analysis
                return response.json();
            }).then(jsonResponse => {
                //Grab the user_id from the profile returned
                user_id = jsonResponse.id;
                //Now make to create the new playlist passed into this method
                //https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/
                return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: playlistName })
                }).then(response => {
                    //Success, pass on the response so we have the playlist id to add tracks to
                    return response.json();
                }).then(jsonResponse => {
                    //Story the playlist id
                    let playlist_id = jsonResponse.id;
                    //Now add our tracks to this new playlist
                    //https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/
                    return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`, {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ uris: trackURIs})
                    });
                });
            });
        } else {
            //Falsy parameters to bail
            return;
        }
    },
    tossCookies() {
        throw new Error('Request failed');
    }
}

export default Spotify;