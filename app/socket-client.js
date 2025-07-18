import { io } from "socket.io-client";
const socket = io(); // assumes same origin
export default socket;