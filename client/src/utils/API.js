import axios from "axios";

export default {
  // Gets all songs
  getSongs: function (loggedInUserId) {
    return axios.get("/api/tracks/?q=" + loggedInUserId);
  },
  // Saves track to the database
  banSong: function (trackData) {
    return axios.post("/api/tracks", trackData);
  },
  // Deletes the track with the given id
  deleteSong: function (id) {
    return axios.delete("/api/tracks/" + id);
  },
  // Deletes the track with the given id
  deleteAllSongs: function (loggedInUserId) {
    return axios.delete("/api/tracks/?q=" + loggedInUserId);
  }
};
