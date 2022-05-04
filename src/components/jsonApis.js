import { JSON_SERVER_URL } from '../js/Endpoint'
import Axios from 'axios';

const jsongetMeetingParticipants = async (id) => {
    const { data } = await Axios.get(`${JSON_SERVER_URL}/meetings/${id}`);
    if (data) {
        return data.participants;
    } else {
        return;
    }
}

const getEventDetails = async (eventid) => {

    try {
        const { data } = await Axios.get(`${JSON_SERVER_URL}/events/${eventid}`);
        if (data) {
            return {
                status: "ok",
                data: data
            }
        }
    } catch (error) {
        return {
            status: "error",
            data: error
        }
    }
}

const getAllEvents = async () => {
    try {
        const { data } = await Axios.get(`${JSON_SERVER_URL}/events`);
        if (data) {
            return {
                status: "ok",
                data: data
            }
        } else {
            return {
                status: 'error'
            }
        }
    } catch (error) {
        return {
            status: 'error',
            data: error
        }
    }
}

const addParticipantFromMeeting = async (user, id, meeting) => {

    const event = await getEventDetails(id);

    // error handling.
    if (event.status === "error") {
        return {
            status: "error"
        }
    }

    if (event.status === "ok") {
        let eventdata = event.data;
        console.log("meeting==>",meeting)
        console.log("eventdatadata==>",eventdata)

        let tables = event.data.tables;
        console.log("table==>",tables)
        tables.map(table => {
            if (table.name === meeting) {

                let users = table.participants;
                users.push({
                    firstName: user.firstName,
                    lastName: user.lastName
                })
            }
        })

        const { data } = await Axios.put(`${JSON_SERVER_URL}/events/${id}`, {
            "name": eventdata.name,
            "orgId": eventdata.orgId,
            "startDate": eventdata.startDate,
            "endDate": eventdata.endDate,
            "tables": tables,
            "invitees": eventdata.invitees
        });

        if (data) {
            return {
                status: 'ok'
            }
        }

    }
}


const removeParticipantFromMeeting = async (eventId, userData, meetingName) => {

    const eventdata = await getEventDetails(eventId);
 

    if (eventdata.status === "ok") {

        let tables = eventdata.data.tables;
        tables.map(table => {
            if (table.name === meetingName) {

                let users = table.participants;
                let leftusers = users.filter((user) => user.firstName !== userData.firstName && user.lastName !== userData.lastName)
                table.participants = leftusers;
            }
        }) 

        let myeventData = eventdata.data;
        const { data } = await Axios.put(`${JSON_SERVER_URL}/events/${eventId}`, {
            "name": myeventData.name,
            "orgId": myeventData.orgId,
            "startDate": myeventData.startDate,
            "endDate": myeventData.endDate,
            "tables": tables,
            "invitees": myeventData.invitees
        });

        if(data){
            return {
                status: "ok",
                data: data
            }
        }else{
            return {
                status: "error" 
            }
        }
    }
}


export { jsongetMeetingParticipants, getEventDetails, getAllEvents, addParticipantFromMeeting, removeParticipantFromMeeting };