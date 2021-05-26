if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const express = require('express')
const app = express()
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

const indexRouter = require('./routes/index')
const doctorRouter = require('./routes/doctors')
const appointmentRouter = require('./routes/appointments')
const adminRouter = require('./routes/admin')
const physicianRouter = require('./routes/physicians')
const roomRouter = require('./routes/room')
const prescriptionRouter = require('./routes/prescription')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use("/peerjs", peerServer);
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/doctors', doctorRouter)
app.use('/appointments', appointmentRouter)
app.use('/admin', adminRouter)
app.use('/physician', physicianRouter)
// app.use('/room', roomRouter)
app.use('/prescription', prescriptionRouter)


app.get("/room", (req, res) => {
  res.redirect(`/room/${uuidv4()}`);
});

app.get("/room/:room", (req, res) => {
  res.render("room", { roomId: req.params.room, layout : 'layouts/room' });
});


io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

app.listen(process.env.PORT || 3000)