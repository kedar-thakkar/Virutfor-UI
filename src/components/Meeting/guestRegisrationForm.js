import Axios from 'axios';
import React,{useState} from 'react';
import Navbar from '../common/navbar';


function GuestRegisrationForm(props) {

    const [firstname,setFirstname] = useState('')
    const [lastname,setLastname] = useState('')
    const [position,setPosition] = useState('')
    const [company,setCompany] = useState('')
    const [email,setEmail] = useState('')
    const [phone,setPhone] = useState('')

  

    const submitHandler  = async () => {
        
        try {
            const data = {
                company: company,
                email: email,
                firstName: firstname,
                lastName: lastname,
                phone: phone,
                position: position,
                userStatus: 1,
                username: "guest",
                website: ""
            }
           // console.log(data.data)
            if(data){
                const userdata = JSON.stringify(data)
                localStorage.setItem('userdata',userdata)
                props.history.push(`/meeting/terms-and-conditions?userid=${data.id}&userdata=${userdata}`)
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Navbar />
            <div className="box_content_otr">
                <div className="box_content">
                    <div className="white_bg_box">
                        <h1>Welcome, Guest!</h1>
                        <p>Please provide your details below.</p>
                        <div className="form_box">
                            <div className="form_input_box">
                                <input type="text" placeholder="Enter First Name" onChange={(e)=>setFirstname(e.target.value)} />
                            </div>
                            <div className="form_input_box">
                                <input type="text" placeholder="Enter Last Name" onChange={(e)=>setLastname(e.target.value)}/>
                            </div>
                            <div className="form_input_box">
                                <input type="text" placeholder="Enter position" onChange={(e)=>setPosition(e.target.value)}/>
                            </div>
                            <div className="form_input_box">
                                <input type="text" placeholder="Enter Company" onChange={(e)=>setCompany(e.target.value)}/>
                            </div>
                            <div className="form_input_box">
                                <input type="email" placeholder="Enter Email" onChange={(e)=>setEmail(e.target.value)}/>
                            </div>
                            <div className="form_input_box">
                                <input type="tel" placeholder="Enter Phone"onChange={(e)=>setPhone(e.target.value)} />
                            </div>
                            <div className="form_submit_box">
                                <button type="submit" onClick={submitHandler}>Next</button>
                                <small>By joining as a guest, you agree with</small>
                                <p>VirtuAperitif’s <a href="#.">Terms of Service</a> and <a href="#.">Privacy Policy</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default GuestRegisrationForm;