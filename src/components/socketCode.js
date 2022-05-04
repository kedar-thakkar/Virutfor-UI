import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '../js/Endpoint';
import Axios from 'axios';

let socket;
function SocketCode() {

    // const [socketId, setSocketId] = useState([]);
    // let socketIdArray = [];
    // useEffect(() => {

    //     socket = io(SOCKET_URL);  

    //     socket.emit("join", {room: "conference-meeting"});

    //     socket.on("on-request-a-call", () => {
    //         console.log("on-request-a-call")   
    //     }) 

    //     socket.on("new-user-joined", ({socketId}) => {
    //         socketIdArray.push(socketId)
    //         console.log(socketIdArray)
    //         setSocketId([])
    //         setSocketId(socketIdArray)
    //     })

    //     socket.on('user-left-room', ({socketId}) => {
    //         let arr = socketIdArray.filter(id => id !== socketId);
    //         socketIdArray = arr;
    //         setSocketId(arr) 
    //     })


    // }, [])

    // useEffect(() => {
    //     console.log(socketId)
    // }, [socketId])

    // function socketHandler(){
    //     socket.emit("request-a-call");
    // }

    // useEffect(() => {
    //     console.log('socket id', socketId)
    // }, [socketId])


    // Json API Code

    const getData = async () => {
        const { data } = await Axios.get('http://localhost:8000/meetings');
        if (data) {
            console.log(data)
        }
    }


    const addNewMeeting = async () => {

        let mydata = {
            id: 1,
            meetingName: "Meeting A",
            participants: [
                "user A", "user B", "user C", "user D", "user E"
            ]
        }

        let meetingName = mydata.meetingName;

        const { data } = await Axios.post('http://localhost:8000/meetings',
            { 
                meetingName: "Meetingsdfsd A",
                participants: [
                    "user A", "user B", "user C", "user D", "user E"
                ]
            })
        console.log(data);
    }

    const updateData = async () => {
        
        const { data } = await Axios.put('http://localhost:8000/meetings/1', {
            meetingName: "this is new name",
            participants: [
                'new 1', 'new 2', 'new 3', 'new 4', 'new 5',
            ]
        })

        console.log(data);

    }

    return (
        <>
            {/* {
                socketId && socketId.map(socket => (
                    <p>{socket}</p>
                ))
            }
            <div>
                <button onClick={socketHandler}>Emit an event</button>
            </div> */}

            {/* JSON API CODE */}

            <div>
                <button className="a_btn" onClick={getData}>Get Data</button>
                <button className="a_btn" onClick={addNewMeeting}>Add New Meeting</button>
                <button className="a_btn" onClick={updateData}>Update Data</button>
            </div>
        </>
    )

}

export default SocketCode;