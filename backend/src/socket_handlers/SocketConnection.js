import { instrument } from '@socket.io/admin-ui';
import jwt from 'jsonwebtoken';

import BidSocketHandler from './BidSocketHandler.js';
import { User } from '../models/user.model.js';
import { EVENTS, NAMESPACES } from '../utils/socketConstants.js';

class SocketConnection {
  constructor(io) {
    this.io = io;
    this.BidSocketHandler = new BidSocketHandler(io);
    this.setupAdminUI();
    this.setupAuthMiddleware();
    this.setupEventHandlers();
  }

  setupAdminUI() {
    instrument(this.io, {
      auth: false,
      mode:
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
      serverId: 'bidify-server',
    });
    const adminNamespace = this.io.of(NAMESPACES.ADMIN);

    adminNamespace.use(async (socket, next) => {
      const isAdmin = true;

      if (!isAdmin) {
        return next(new Error('Admin access required'));
      }
      next();
    });

    adminNamespace.on(EVENTS.CONNECTION, (socket) => {
      console.info('Admin connected:', socket.id);

      socket.on(EVENTS.GET_ACTIVE_USERS, () => {
        const sockets = this.io.sockets.sockets;
        const activeUsers = Array.from(sockets).map(([id, socket]) => ({
          id,
          email: socket.user?.email,
          rooms: Array.from(socket.rooms),
        }));
        socket.emit(EVENTS.ACTIVE_USERS_LIST, activeUsers);
      });
    });
  }
  setupAuthMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const authHeader =
          socket.handshake.auth.token || socket.handshake.headers.authorization;

        if (!authHeader) {
          throw new Error('No token provided');
        }

        const token = authHeader.replace('Bearer ', '');

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
          throw new Error('User not found');
        }

        socket.user = user;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error.message);
        next(new Error('Authentication failed'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on(EVENTS.CONNECTION, (socket) => {
      console.info(`✅ Authenticated user connected: ${socket.user.email}`);
      this.io.emit(EVENTS.USER_CONNECTED, { email: socket.user.email });

      socket.on(EVENTS.JOIN_ITEM_ROOM, (itemId) => {
        this.BidSocketHandler.handleJoinItemRoom(socket, itemId);
      });

      socket.on(EVENTS.LEAVE_ITEM_ROOM, (itemId) => {
        this.BidSocketHandler.handleLeaveItemRoom(socket, itemId);
      });

      socket.on(EVENTS.PLACE_BID, (data) => {
        this.BidSocketHandler.handleBidPlacement(socket, data);
      });

      socket.on(EVENTS.DISCONNECT, () => {
        console.info(`❌ User disconnected: ${socket.user.email}`);
      });
    });
  }
}

export default SocketConnection;
