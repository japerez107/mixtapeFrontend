import React, { Component } from "react";
import Container from "../Container";
import Row from "../Row";
import Col from "../Col";
import Card from "../Card";
import SearchForm from "../SearchForm";
import MixTapeDetail from "../MixTapeDetail";
import API from "../../utils/API";
import { List, ListItem } from "../List";
import DeleteBtn from "../DeleteBtn";
import SelectBtn from "../SelectBtn";
import queryString from 'query-string';


class MixTapeContainer extends Component {
  state = {
    result: "",
    search: "",
    selectedSendingPlaylistSearch: "",
    selectedSendingPlaylistData: [],
    selectedSendingPlaylistDetails: "",
    userData: "",
    banishedSongs: [],
    serverData: "",
    receivingPlaylist: "",
    userPlaylists: []
  };

  componentDidMount() {
    let SpotifyWebApi = require('spotify-web-api-node');
    let spotifyApi = new SpotifyWebApi();
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    this.viewMongoDbData()

    spotifyApi.setAccessToken(accessToken);

    spotifyApi.getMe()
      .then(data => this.viewMongoDbData(data.body.id), function (err) {
        console.log('Something went wrong!', err);
      })

    spotifyApi.getMe()
      .then(data => this.setState(
        {
          userData: data.body
        }), function (err) {
          console.log('Something went wrong!', err);
        });

    spotifyApi.getUserPlaylists(this.state.userData.id)
      .then(data => this.setState(
        {
          userPlaylists: data.body.items
        }), function (err) {
          console.log('Something went wrong!', err);
        }
      );
  };

  getPlaylistDetailsSetState = (trackUri, stateKey) => {
    let SpotifyWebApi = require('spotify-web-api-node');
    let spotifyApi = new SpotifyWebApi();
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    spotifyApi.setAccessToken(accessToken);
    let state = stateKey;
    spotifyApi.getPlaylist(trackUri)
      .then(data => {
        console.log('Selected Playlist Details', data.body);
        this.setState({ [`${state}`]: data.body })
      },
        function (err) {
          console.log('Something went wrong!', err);
        }
      );
  }

  getAllTracksSetState = (trackUri, stateKey) => {
    let state = stateKey;
    let offsetVal = 0;
    let offsetIncrementer = 0;
    const myPersonalPlaylistTracks = [];
    let final = {
      items: []
    };
    let getPlaylists = (offsetVal, trackUri) => {
      let SpotifyWebApi = require('spotify-web-api-node');
      let spotifyApi = new SpotifyWebApi();
      let parsed = queryString.parse(window.location.search);
      let accessToken = parsed.access_token;
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.getPlaylistTracks(trackUri, { limit: 100, offset: offsetVal })
        .then(data => {
          if (data.body.next != null) {
            console.log("On we Go!")
            data.body.items.forEach(function (val, index) {
              myPersonalPlaylistTracks.push(val);
            });
            offsetIncrementer += 100;
            getPlaylists(offsetIncrementer, trackUri)
          } else {
            data.body.items.forEach(function (val, index) {
              myPersonalPlaylistTracks.push(val);
              final.items = myPersonalPlaylistTracks;
            });
            console.log('Selected Playlist Contains These Tracks', final)
            this.setState({ [`${state}`]: final })
          }
        },
          function (err) {
            console.log('Something went wrong!', err);
          }
        );
    }
    getPlaylists(offsetVal, trackUri, stateKey);
  }


  viewMongoDbData = (currentUserId) => {
    API.getSongs(currentUserId)
      .then(res => this.setState({ banishedSongs: res.data }))
      .catch(err => console.log(err));
  };

  unBanishAllSongs = () => {
    API.deleteAllSongs(this.state.userData.id)
      .then(res => this.viewMongoDbData(this.state.userData.id))
      .catch(err => console.log(err));
  };

  deleteSong = id => {
    API.deleteSong(id)
      .then(res => this.viewMongoDbData(this.state.userData.id))
      .catch(err => console.log(err));
  };

  handleSaveSong = track => {
    let SpotifyWebApi = require('spotify-web-api-node');
    let spotifyApi = new SpotifyWebApi();
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.addTracksToPlaylist(this.state.selectedSendingPlaylistDetails.id, [`spotify:track:${track.id}`])
      .then(res => this.getAllTracksSetState(this.state.selectedSendingPlaylistSearch, 'selectedSendingPlaylistData'))
      .catch(err => console.log(err));
  };

  handleBanSong = track => {
    API.banSong({
      title: track.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      userName: this.state.userData.display_name,
      userId: this.state.userData.id,
      trackId: track.uri,
    })
      .then(res => this.viewMongoDbData(this.state.userData.id))
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  };

  handleReceivingPlaylistSubmit = event => {
    event.preventDefault();
    console.log(this.state.search);
    this.getAllTracksSetState(this.state.search, 'serverData');
    this.getPlaylistDetailsSetState(this.state.search, 'receivingPlaylist');
  };

