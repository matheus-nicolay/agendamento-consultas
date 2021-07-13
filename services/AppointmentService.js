const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");
const mailer =  require("nodemailer");

const Appo = mongoose.model("Appointment", appointment);

class Appointment{

    async createAppointment(name, email, description, cpf, date, time){
        const newAppointment = new Appo({
            name, 
            email, 
            description,
            cpf, 
            date,
            time,
            finished: false,
            notified: false,
        });
        try{    
            await newAppointment.save();
            return true;
        }catch(error){
            console.log(error);
            return false;
        } 
    }

    async GetAppointments(showFinished){
        if(showFinished){
            return await Appo.find();
        }else{
            const appos = await Appo.find({'finished': false});

            const appointments = [];

            
            appos.forEach(appointment =>{
                if(appointment.date != undefined){
                    appointments.push(AppointmentFactory.Build(appointment));
                }
            });

            return appointments;
        }
    }

    async getAppointmentById(id){
        if(id){
            try{
                const appo = await Appo.findOne({'_id': id});
                return appo;
            }catch(error){
                console.log(error);
            }
        }else{
            console.log("ID inválido");
            return false;
        }
    }

    async FinishAppointment(id){
        try{
            await Appo.findByIdAndUpdate(id,{finished: true});
            return true;
        }catch(error){
            console.log(error);
            return false;
        }
    }

    async Search(query){
        try{
            const appos = await Appo.find().or([{name: query}, {cpf: query}]);
            return appos;
        }catch(error){
            console.log(error);
            return [];
        }
      
    }

    async SendNotification(){
        var appos = await this.GetAppointments(false);
        
        var transporter = mailer.createTransport({
            host: "smtp.mailtrap.io" ,
            port: 25,
            auth: {
                user: "26bd3c8988e231",
                pass: "4911e889433a2b"
            }
         });

        appos.forEach(async app => {
            
            var date = app.start.getTime(); 
            var hour = 1000 * 60 * 60;
            var gap = date-Date.now();

            if(gap <= hour){
                
                if(app.notified){
                    
                    transporter.sendMail({
                        from: "Victor Lima <victor@guia.com.br>",
                        to: app.email,
                        subject: "Sua consulta vai acontecer em breve!",
                        text: "Conteúdo qualquer!!!!! Sua consulta vai acontecer em 1h"
                    }).then( () => {
                        
                    }).catch(err => {
                        console.log(err);
                    })
                    await Appo.findByIdAndUpdate(app.id,{notified: true});
                }
            }

        })
    }
}

module.exports = new Appointment();