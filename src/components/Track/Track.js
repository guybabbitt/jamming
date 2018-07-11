//Import anything we plan to touch outside of this file so that we can access it
import React from 'react';
import './Track.css';

class Track extends React.Component {
    //Build out out constructor so we have an instance to bind to and reference from the render method
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    //Call back to App to add the selected track to the tracklist in state
    addTrack() {
        this.props.onAdd(this.props.track);
    }

    //Call back to App to remove the selected track from the tracklist in state
    removeTrack() {
        this.props.onRemove(this.props.track);
    }
    
    //Simple method to abstract code that will look at each track to make sure we bind to the right event handler
    //We will leverage this during render
    renderAction() {
        return this.props.isRemoval ? <a className="Track-action" onClick={this.removeTrack}>-</a> : <a className="Track-action" onClick={this.addTrack}>+</a>;
    }
    
    render() {
        return(
            <div className="Track">
                <div className="Track-information">
                    {/* Use the info passed down from state for this track */}
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {/* Uses or method in this component to determine the add or remove action for this track */}
                {this.renderAction()}
            </div>
        );
    }
};

export default Track;