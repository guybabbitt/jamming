import React, { Component } from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import SearchBar from '../SearchBar/SearchBar';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'Guy\'s List',
      playlistTracks: [
        {
          name: 'List Song 1',
          artist: 'List Artist 1',
          album: 'List Album 1',
          id: 'id1'
        },
        {
          name: 'List Song 2',
          artist: 'List Artist 2',
          album: 'List Album 2',
          id: 'id2'
        }
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let newPlaylistTracks = this.state.playlistTracks;
    console.log(newPlaylistTracks);
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      newPlaylistTracks.push(track);
      this.setState({ playlistTracks: newPlaylistTracks });
    }
  }

  removeTrack(track) {
    let newPlaylistTracks = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      this.setState({ searchResults: tracks});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <PlayList playlistTracks={this.state.playlistTracks} playlistName={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
