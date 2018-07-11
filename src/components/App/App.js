//Import anything we plan to touch outside of this file so that we can access it
import React, { Component } from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import SearchBar from '../SearchBar/SearchBar';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';

//Our App class is the core content renderer that will maintain overall state and render the controls in the right place
//Additionally, we will pass state to controls via properties in the component reference
class App extends Component {
  //Our constructor will allow us to establish state and bind the methods we declare to 'this' so they can be referenced
  //within the render method
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    //If we delare a method in the class that we intend to reference in render we need to bind it to 'this'
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  //Add search result to our playlist
  addTrack(track) {
    //Copy our current playlist so we can make some changes
    let newPlaylistTracks = this.state.playlistTracks;
    //Test to see if the track being added is already in our list
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      //Not there, so add to the array and set state with the change
      newPlaylistTracks.push(track);
      this.setState({ playlistTracks: newPlaylistTracks });
    }
  }

  //Remove track from playlist
  removeTrack(track) {
    //There is an even more efficient way to write this block that I don't fully understand so leaving as is for now
    //Use the filter function on our array to add tracks to our array that do not have the id of the track to be removed
    let newPlaylistTracks = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    //Save the changes to state
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  //Used to set a new playlist name
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  //Save our playlist to Spotify
  savePlaylist() {
    //Create an array of track uris from the playlist tracks URI attribute
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    //Call our Spotify object to save the playlist
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    //Reset the playlist name and clear the tracks after save
    //One thing I am unclear on - is this a potential risk due to the async nature of the previous call?
    //Does this call wait for the previous to finish?  If not, should it get chained with a .then() to be safe?
    this.setState({
      playListName: 'New Playlist',
      playlistTracks: []
    });
  }

  //Search Spotify for a term
  search(searchTerm) {
    //Use our search method in the Spotify object and when it returns add the results to state so we can display them
    //down stream
    Spotify.search(searchTerm).then(tracks => {
      this.setState({ searchResults: tracks});
    });
  }

  //Used to draw to screen
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            {/* SearchBar component that will need a prop to interact with this class */}
            <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            {/* SearchResults component that will need props interact with this class */}
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            {/* PlayList component that will need props interact with this class */}
            <PlayList playlistTracks={this.state.playlistTracks} playlistName={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
