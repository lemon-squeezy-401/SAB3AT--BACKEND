'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    // origin: 'http://localhost:3000',
  },
});

require('dotenv').config();
const staffRoom = 'staff';
const { v4: uuidv4 } = require('uuid');

const formatMessage = require('../src/messages/utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('../src/messages/utils/users');
const authRoutes = require('./routes/auth.routes');
const panelRoutes = require('./routes/controlPanal.routes');
const productRoutes = require('./routes/product.routes');
const serviceRoutes = require('./routes/servives.routes');
const profileRoutes = require('./routes/profile.routes');
const User = require('./auth/models/users');
const notFoundHandler = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  // Access-Control-Allow-Credentials: true,
}));
app.use(morgan('dev'));
app.use(authRoutes);
app.use(panelRoutes);
app.use(productRoutes);
app.use(serviceRoutes);
app.use(profileRoutes);

const PORT = process.env.PORT;

// app.get('/', (req, res) => {
//   res.send('SAB3AT');
// });

/**======================================SOCKET.IO============================================ */
// Set static folder
app.use(express.static(path.join(__dirname, './messages/public')));

const botName = 'Texting Bot';

// Run when client connects
io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, `Welcome to ${room} room`));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`),
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  /**======================================Ticket Sockete io============================================ */

  socket.on('join', (payload) => {
    // socket.join will put the socket in a private room
    // console.log('-------join----------');
    socket.join(staffRoom);
    socket
      .to(staffRoom)
      .emit('onlineStaff', { name: payload.name, id: socket.id });
  });

  socket.on('createTicket', (payload) => {
    // 2
    // console.log('-------cerateticket----------');
    // console.log(payload);
    let url = `http://localhost:${PORT}/payment/`;
    socket.emit('redirect', url);

    try {
      User.find({ _id: payload.sallerId }, (error, data) => {
        data[0].unConfermedReq.push(payload);
        data[0].save();
      });
    } catch (error) {
      console.error(error);
    }

    socket.in(staffRoom).emit('newTicket', {
      ...payload,
      id: uuidv4(),
      socketId: socket.id,
    });
  });

  socket.on('claim', (payload) => {
    // when a TA claim the ticket we need to notify the student
    // console.log('-------claim tecket----------');
    let count = 0;
    let idx;
    User.find({ _id: payload.sallerId }, (error, data) => {
      data[0].unConfermedReq.map((info) => {
        count++;
        if (payload.serviceOrproductId == info.serviceOrproductId) {
          data[0].confirmedReq.push(info);
          idx = count - 1;
          data[0].unConfermedReq.splice(idx, 1);
          data[0].save;
        }
      });
    });

    socket.to(payload.studentId).emit('claimed');
  });

  socket.on('reject', (payload) => {
    // when a TA claim the ticket we need to notify the student
    // console.log('-------reject tecket----------');

    let count = 0;
    let idx;
    User.find({ _id: payload.sallerId }, (error, data) => {
      data[0].unConfermedReq.map((info) => {
        count++;
        if (payload.serviceOrproductId == info.serviceOrproductId) {
          data[0].rejectedReq.push(info);
          idx = count - 1;
          data[0].unConfermedReq.splice(idx, 1);
          data[0].save;
        }
      });
    });
    socket.to(payload.studentId).emit('rejected', { name: payload.name });
  });

  /**======================================Disconnect============================================ */

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    console.log('user disconnected');

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`),
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
/**======================================SOCKET.IO============================================ */

//============================payment======================================//
/* 
line_items: [
  {
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'any', the name should be equal the request.body.name
      },
      unit_amount: 2000, the amount should be equal to the request.body.price
    },
    quantity: 1, it should always be 1
  },
],
*/
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

app.post('/create-checkout-session', async (req, res) => {
  req.body = {
    name: 'service',
    price: 5000,
  };
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: req.body.name,
          },
          unit_amount: req.body.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:${PORT}/payment/success.html`,
    cancel_url: `http://localhost:${PORT}/payment/cancel.html`,
  });

  res.redirect(303, session.url);
});
app.use('/payment',express.static(path.join(__dirname, './payments')));
//============================payment======================================//


app.use('*', notFoundHandler);
app.use(errorHandler);

const start = () => {
  if (!PORT) {
    throw new Error('Missing Port');
  }
  server.listen(PORT || 3001, () => console.log(`Listening on ${PORT}`));
};

module.exports = {
  server: app,
  start: start,
};