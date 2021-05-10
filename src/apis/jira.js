import axios from "axios";
import {
  baseURL,
  authURL
} from "../configs/jira.js";

export default axios.create({
  baseURL: baseURL,

  headers: {
    accept: "application/json",
    auth: {
      username: "n110382",
      password: "Mtsrobo67@"
    },
    withCredentials: true
  },
});
