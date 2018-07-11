import React from 'react';
import './PlayList.css';
import TrackList from '../TrackList/TrackList';

class PlayList extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    handleNameChange(e) {
        this.props.onNameChange(e.value);
        console.log(e.target.value);
    }
    
    render() {
        return (
            <div className="Playlist">
                <input defaultValue={'New Playlist'} onChange={this.handleNameChange}/>
                    <TrackList tracks={this.props.playlistTracks} isRemoval={true} onRemove={this.props.onRemove} />
                <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
            </div>
        );
    }
};

export default PlayList;