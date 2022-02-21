
import BlockChain from "./BlockChain.js";

const socket = io();

socket.on('connect', () => {
    console.log(BlockChain.id);
});
socket.on('join', ({coin}) => {
    console.log(coin);
});

const peerConn = new RTCPeerConnection();
