import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/navbar';
import dummyIconBlue from './images/dummy_member_icon_blue.png'
import dummyIconWhite from './images/dummy_member_icon_white.png'
import queryString from "query-string"
import Axios from 'axios';

function TermsAndConditions(props) {

    const [firstname,setFirstname] = useState('')
    const [lastname,setLastname] = useState('')
    const [position,setPosition] = useState('')
    const [company,setCompany] = useState('')
    const [email,setEmail] = useState('')
    const [phone,setPhone] = useState('')
    // const[userdata,setUserdata] = useState('');

    const {userid, userdata} = queryString.parse(props.location.search);    
    console.log("userdata userdata: ", userdata)

   

    useEffect(() => {
        if(userid){
            getuserdata()
        }
        // let userdata = localStorage.getItem('userdata');
        // userdata = JSON.parse(userdata); 
        // console.log(userdata)       
        // setUserdata(userdata) 

    },[userid])

    // useEffect(()=>{
    //     var currenturl = window.location.search 

    //     let paramstring1 = currenturl.split('meetingid=')[1];
    //     console.log("paramstring",paramstring1);
    //     if(paramstring1 !== undefined ){
    //         alert("hello go to dertic prelaunch");
    //     }
    //     else{
    //         alert("hello as usal")
    //     }
    // })

    useEffect(()=> {
        if(userdata){
            console.log(userdata)
            const data = JSON.parse(userdata)
            setFirstname(data.firstName);
            setLastname(data.lastName);
            setPosition(data.position);
            setCompany(data.company);
            setEmail(data.email);
            setPhone(data.phone);
            
            let getId= localStorage.getItem('meetingid')
            console.log("getId:---",getId)
        }
    },[userdata])
    
    

    const getuserdata = async () => {
        try {
            //const data=await Axios(`${ENDPOINTURL}/v2/user/byId/${userid}`)            
        } catch (error) {
            console.log(error)
        }
    }

    // const joinHandler = (props)=>{
    //     if(getId !== null){
    //         alert("hello");
    //     }
    //     else{
    //         props.history.push(`/meeting/tables-meeting-room?userdata=${userdata}`)
    //     }

    // }


    return (
        <>
            <Navbar />
            <div className="box_content_otr">
                <div className="congratulations_box">
                    <div className="white_bg_box">
                        <div className="congratulations_top_box">
                            <div className="congratulations_top_icon_box">
                                <img src={dummyIconBlue} alt="" />
                            </div>
                            <h2>Congratulations!</h2>
                            <p>Your Virtual business card is ready</p>
                        </div>
                        <div className="congratulations_contact_box">
                            <div className="congratulations_contact_box_bg">
                                <div className="congratulations_contact_icon_box">
                                    <img src={dummyIconWhite} alt="" />
                                </div>
                                <div className="congratulations_contact_text_box">
                                    <h3>{firstname} {lastname}</h3>
                                    <p>{position}, {company}</p>
                                    <div className="congratulations_contact_detail_box">
                                        <a href="mailto:abc@virtufor.ch">
                                            <span className="congratulations_contact_detail_box_icon">
                                                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24.3 9.95345V19.5749C24.3 20.47 23.9444 21.3285 23.3115 21.9614C22.6785 22.5943 21.8201 22.9499 20.925 22.9499H6.075C5.17989 22.9499 4.32145 22.5943 3.68851 21.9614C3.05558 21.3285 2.7 20.47 2.7 19.5749V9.95345L13.1571 16.1068C13.261 16.168 13.3794 16.2003 13.5 16.2003C13.6206 16.2003 13.739 16.168 13.8429 16.1068L24.3 9.95345ZM20.925 5.3999C21.7554 5.39977 22.5568 5.70582 23.1757 6.2595C23.7947 6.81318 24.1877 7.57562 24.2797 8.40095L13.5 14.7419L2.72025 8.40095C2.81226 7.57562 3.20533 6.81318 3.82427 6.2595C4.44321 5.70582 5.24455 5.39977 6.075 5.3999H20.925Z" fill="black" />
                                                </svg>
                                            </span>
								&nbsp;{email}
							</a>
                                        <a href={`tel:${phone}`}>
                                            <span className="congratulations_contact_detail_box_icon">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.3342 14.2139L15.0564 12.491C15.2883 12.2618 15.5818 12.1049 15.9012 12.0394C16.2205 11.9739 16.552 12.0025 16.8555 12.1218L18.9544 12.9602C19.261 13.0847 19.5239 13.2972 19.71 13.5709C19.8961 13.8447 19.997 14.1674 20 14.4985V18.3442C19.9982 18.5694 19.9509 18.7919 19.8609 18.9983C19.7709 19.2047 19.6401 19.3908 19.4763 19.5453C19.3125 19.6998 19.1192 19.8195 18.9079 19.8973C18.6967 19.9751 18.4719 20.0093 18.2471 19.9979C3.5392 19.0826 0.57149 6.62239 0.010239 1.85368C-0.0158147 1.6195 0.00798984 1.38246 0.0800864 1.15814C0.152183 0.933831 0.270938 0.727331 0.428538 0.55223C0.586138 0.377128 0.779012 0.237394 0.994471 0.142219C1.20993 0.0470438 1.44309 -0.00141458 1.67862 3.14343e-05H5.3921C5.72347 0.0010127 6.04698 0.101149 6.321 0.287561C6.59503 0.473973 6.80704 0.738135 6.92977 1.04607L7.7678 3.14584C7.89101 3.44817 7.92245 3.78011 7.85818 4.10021C7.79391 4.4203 7.63679 4.71436 7.40645 4.94565L5.68426 6.66854C5.68426 6.66854 6.67606 13.3832 13.3342 14.2139Z" fill="black" />
                                                </svg>
                                            </span>
								&nbsp;{phone}
							</a>
                                    </div>
                                </div>
                            </div>
                            <a href="#.">
                                <span className="edit_icon_svg">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 20H19C19.2652 20 19.5196 20.1054 19.7071 20.2929C19.8946 20.4804 20 20.7348 20 21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21C4 20.7348 4.10536 20.4804 4.29289 20.2929C4.48043 20.1054 4.73478 20 5 20ZM4 15L14 5L17 8L7 18H4V15ZM15 4L17 2L20 5L17.999 7.001L15 4Z" fill="#2579FA" />
                                    </svg>
                                </span>
					&nbsp;I want to change this information
				</a>
                        </div>
                        <div className="congratulations_agree_box">
                            <div className="form_submit_box">
                                <p>I Agree with VirtuAperitif’s <a href="#.">Terms of Service</a> and <a href="#.">Privacy Policy</a>. <strong>I Understand that all my data will be deleted from the System in 48 hours.</strong></p>
                                <Link to={`/meeting/tables-meeting-room?userdata=${userdata}`}>
                                    <button type="submit">Join as Guest</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default TermsAndConditions;