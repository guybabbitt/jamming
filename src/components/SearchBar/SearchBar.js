//Import anything we plan to touch outside of this file so that we can access it
import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    //Build out out constructor so we have an instance to bind to and reference from the render method
    //We are also storing their search term in state to be passed back to App when the click Search
    constructor(props) {
        super(props);
        this.state = {
            term: ''
        }
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    //Use the property passed down to execute the search through App with Spotify
    search() {
        this.props.onSearch(this.state.term);
    }

    //Each time a character is typed, update state so we are storing the most current version of their term
    //Not sure why to us an approach like this vs. just looking at the current value of the input control
    //when they press search, seems like that would be less code and less events firing but this is how the solution
    //was outlined
    handleTermChange(e) {
        this.setState({ term: e.target.value })
    }

    render() {
        return (
            <div className="SearchBar">
                {/* Bind input to a change event to track keystrokes */}
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={event => {
            if(event.key === 'Enter'){
              this.search()
            }}} />
                {/* Fire our search method which will call back to App with the current term stored in state */}
                <a onClick={this.search}>SEARCH</a>
            </div>
        );
    }
};

export default SearchBar;