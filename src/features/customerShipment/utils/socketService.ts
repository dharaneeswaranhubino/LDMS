import { io, Socket } from 'socket.io-client';

const BASE_URL = 'https://logisticsanddeliverymanagementsystem.onrender.com';

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
    if (socket?.connected) return socket;
    if (socket) socket.disconnect();
    socket = io(BASE_URL, {
        auth: { token },
        transports: ['websocket'],
    });
    return socket;
};

export const emitWhenConnected = (
    socket: Socket,
    event: string,
    data: unknown
) => {
    if (socket.connected) {
        socket.emit(event, data);
    } else {
        socket.once('connect', () => {
            socket.emit(event, data);
        });
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};