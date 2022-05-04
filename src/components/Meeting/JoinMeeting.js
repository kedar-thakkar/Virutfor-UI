import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Navbar from '../common/navbar';
import JoiningTheEventImg from './images/joining_the_event_img.png';
import { getEventDetails } from '../jsonApis';


function JoiMeeting(props) {

    const [eventid,setEventid] = useState('')
    const [mess,setMess] = useState('')
    
    useEffect(()=>{
        var currenturl = window.location.search 
       let paramstring = currenturl.split('eventname=')[1];
       console.log("hello oo",paramstring)
       let eventId = currenturl.split('&')[0].split('eventname=')[1];
       console.log("eventID",eventId);
       if(paramstring !== undefined ){
        localStorage.setItem('eventid',eventId);
        let paramstring1 = currenturl.split('meetingId=')[1];
        let meetingid = paramstring1.split('',1);
        localStorage.setItem('meetingid',meetingid);
        console.log("paramstring",meetingid);
        let roomname = currenturl.split('roomname=')[1];
        localStorage.setItem('roomname',roomname);
        console.log("room name :",roomname);
        props.history.push('/meeting/guest-resigration-form')
       }
       else{
        props.history.push('/')
       }
       
      
      },[]) 


    // useEffect(()=>{
       
    //     if(paramstring1 !== undefined ){
    //         console.log("hrllo 1")
    //     }
    //     else{
    //         console.log("hello 2")
    //     }
    // }) 
        



    const submitHandler = async () => {
        
        setMess('');
        if(eventid){
            let data = await getEventDetails(eventid);
            if(data.status === "ok"){
                console.log(data.data.id);
                localStorage.setItem('eventid',data.data.id);
                props.history.push('/meeting/guest-resigration-form')
            }
        }else{
            setMess('Enter valid Event Id.');
        } 
    }

    return (

        <>

            <Navbar />
           
            <div className="content_box">
                <div className="wrapper">
                    <div className="content_box_inr">
                        <div className="content_box_left">
                            <img src={JoiningTheEventImg} alt="" />
                        </div>
                        <div className="content_box_right">
                            <h1>Exchange Contact</h1>
                            <p>Exchange contact details with other like-minded people at the conference</p>
                            <div className="form_box">
                                <div className="form_title">
                                    <h3>Join a Meeting</h3>
                                </div>
                                <div className="form_input_box">
                                    <input type="text" placeholder="Enter Event ID" onChange={(e)=> setEventid(e.target.value)}/>
                                    <p>{mess}</p>
                                </div>
                                <div className="form_submit_box">
                                    {/* <Link to='/meeting/guest-resigration-form'> */}
                                        <button type="submit" onClick={submitHandler}>
                                            <span className="form_submit_icon_box">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.66667 20C1.66667 20 0 20 0 18.3333C0 16.6667 1.66667 11.6667 10 11.6667C18.3333 11.6667 20 16.6667 20 18.3333C20 20 18.3333 20 18.3333 20H1.66667ZM10 10C11.3261 10 12.5979 9.47322 13.5355 8.53553C14.4732 7.59785 15 6.32608 15 5C15 3.67392 14.4732 2.40215 13.5355 1.46447C12.5979 0.526784 11.3261 0 10 0C8.67392 0 7.40215 0.526784 6.46447 1.46447C5.52678 2.40215 5 3.67392 5 5C5 6.32608 5.52678 7.59785 6.46447 8.53553C7.40215 9.47322 8.67392 10 10 10Z" fill="white" />
                                                </svg>
                                            </span>
							&nbsp;Join as Guest
						</button>
                                    {/* </Link> */}
                                    <small>By Signing up you agree with VirtuApero’s</small>
                                    <p><a href="#.">Terms of Service</a> and <a href="#.">Privacy Policy</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )

}

export default JoiMeeting;