import axios from "axios";
import { baseURL } from "../configs/zephyr.js";

export default axios.create({
  baseURL: baseURL,
  withCredentials: true
});
