import React from "react";
import SpotifyPlayer from 'react-spotify-player';

function MixTapeDetail(props) {
  // CSS for hiding songs already in our database
  const hideStyle = {
    display: 'none',
    // margin: '40px',
    // border: '5px solid blue'
  };
  const showStyle = {
    margin: '40px',
    border: '5px solid pink'
  };

  //CSS for Spotify Players
  const size = {
    width: '100%',
    height: 80,
  };
  const view = 'list';
  const theme = 'black';
  return (
    <div className="text-center">
      {console.log("Songs Currently in Personal Playlist", props.trackInReceivingDatabase)}
      {console.log("Songs Currently in Banished Database", props.trackInDatabase)}
      {props.results.items.map(result => (
        <div
          key={result.track.uri}
          style={
            (props.trackInDatabase.some(e => e.trackId === result.track.uri)) || (props.trackInReceivingDatabase.some(e => e.track.uri === result.track.uri))
            ? hideStyle
            : showStyle
            }>
          <SpotifyPlayer
            uri={result.track.uri}
            size={size}
            view={view}
            theme={theme}
          />
          <span
            onClick={() => { props.onClickActionBan(result.track) }}
            className="btn btn-danger"
            role="button"
            tabIndex="0">
            Banish
          </span>
          <span
            onClick={() => { props.onClickActionSave(result.track) }}
            className="btn btn-success"
            role="button"
            tabIndex="0">
            Save
          </span>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default MixTapeDetail;