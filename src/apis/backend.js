import axios from "axios";
import { baseURL } from "../configs/backend.js";

export default axios.create({
  baseURL: baseURL,
});
