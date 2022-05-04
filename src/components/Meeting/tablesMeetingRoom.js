import React, { useEffect, useState } from 'react';
import Navbar from '../common/navbar';
import dummyMember from './images/dummy_member.png';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import '../../css/style.css';
import { SOCKET_URL, FRONTEND_URL, JITSI_URL, JSON_SERVER_URL } from '../../js/Endpoint';
import io from 'socket.io-client';
import Modal from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { getEventDetails, addParticipantFromMeeting } from '../jsonApis';
import queryString from "query-string"
import $ from 'jquery';
import { event } from 'jquery';
import { Button, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

let socket;
function TablesMeetingRoom(props) {

    const [meetingData, setMeetingData] = useState([]);
    const [tables, setTables] = useState([]);
    const [username, setUsername] = useState('');
    const [meetingName, setMeetingName] = useState('');

    const [meetings, setMeetings] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [Model,setModel]=useState(false);
    const [event, setEvent] = useState([]);

    const { userdata } = queryString.parse(props.location.search);
   

    useEffect(async () => {
        socket = io(SOCKET_URL)
        $('.owl-nav').removeClass('disabled');
        
        getUserData();
        console.log("firstname",firstName);
      
        let eventId = localStorage.getItem('eventid');
        if (eventId) {
            const event = await getEventDetails(eventId);
            console.log('event ----< ', event.data)
            if (event.status === "ok") {
                setEvent(event.data);
            }
        }
    }, [])


    useEffect(()=>{
        socket.on('end-call',({user_data})=>{
            getUserData();
            getparticipantlist()
        })
    })

    useEffect(()=>{
        socket.on('passdata-user',({userNameFinal})=>{
            getUserData();
            getparticipantlist()
            
        })
    })


    function getUserData() {
        console.log("hello one one")
        let user_data = userdata;
        user_data = JSON.parse(user_data);
        setUsername(user_data.firstName); 
        localStorage.setItem("firstname",user_data.firstName);
        localStorage.setItem("lastname",user_data.lastName);
        setFirstName(user_data.firstName);
        setLastName(user_data.lastName);

    }

    const getparticipantlist = async () => {
        let eventId1 = localStorage.getItem('eventid');
            console.log(eventId1)
            if (eventId1) {
                    const praticipantevent = await getEventDetails(eventId1);
                    console.log('event111 ----< ', praticipantevent.data)
                    if (praticipantevent.status === "ok") {
                        console.log(praticipantevent.data)
                    setEvent(praticipantevent.data);
                    }
            }
            else{
               
            }
    }
    function getUserData1(){
        let user_data1 = userdata;
        let user_data11 = JSON.parse(user_data1);
        console.log("firtsname from ",user_data11.firstName)
        localStorage.setItem("firstname",user_data11.firstName)
        localStorage.setItem("lastname",user_data11.lastName);
        
    }
    const owlResponsive = {
        769: {
            items: 3
        },
        320: {
            items: 1
        }
        
    }

    
    const totalParticipants = () => {

    }
    const meeting_rooms_topic = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
    }

    

    useEffect(() => {
           var close = document.getElementsByClassName("closebtn");
            var i;

            for (i = 0; i < close.length; i++) {
            close[i].onclick = function(){
                var div = this.parentElement;
                div.style.opacity = "0";
                setTimeout(function(){ div.style.display = "none"; }, 600);
            }
            }
        if (tables) {
            if (tables[0]) {
                let meeting_name = tables[0].name;
                meeting_name = meeting_name.replaceAll(' ', '');
                meeting_name = meeting_name.toLocaleLowerCase();
                setMeetingName(meeting_name);
            }

        }
    }, [tables])

    let getId= localStorage.getItem('meetingid')
        console.log("getId:---",getId)
    let roomnameId = localStorage.getItem('roomname');

        useEffect(() => {
            
            
            if(getId !== null){
                getUserData1();
                console.log("Firstname form table meeting",firstName);
                props.history.push(`/meeting/meetingroom?username=${firstName + " " + lastName}&roomname=${roomnameId}&id=${getId}&userdata=${userdata}`)
            }
            
        })


    const joinMeeting = async (meeting) => {
        localStorage.setItem('meetingName',meeting.name)
        const totalParticipants = meeting.participants.length;
        if (totalParticipants >= 6) {
           
            setModel(true);
            setTimeout(() => {
                    setModel(false)
            }, 3000);
            $('#joinbtn').prop('disabled',true);
            $('.alert1').toggleClass('d-none');
           
           return;
        }
        
        
        props.history.push(`/meeting/meetingroom?username=${firstName + " " + lastName}&roomname=${meeting.name}&id=${meeting.id}&userdata=${userdata}`)
        

        let eventId = localStorage.getItem('eventid');
        const url = `?eventname=${eventId}&meetingId=${meeting.id}&roomname=${meeting.name}`;
        // const url = `/meeting/meetingroom?username=${firstName + " " + lastName}&roomname=${meeting.name}&id=${meeting.id}&userdata=${userdata}`;
       console.log("urllllll",url);
       localStorage.setItem("URL", url);
    }


    return (
        <>
            <Navbar />
          
               
            <div className="meeting_rooms_otr">
                <div className="meeting_rooms_inr">
                    <div className="meeting_rooms_top_box">
                        <h2>Finance For All</h2>
                        <p>Organized By virtufor</p>
                        <div className="meeting_rooms_welcome">
                            <strong>Welcome! <br />Choose your table</strong>
                        </div>
                        {
                    Model ? 
                        <div> 
                        <Toast  style={{margin: "0 auto"}}>
                        <Toast.Body> meeting is full try again later </Toast.Body>
                        </Toast>
                        </div>
                    :
                     null
                    }
                    </div>
                    
                    {
                        event && event.tables && (
                            <OwlCarousel dots='false' id="owl-demo" items='3' responsive={owlResponsive} center loop nav className='meeting_rooms_table_slider owl-carousel'>
                                {

                                    event && event.tables && event.tables.map((table, index) => (

                                        <div className="meeting_rooms_table_slide_box">
                                            <div className="meeting_rooms_table_slide_box_inr">
                                                <div className="meeting_rooms_topic" style={meeting_rooms_topic}>
                                                    <small>{table.name}</small>
                                                    <button id="joinbtn" style={{ borderRadius: '10px', height: '50px' }} onClick={() => joinMeeting(table)}>Join</button>
                                                </div>
                                                <div className="meeting_rooms_table_slide_box_title">
                                                    <h3>Participants</h3>
                                                </div>

                                                


                                                <div className="meeting_rooms_table_member_list">


                                                    {
                                                        table.participants.map((participant, index) => (
                                                            <div className="meeting_rooms_table_member_list_item">
                                                                <div className="meeting_rooms_table_member_icon">
                                                                    <img src={dummyMember} alt="" />
                                                                </div>
                                                                <div className="meeting_rooms_table_member_text">
                                                                    <h4>{participant.firstName} {participant.lastName}</h4>
                                                                    <p>{event.orgId}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }

                            </OwlCarousel>
                        )
                    }


                    <div className="meeting_rooms_tables_btn">
                        {/* <Link to={`/meeting/meetingroom?username=${username}&roomname=${meetingName}`} className="a_btn">Join as Guest</Link> */}
                        <Link to="/" className="btn_gray">Logout</Link>
                    </div>
                </div>
            </div>

        </>
    )

}

export default TablesMeetingRoom;