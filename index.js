const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appointmentService = require("./services/AppointmentService");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/agendamento",{useNewUrlParser: true, useUnifiedTopology: true})

app.get("/", (request, response) => {
    response.send("Home!");
});

app.get("/register", (request, response) => {
    response.render("create.ejs");
});

app.post("/create", async (request, response) => {
    const {name, email, cpf, description, date, time} = request.body; 
    appointmentService.createAppointment(name, email, description, cpf, date, time); 
    
});

app.listen(80, () => {
    console.log("Server is running");
});