import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-my-burger-c7ab7.firebaseio.com/",
});

export default instance;
