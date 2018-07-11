//Import anything we plan to touch outside of this file so that we can access it
import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {
                    //We will leverage the tracks proptery (an array of tracks) passed to us and render a track component
                    //for each element in the array - we will also pass along the props that the recieving component will need
                    this.props.tracks.map(track => {
                        return <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>;
                    })
                }
            </div>
        );
    }
};

export default TrackList;