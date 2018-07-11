let accessToken;
const clientID = '49934d924afa4383a39a384de6250b58';
const redirectURI = 'http://localhost:3000/';
const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        } else {
            const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
            const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
            if (accessTokenMatch && expiresInMatch) {
                accessToken = accessTokenMatch[1];
                const expiresIn = parseInt(expiresInMatch[1], 10);
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken;
            } else {
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`;
            }
        }
    },
    search(term) {
        accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.tracks.items) {
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
    savePlaylist(playlistName, trackURIs) {
        if (playlistName && trackURIs) {
            accessToken = Spotify.getAccessToken();
            let user_id;
            const headers = {Authorization: `Bearer ${accessToken}`};
            return fetch(`https://api.spotify.com/v1/me`, {
                headers: headers
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                user_id = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: playlistName })
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    let playlist_id = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`, {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ uris: trackURIs})
                    });
                });
            });
        } else {
            return;
        }
    }
}

export default Spotify;