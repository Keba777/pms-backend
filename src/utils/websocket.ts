import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import {
    fetchUsersExcluding
} from '../controllers/user.controller';
import {
    saveMessage,
    getMessageHistory,
    markAsRead
} from '../controllers/chat.controller';

export function initializeWebSocket(server: http.Server) {
    const io = new SocketIOServer(server, { cors: { origin: '*' } });

    // Authenticate the socket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
            socket.data.userId = payload.userId;
            return next();
        } catch {
            return next(new Error('Authentication error'));
        }
    });

    io.on('connection', socket => {
        const userId = socket.data.userId as string;
        socket.join(userId);

        // 1) Send all other users
        fetchUsersExcluding(userId)
            .then(list => socket.emit('users_list', list))
            .catch(console.error);

        // 2) Handle outgoing message
        socket.on('send_message', async ({ to, content }) => {
            const msg = await saveMessage(userId, to, content);
            io.to(to).to(userId).emit('new_message', msg);
        });

        // 3) Handle history request
        socket.on('get_history', async ({ withUser }) => {
            const history = await getMessageHistory(userId, withUser);
            socket.emit('message_history', history);
        });

        // 4) Typing indicator
        socket.on('typing', ({ to, isTyping }) => {
            socket.to(to).emit('typing', { from: userId, isTyping });
        });

        // 5) Read receipts
        socket.on('mark_read', async ({ from }) => {
            await markAsRead(from, userId);
            io.to(from).emit('read_receipt', { from: userId });
        });
    });

    return io;
}
