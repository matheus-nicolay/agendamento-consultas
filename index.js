const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appointmentService = require("./services/AppointmentService");
const AppointmentService = require("./services/AppointmentService");
const appointment = require("./models/Appointment");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/agendamento",{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

app.get("/", (request, response) => {
    response.render("index.ejs");
});

app.get("/register", (request, response) => {
    response.render("create.ejs");
});

app.post("/create", async (request, response) => {
    const {name, email, cpf, description, date, time} = request.body; 

    const status = await appointmentService.createAppointment(name, email, description, cpf, date, time); 
    
    if(status){
        response.redirect("/");
    }else{
        response.send("Ocorreu uma falha!");
    }
});

app.get("/getcalendar", async (request, response) => {
    const appointments = await AppointmentService.GetAppointments(false);
    
    response.json(appointments);
});

app.get("/event/:id", async (request, response) => {
    const appointment = await AppointmentService.getAppointmentById(request.params.id);
    response.render("event.ejs", {appointment: appointment});
});

app.post("/finish", async (request, response) => {
    const id = request.body.id;
    const finishAppointment = await AppointmentService.FinishAppointment(id);
    if(finishAppointment){
        response.redirect("/");
    }
});

app.get("/appointments", async (request, response) =>{
    const appos = await AppointmentService.GetAppointments(true);
    response.render("list.ejs", {appointments: appos});
});

app.get("/searchresults/", async (request, response) =>{
    var query = request.query.search;
    const appos = await AppointmentService.Search(query);
    response.render("list.ejs", {appointments: appos});
});


var pollTime = 5000;

setInterval(async () =>{
    console.log("rodando poll")
    await AppointmentService.SendNotification();
}, pollTime);

app.listen(80, () => {
    console.log("Server is running");
});