  handleReceivingPlaylistSubmitLink = playlistId => {
    this.setState({ search: playlistId })
    this.getAllTracksSetState(playlistId, 'serverData');
    this.getPlaylistDetailsSetState(playlistId, 'receivingPlaylist');
  };

  handleSendingPlaylistSubmit = event => {
    event.preventDefault();
    console.log(this.state.selectedSendingPlaylistSearch);
    this.getAllTracksSetState(this.state.selectedSendingPlaylistSearch, 'selectedSendingPlaylistData');
    this.getPlaylistDetailsSetState(this.state.selectedSendingPlaylistSearch, 'selectedSendingPlaylistDetails');
  };

  handleSendingPlaylistSubmitLink = playlistId => {
    this.setState({ selectedSendingPlaylistSearch: playlistId })
    this.getAllTracksSetState(playlistId, 'selectedSendingPlaylistData');
    this.getPlaylistDetailsSetState(playlistId, 'selectedSendingPlaylistDetails');
  };

  render() {
    return (
      <Container>
        <Row>
          <Col size="md-8">
            <Card
              heading={this.state.receivingPlaylist.name}
            >
              {this.state.serverData ? (
                <MixTapeDetail
                  results={this.state.serverData}
                  onClickActionBan={this.handleBanSong}
                  onClickActionSave={this.handleSaveSong}
                  trackInDatabase={this.state.banishedSongs}
                  trackInReceivingDatabase={this.state.selectedSendingPlaylistData.items}
                  userIdCurrentlyLoggedIn={this.state.userData.id}
                />
              ) : (
                  <div>
                    <h3>Welcome to MixTape: <span style={{ backgroundColor: "coral" }}>{this.state.userData.display_name}</span></h3>
                  </div>
                )}
              {this.state.userData ? (
                  <div>
                  </div>
              ) : (
                <div>
                  <p>Click Login Button to Begin!</p>
                  <span
//////////////////////////////////FLIP COMMENTED/UNCOMMENTED BELOW TEXT ON LOCAL\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\                  
                    // onClick={() => window.location = 'http://localhost:8888/login'}
                    onClick={() => window.location = 'https://mixtapebackend.herokuapp.com/login'}
//////////////////////////////////FLIP COMMENTED/UNCOMMENTED ABOVE TEXT ON LOCAL\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\   
                    className="btn btn-primary"
                    role="button"
                    tabIndex="0">
                    Login to Spotify
                  </span>
                </div>
                )}
            </Card>
          </Col>
          <Col size="md-4">
            <Card heading="Playlists">
              {this.state.selectedSendingPlaylistDetails ? (
                <div>
                  <h3>Select Public Playlist</h3>
                </div>
              ) : (
                  <div>
                  </div>
                )}
              {this.state.selectedSendingPlaylistDetails ? (
                <div>
                  <SearchForm
                    placeholder="Public Playlist URI"
                    buttonText="Submit"
                    value={this.state.search}
                    handleInputChange={this.handleInputChange}
                    name="search"
                    handleFormSubmit={this.handleReceivingPlaylistSubmit}
                  />
                  <h3 style={{backgroundColor: "coral"}}>{this.state.receivingPlaylist.name}</h3>
                  <h5>Your saved public playlists</h5>
                  <List>
                    {this.state.userPlaylists.map(item => (
                      <div key={item.id} style={{ display: item.owner.id === this.state.userData.id ? 'none' : '' }}>
                        <ListItem>
                          <strong>
                            {item.name}
                          </strong>
                          <SelectBtn onClick={() => this.handleReceivingPlaylistSubmitLink(item.id)} />
                        </ListItem>
                      </div>
                    ))}
                  </List>
                </div>
              ) : (
                  <div>
                    <h3>Select Your Playlist</h3>
                  </div>
                )}
              <br/>
              <h3 style={{backgroundColor: "coral"}}>{this.state.selectedSendingPlaylistDetails.name}</h3>
              <h5>Your personal playlists</h5>
              <List>
                {this.state.userPlaylists.map(item => (
                  <div key={item.id} style={{ display: item.owner.id === this.state.userData.id ? '' : 'none' }}>
                    <ListItem>
                      <strong>
                        {item.name}
                      </strong>
                      <SelectBtn onClick={() => this.handleSendingPlaylistSubmitLink(item.id)} />
                    </ListItem>
                  </div>
                ))}
              </List>
            </Card>
            <Card heading="Banished Songs">
              {this.state.userData ? (
                <span
                  onClick={() => this.unBanishAllSongs()}
                  className="btn btn-success"
                  role="button"
                  tabIndex="0">
                  Unbanish All Songs
                </span>
              ) : (
                  <div>
                  </div>
                )}
              <List>
                {this.state.banishedSongs.map(banishedTrack => (
                  <ListItem key={banishedTrack._id}>
                    <strong>
                      <u>
                        {banishedTrack.title}
                      </u>
                      <br />
                      by {banishedTrack.artists}
                    </strong>
                    <DeleteBtn onClick={() => this.deleteSong(banishedTrack._id)} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default MixTapeContainer;
