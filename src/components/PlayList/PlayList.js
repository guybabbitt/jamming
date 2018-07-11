//Import anything we plan to touch outside of this file so that we can access it
import React from 'react';
import './PlayList.css';
import TrackList from '../TrackList/TrackList';

class PlayList extends React.Component {
    //Adding constructor so that we can bind our event handler to 'this'
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    //Handle changes to the input control, leveraging the propering passed down to this component
    //We can send the changes back up to App to be stored in state
    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }
    
    render() {
        return (
            <div className="Playlist">
                {/* Add our playlist component and bind to our event handler */}
                <input defaultValue={'New Playlist'} onChange={this.handleNameChange}/>
                    {/* Add in our Tracklist component and pass down the necessary properties */}
                    <TrackList tracks={this.props.playlistTracks} isRemoval={true} onRemove={this.props.onRemove} />
                {/* Save button is tied back to the App savePlaylist method via the property passed down */}
                <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
            </div>
        );
    }
};

export default PlayList;