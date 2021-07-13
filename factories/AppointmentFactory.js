class AppointmentFactory{

    Build(simpleAppointment){

        var day = simpleAppointment.date.getDate()+1;
        var month = simpleAppointment.date.getMonth();
        var year = simpleAppointment.date.getFullYear();

        var hour = Number.parseInt(simpleAppointment.time.split(":")[0]);
        var minutes = Number.parseInt(simpleAppointment.time.split(":")[1]);

        var startDate = new Date(year, month, day, hour, minutes, 0 ,0);
        //startDate.setHours(startDate.getHours() - 3);
        
        const appo = {
            id: simpleAppointment._id,
            name: simpleAppointment.name,
            title: simpleAppointment.name + " - " + simpleAppointment.description,
            start: startDate,
            end: startDate,
            notified: simpleAppointment.notified,
            email: simpleAppointment.email,
        }

        return appo;
    }

}

module.exports = new AppointmentFactory();