// importing required packages
import express from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

//cretating new express app and save it as app
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

dotenv.config();
// server configuration
const PORT = process.env.PORT;

//make the server listen to the request
app.listen(PORT, console.log("Server running in port number :" + PORT));

const MONGO_URL = process.env.MONGO_URL;

//create connection to the MongoDB
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("MonogDB has been Started");
  return client;
}

//make client as globally available
const client = await createConnection();

//create Home route for the app
app.get("/", (req, res) => {
  res.send("Welcome to YOYO");
});

let rooms = [];
let bookingRec = [];

// create room 
app.post("/create-room", async (req, res) => {
  let room = {};
  
  // check the noofseats data present in body then assign to noOfseats
  if (req.body.noofseats) room.noofseats = req.body.noofseats;
  else {
    res.status(400).send({ Message: "Please specify No of seats for Room" });
    return;
  }
 // check the amenities data present in body then assign to amenities
  if (req.body.amenities) room.amenities = req.body.amenities;
  else {
    res.status(400).send({
      Message: "Please specify all Amenities for Room in Array format",
    });
    return;
  }
  // check the price data present in body then assign to price
  if (req.body.price) room.price = req.body.price;
  else {
    res.status(400).send({ Message: "Please specify price per hour for Room" });
    return;
  }

  //push the room data into rooms
  rooms.push(room);
  
  await client.db("YOYO").collection("rooms").insertOne(room);
  room
    ? res.status(200).send({ Message: " Room created Successfully" })
    : res.status(500).send({ Message: " Please provide details " });
});

app.post("/create-booking", async (req, res) => {
  let booking = {};
  // check the roomId data present in body then assign to roomId
  if (req.body.roomId) booking.roomId = req.body.roomId;
  else {
    res.status(400).send({ Message: "Please Specify RoomId" });
    return;
  }
  // check the custName data present in body then assign to custName
  if (req.body.custName) booking.custName = req.body.custName;
  else {
    res.status(400).send({ Message: "Please Specify Customer Name" });
    return;
  }
  // check the Date data present in body then assign to Date
  if (req.body.Date) booking.Date = req.body.Date;
  else {
    res.status(400).send({ Message: "Please Specify date for Booking" });
    return;
  }
  // check the startTime data present in body then assign to startTime
  if (req.body.startTime) booking.startTime = req.body.startTime;
  else {
    res.status(400).send({ Message: "Please Specify Start Time for Booking" });
    return;
  }
  // check the endTime data present in body then assign to endTime
  if (req.body.endTime) booking.endTime = req.body.endTime;
  else {
    res.status(400).send({ Message: " Please Specify End Time for Booking " });
    return;
  }
 //push booking data into bookingRec
  bookingRec.push(booking);
  await client.db("YOYO").collection("bookings").insertOne(booking);
  bookingRec
    ? res.status(200).send({ Message: " Room created Successfully" })
    : res.status(500).send({ Message: " Please provide details " });
});
//get booking customer details
app.get("/booked-customer",async(req,res)=>{
  const bookingRec = await client.db("YOYO").collection("bookings").find().toArray();
  bookingRec
  ? res.status(200).send(bookingRec)
  : res.status(500).send({ Message:"Internal Server Error" })
})

//get booking room details
app.get("/booking-rooms", async (req, res) => {
  const rooms = await client.db("YOYO").collection("rooms").find().toArray();
  rooms
    ? res.status(200).send(rooms)
    : res.status(500).send({ Message: "Internal Server Error" });
});

