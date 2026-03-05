import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class WebRTCService {
    constructor() {
        this.socket = null;
        this.peer = null;
        this.stream = null;
    }

    connect(userId) {
        if (this.socket) return;

        this.socket = io(SOCKET_URL);
        this.socket.on('connect', () => {
            console.log('Connected to signaling server');
            this.socket.emit('register', userId);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.destroyPeer();
    }

    joinRoom(roomId, appointmentId, userId) {
        if (!this.socket) return;
        this.socket.emit('join-room', { roomId, appointmentId, userId });
    }

    leaveRoom(roomId, userId) {
        if (!this.socket) return;
        this.socket.emit('leave-room', { roomId, userId });
        this.destroyPeer();
    }

    destroyPeer() {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
    }

    initializePeer(isInitiator, stream, onSignal, onStream, onClose) {
        this.destroyPeer();

        this.peer = new Peer({
            initiator: isInitiator,
            trickle: false,
            stream: stream
        });

        this.peer.on('signal', (data) => {
            onSignal(data);
        });

        this.peer.on('stream', (remoteStream) => {
            onStream(remoteStream);
        });

        this.peer.on('close', () => {
            onClose();
        });

        this.peer.on('error', (err) => {
            console.error('Peer error:', err);
            onClose();
        });

        return this.peer;
    }

    signal(data) {
        if (this.peer) {
            this.peer.signal(data);
        }
    }

    emitOffer(roomId, offer) {
        if (this.socket) {
            this.socket.emit('offer', { roomId, offer });
        }
    }

    emitAnswer(roomId, answer) {
        if (this.socket) {
            this.socket.emit('answer', { roomId, answer });
        }
    }

    emitIceCandidate(roomId, candidate) {
        if (this.socket) {
            this.socket.emit('ice-candidate', { roomId, candidate });
        }
    }

    onUserJoined(callback) {
        if (this.socket) {
            this.socket.on('user-joined', callback);
        }
    }

    onOffer(callback) {
        if (this.socket) {
            this.socket.on('offer', callback);
        }
    }

    onAnswer(callback) {
        if (this.socket) {
            this.socket.on('answer', callback);
        }
    }

    onIceCandidate(callback) {
        if (this.socket) {
            this.socket.on('ice-candidate', callback);
        }
    }

    onUserLeft(callback) {
        if (this.socket) {
            this.socket.on('user-left', callback);
        }
    }

    removeListeners() {
        if (this.socket) {
            this.socket.off('user-joined');
            this.socket.off('offer');
            this.socket.off('answer');
            this.socket.off('ice-candidate');
            this.socket.off('user-left');
        }
    }
}

const webrtcService = new WebRTCService();
export default webrtcService;
