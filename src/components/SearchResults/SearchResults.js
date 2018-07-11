//Import anything we plan to touch outside of this file so that we can access it
import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {
    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                {/* TrackList component that will need props interact with the App class - these are pass thru */}
                <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false} />
            </div>
        );
    }
};

export default SearchResults;