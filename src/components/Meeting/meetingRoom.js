import React, { useEffect, useState } from 'react';
// import KelvinPhoto from './images/pexels-kevin-bidwell-3863793 1.jpg'
import Olivier from './images/oliver-ragfelt-khV4fTy6-D8-unsplash 1.png';
import KelvinPhoto from './images/icon3.png';
import avatar from './images/icon31.png';
import copy from './images/copy.svg';
import queryString from 'query-string'; 
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import io from 'socket.io-client';
import { SOCKET_URL, FRONTEND_URL, JITSI_URL, JSON_SERVER_URL } from '../../js/Endpoint';
import $, { event } from 'jquery';
import audioOnImg from '../../images/meeting-icons/audio_on.svg';
import tileview from './images/tileview.svg';
import audioOffImg from '../../images/meeting-icons/audio_off.svg';
import videoOnImg from '../../images/meeting-icons/videos_on_icon.svg';
import videoOffImg from '../../images/meeting-icons/videos_off_icon.svg';
import { jsongetMeetingParticipants, removeParticipantFromMeeting } from "../jsonApis";
import Axios from 'axios';
import Prelaunch from '../Meeting/preluanch';
import participantImage from '../../images/meeting-icons/participant.svg';

let socket;
let remote_username = '';
let local_username = '';
let meetingRoomName = '';
let sourceRoom = ''

let isVideoMuted = false;
let isAudioMuted = false;

let connection = null;
let isJoined = false;
let room = null;

let localTracks = [];
let remoteTracks = [];


function MeetingRoom(props) {

    const { username, roomname, id, source, userdata } = queryString.parse(props.location.search);


    // meeting room name
    meetingRoomName = roomname;
    meetingRoomName = meetingRoomName.toLocaleLowerCase();
    meetingRoomName = meetingRoomName.replaceAll(' ', '');
    sourceRoom = source;
    var Firstname= localStorage.getItem("firstname");
    var Lastname=localStorage.getItem("lastname");
  
	if(Firstname){
		console.log("f&L",Firstname)
		local_username = Firstname+Lastname ;
		console.log("localUsername",local_username)
	}
	else{
		local_username = username; 
	}
   
    console.log("local_username",local_username);
    const [participantsList, setParticipantsList] = useState([]);
    const [modal, setModal] = useState(false);
    const [callBody, setCallBody] = useState(''); 
    const [userColLength, setUserColLength] = useState(0);
    const [videoIcon, setVideoIcon] = useState(true);
    const [audioIcon, setAudioIcon] = useState(true);
    const [meetingId, setMeetingId] = useState(id);
    const [meetingName, setMeetingName] = useState(roomname);
    const [prelaunchScreen, setPrelaunchScreen] = useState(true);
    const [remoteParticipantList, setRemoteParticipantList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [allMediaDevices, setAllMediaDevices] = useState([]);
    const numbers = ['Vaishakhi Patel','Pqr Stu'];
    const [callsState , setCallsState] = useState([]);
    
    /* global $, JitsiMeetJS */
 
    const toggle = () => {
        setModal(!modal);
    }

    const options = {
        serviceUrl: `https://${JITSI_URL}/http-bind`,
        hosts: {
            domain: `${JITSI_URL}`,
            muc: `conference.${JITSI_URL}`
        },
        resolution: 1080,
        maxFullResolutionParticipants: 2,
        setSenderVideoConstraint: '1080',
        setReceiverVideoConstraint: '180',
        constraints: {
            video: {
                aspectRatio: 16 / 9,
                height: {
                    ideal: 1080,
                    max: 1080,
                    min: 1080
                }
            }
        }
    }

    const confOptions = {
        openBridgeChannel: true
    };
	
	const fullScreenView = (elem) => {
        let x = false;
        x = $(`#${elem}`).hasClass('fullscreen');
        console.log(x)
        $('.remote-video').removeClass('fullscreen');
    
        if (x) {
            $(`#${elem}`).addClass('fullscreen');    
        }
    
        $(`#${elem}`).toggleClass('fullscreen');
    
    }
  

    useEffect(() => {
        socket = io(SOCKET_URL); 
        socket.emit('join', ({ room: meetingRoomName }));
        socket.on('on-call-request', ({ callFrom, callTo}) => {
            remote_username = callFrom;
            if (local_username === callTo) {
                setCallBody(`${remote_username} is calling you...`)
                setModal(true);
            }
        })

        socket.on('join-private-meeting', ({ callFrom, callTo}) => {            
        
          let callroom = callFrom + callTo
          console.log("callroom",callroom.length);
                   
			if(callroom.length >= 10){
				let userNameCall = document.getElementById('usercall');
				userNameCall.innerHTML = "Private Call";
			}
            if (local_username === callFrom) {
                let privateroomname = callTo + callFrom;                
                let userStatus = document.getElementById('user-status');
                let userNameCall = document.getElementById('usercall');              
                try {
                    userStatus.innerHTML = " (Private)";
                    userNameCall.innerHTML = " Private Call";
                } catch (error) {
                }

                    turnOfAudioVideo();
                    window.open(`${FRONTEND_URL}/meeting/meetingroom?username=${local_username}&roomname=${privateroomname}&source=private`)
            }          
        })
    }, [])

    useEffect(() => {
        startMeeting();
         
    }, [])   

    function prelaunchMediaHandler(audioId, videoId) {
        console.log("1")
        console.log("audioId: ", audioId)
        console.log("videoId: ", videoId)

        for (let i = 0; i < localTracks.length; i++) {
            localTracks[i].dispose();
        }

        JitsiMeetJS.createLocalTracks({
            devices: ["audio", "video"],
            cameraDeviceId: videoId,
            micDeviceId: audioId,
        }).then(onLocalTracks)
            .catch(error => {
                throw error;
            });
        
        setPrelaunchScreen(false);
        setModalIsOpen(false)
        connection.connect();
    }

    

    useEffect(() => {
        let mobileCheck = function() {
            let check = false;
            if(sourceRoom === 'private'){
                check=true;
            }
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        };

        let resopnse = mobileCheck(); 
        if(resopnse === true){
            setPrelaunchScreen(false);
            setModalIsOpen(false)
            connection.connect();
        }     

    }, [])
 
    /**
     * Handles local tracks.
     * @param tracks Array with JitsiTrack objects
     */
    function onLocalTracks(tracks) {
        console.log("2")
        localTracks = tracks;
        for (let i = 0; i < localTracks.length; i++) {
            localTracks[i].addEventListener(
                JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
                audioLevel => console.log(`Audio Level local: ${audioLevel}`));
            localTracks[i].addEventListener(
                JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                () => console.log('local track muted'));
            localTracks[i].addEventListener(
                JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                () => console.log('local track stoped'));
            localTracks[i].addEventListener(
                JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
                deviceId =>
                    console.log(
                        `track audio output device was changed to ${deviceId}`));
            if (localTracks[i].getType() === 'video') {
                $('.meeting_call_inr').append(`<video autoplay='1' class="local-video" id='localVideo${i}' />`);
                localTracks[i].attach($(`#localVideo${i}`)[0]);
            } else {
                $('.meeting_call_inr').append(`<audio autoplay='1' muted='true' id='localAudio${i}' />`);
                localTracks[i].attach($(`#localAudio${i}`)[0]);
            }
            if (isJoined) {
                room.addTrack(localTracks[i]);
            }
        }
      
    }


    function startPrivateMeeting() {
        console.log("3")
       
        let privateroomname = local_username + remote_username;      
        if(privateroomname.length >= 10){
            let userNameCall = document.getElementById('usercall');
            userNameCall.innerHTML = "Private Call";           
        }      

        socket.emit('call-accepted', ({ callFrom: remote_username, callTo: local_username}))
        
        let userStatus = document.getElementById('user-status');
        let userNameCall = document.getElementById('usercall');
        
        try {
            userStatus.innerHTML = " (Private)";
            userNameCall.innerHTML = "Private Call";
            
            setModal(false);
        } catch (error) {
            
        }

        
            turnOfAudioVideo();
            window.open(`${FRONTEND_URL}/meeting/meetingroom?username=${local_username}&roomname=${privateroomname}&source=private`)
        
       
        
    }

    /**
     * Handles remote tracks
     * @param track JitsiTrack object
     */

    function makeACall(name) {
        console.log("4")  
        remote_username = name;
        console.log(name.value);
        console.log(remote_username)
        socket.emit('request-a-call', { callFrom: local_username, callTo: name})  
    }

    const turnOfAudioVideo = () => {
        console.log("6")
        isAudioMuted = false;
        isVideoMuted = false;
        muteHandler();
        onVideoMuteStateChanged()
        
    }


    function onRemoteTrack(track) {

        console.log("7")
        console.log('track.isLocal() ====> ', track.isLocal())
        if (track.isLocal()) {
            return;
        }
        $("body").addClass('TileChange');
        $('.meeting_member_box').addClass('user_box_list');
        $('.meeting_member_box').css({"position":"relative","max-width":"100%"});
        const participant = track.getParticipantId();
        const participantName = room.getParticipantById(participant)._displayName;

        if (!remoteTracks[participant]) {
            remoteTracks[participant] = [];
        }
        const idx = remoteTracks[participant].push(track);
        track.addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
        track.addEventListener(
            JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            () => console.log('remote track muted'));
        track.addEventListener(
            JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            () => console.log('remote track stoped'));
        track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
            deviceId =>
                console.log(
                    `track audio output device was changed to ${deviceId}`));
        const id = participant + track.getType() + idx;

        console.log('track.getType() ====> ', track.getType())
        if (track.getType() === 'video') {
            $('.meeting_member_box').append(
                `<div class="member_box" id='remote-user-${participant}' onclick="$('#${participant}video${idx}').toggleClass('fullscreen');">
                    <div class="member_video_box" >
                    <img src="${avatar}"  class="remote_image d-none" id='${participant}img' alt=""> 
                    <video autoplay='1' class="${participant}video remote-video" id='${participant}video${idx}' style="pointer-events: none" />
                    </div>
                    <div class="member_name_box working">
                        <p>${participantName} <span id="user-status" ></span> </p>
                    </div>
                </div>`);                            
        } else {
            $('.meeting_member_box').append(
                `<audio autoplay='1' id='${participant}audio${idx}' />`);
        }
        track.attach($(`#${id}`)[0]);
        getTotalRemoteUsers()
        getMeetingParticipants()

        $(".member_box").click(function(){
            $("body").addClass("intro");
            $(this).addClass("Changes_postion");
            });
        
        $(".meeting_call_inr").click(function(){
            $("body").removeClass("intro");
            $(".member_box").removeClass("Changes_postion");
        }); 


        if(source !== "private"){
            if (track.getType() === 'video'){
                if (track.muted === true){   
                    $('.remote_image').removeClass('d-none');
                }
            }
        }
        
        
    }

    async function onVideoMuteStateChanged(e) {
        for (let i = 0; i < localTracks.length; i++) {
            if (localTracks[i].type === "video") {
                try {
                    if (isVideoMuted === true) {
                        localTracks[i].unmute();
                        console.log("video unmuted====>");
                        $('.local_video_mute_img').addClass('d-none');
                        $('.local-video').css('display','block');
                        isVideoMuted = false;
                    } else {
                        localTracks[i].mute();
                        console.log("video muted====>");
                        $('.local_video_mute_img').removeClass('d-none');
                        $('.local-video').css('display','none');
                        isVideoMuted = true;
                    }
                    
                    setVideoIcon(!videoIcon)
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }


    function parseURLParams(url) {
        console.log("9")
        var queryStart = url.indexOf("?") + 1,
            queryEnd = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;
        if (query === url || query === "") return;
        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);
            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }

    /**
     * That function is executed when the track is muted
     */
    function muteHandler() {
        console.log("10")
        console.log("localTracks", localTracks);
        for (let i = 0; i < localTracks.length; i++) {
            if (localTracks[i].type === "audio") {
                try {
                    if (isAudioMuted === true) {
                        localTracks[i].unmute();
                        console.log("audiounmuted===========>");
                    } else {
                        localTracks[i].mute();
                        console.log("audiomuted===========>");
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
        isAudioMuted = !isAudioMuted;
        setAudioIcon(!audioIcon)
    }

    const getTotalRemoteUsers = () => {
        const remoteUser = room.getParticipants()
        const remoteUsersLength = remoteUser.length;

        setUserColLength(remoteUsersLength)
        setRemoteParticipantList(remoteUser);
    }

    /**
     * That function is executed when the conference is joined
     */
    function onConferenceJoined() {
        console.log("11")
        console.log('conference joined!');
        isJoined = true;
        for (let i = 0; i < localTracks.length; i++) {
            room.addTrack(localTracks[i]);
        }
    }

    /**
     *
     * @param id
     */
    function onUserLeft(id) {
        console.log("12")
        
        try {
            console.log('user left');
            if(room.getParticipants().length < 1){
                $("body").removeClass('TileChange');
                $('.meeting_member_box').css({"position":"absolute","max-width":"240px"});
                $('.meeting_member_box').removeClass('user_box_list')
            } else {
                $("body").addClass('TileChange');
                $('.meeting_member_box').addClass('user_box_list');
                $('.meeting_member_box').css({"position":"relative","max-width":"100%"});
            }

            if (!remoteTracks[id]) {
                return;
                
            }
            const tracks = remoteTracks[id];
            
            for (let i = 0; i < tracks.length; i++) {
                tracks[i].detach($(`#${id}${tracks[i].getType()}`));
            }
            // const participant = track.getParticipantId();
            const element = $(`#remote-user-${id}`);
            if (element) {
                console.log(element);
                element.remove();
                
            }
            
        } catch (error) {
            console.log(error.message)
        }
    }

    /**
     * That function is called when connection is established successfully
     */
    function onConnectionSuccess() {
        console.log("13")
        room = connection.initJitsiConference(meetingRoomName, confOptions);
        console.log('room ===========> ', room);
        room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
        room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
            const participant = track.getParticipantId();
            const element = $(`#remote-user-${participant}`);
            if (element) {
                element.remove();
            }
            console.log(`track removed!!!${track}`);
            getTotalRemoteUsers()
            getMeetingParticipants();
        });
        room.on(
            JitsiMeetJS.events.conference.CONFERENCE_JOINED,
            onConferenceJoined);
        room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
            console.log('user join');
            remoteTracks[id] = [];
        });
        room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
        room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
            console.log(`${track.getType()} - ${track.isMuted()}`);
            if (track.getType() === 'video') {
                const participant = track.getParticipantId();
                
                const videotagid = participant + track.getType();
               
                const imgtagid = participant + 'img';
                console.log("videotagid", videotagid)
                console.log("imgtagid", imgtagid)            
                     
                if (!track.isMuted()) {
                    $(`.${videotagid}`).removeClass('d-none')
                    $(`#${imgtagid}`).addClass('d-none')
                } else {
                    $(`.${videotagid}`).addClass('d-none')
                    $(`#${imgtagid}`).removeClass('d-none')
                }
            }
        });
        room.on(
            JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
            (userID, displayName) => console.log(`${userID} - ${displayName}`));
        room.on(
            JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
            (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
        room.on(
            JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
            () => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));
        room.join();
        room.setDisplayName(local_username);
    }

   /**
     * This function is called when the connection fail.
     */
    function onConnectionFailed() { 
        console.error('Connection Failed!');
    }
    
    function onDeviceListChanged(devices) {
        console.log("14")
        console.info('current devices', devices);
		setAllMediaDevices(devices);
    }

    /**
     * This function is called when we disconnect.
     */
    function disconnect() {
        console.log("15")
        console.log('disconnect!');
        connection.removeEventListener(
            JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
            onConnectionSuccess);
        connection.removeEventListener(
            JitsiMeetJS.events.connection.CONNECTION_FAILED,
            onConnectionFailed);
        connection.removeEventListener(
            JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
            disconnect);
    }

    /**
     *
     */
    async function unload() {  
        console.log("16") 
        let user_data = localStorage.getItem('userdata');
        user_data = JSON.parse(user_data);
        let eventId = localStorage.getItem("eventid");

        let res = await removeParticipantFromMeeting(eventId, user_data, meetingName)
        if (res.status) {
            try {
                for (let i = 0; i < localTracks.length; i++) {
                    // localTracks[i].dispose();
                    try {
                        localTracks[i].dispose();
                    } catch (err) {
                        console.log(err.message)
                    }
                }
                room.leave();
                connection.disconnect();
                socket.emit('end-usercall',({user_data}))
                sessionStorage.clear();

                if (sourceRoom === 'private') {
                    sourceRoom = '';
                    window.close();
                } else {
                    window.location.replace(`/meeting/tables-meeting-room?userdata=${userdata}`)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    const removeUser = async () => {
        console.log("17")
        try {
            let user_data = localStorage.getItem('userdata');
            user_data = JSON.parse(user_data);

            let participants = await jsongetMeetingParticipants(meetingId);
            participants = participants.filter(participant => participant.firstName !== user_data.firstName && participant.lastName !== user_data.lastName);
            
            await updateParticipantList(meetingId, meetingName, participants)
        } catch (error) {
        }
    }

    const updateParticipantList = async (meetingId, meetingName, participants) => {
        console.log("18")
        const { data } = await Axios.put(`${JSON_SERVER_URL}/meetings/${meetingId}`, {
            "meetingName": meetingName,
            "participants": participants,
        })       
        console.log("updated",data);
    
    }
    let isVideo = true;

    /**
     *
     */
    function switchVideo() { // eslint-disable-line no-unused-vars
        isVideo = !isVideo;
        if (localTracks[1]) {
            localTracks[1].dispose();
            localTracks.pop();
        }
        JitsiMeetJS.createLocalTracks({
            devices: [isVideo ? 'video' : 'desktop']
        })
            .then(tracks => {
                localTracks.push(tracks[0]);
                localTracks[1].addEventListener(
                    JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                    () => console.log('local track muted'));
                localTracks[1].addEventListener(
                    JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                    () => console.log('local track stoped'));
                localTracks[1].attach($('#localVideo1')[0]);
                room.addTrack(localTracks[1]);
            })
            .catch(error => console.log(error));
    }

    /**
     *
     * @param selected
     */
    function changeAudioOutput(selected) { // eslint-disable-line no-unused-vars
        console.log("19")
        JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
    }

    

    function startMeeting() {
        console.log("20")
        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
        const initOptions = {
            disableAudioLevels: true
        };

        JitsiMeetJS.init(initOptions);

        connection = new JitsiMeetJS.JitsiConnection(null, null, options);

        connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
            onConnectionSuccess);
        connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_FAILED,
            onConnectionFailed);
        connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
            disconnect);
        JitsiMeetJS.mediaDevices.addEventListener(
            JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
            onDeviceListChanged);
        if (prelaunchScreen === false){
            console.log('If prelaunchScreen ================> ', prelaunchScreen);
            connection.connect();
        } else {
            console.log('Else prelaunchScreen ================> ', prelaunchScreen);
        }
        JitsiMeetJS.createLocalTracks({ devices: ['audio', 'video'] })
            .then(onLocalTracks)
            .catch(error => {
                throw error;
            });
        JitsiMeetJS.mediaDevices.enumerateDevices(onDeviceListChanged);
    }

    function getMeetingParticipants() {
        console.log("21")
        let users = [];
        const participants = room.getParticipants();
        participants.map(participant => {
            console.log("participant._id ========> ", participant._id);
            console.log("participant.displayName ========> ", participant._displayName);
            users.push({
                id: participant._id,
                name: participant._displayName
            })           
        })        
       setParticipantsList(users); 
       console.log("setParticipantsList",users) 
    }
  
		function copyToClipboard(text) {
            $('.MeetingURL').addClass('d-none');
            $('.popuptext').removeClass('d-none');
			var dummy = document.createElement("textarea");
			// to avoid breaking orgain page when copying more words
			// cant copy when adding below this code
			// dummy.style.display = 'none'
			document.body.appendChild(dummy);
			let meetingId = localStorage.getItem('URL');
			//Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
			dummy.value = 'https://apero.dev.virtufor.ch' + meetingId;
            // dummy.value = 'Meeting URL: http://localhost:3000' + meetingId;
            // dummy.value = 'Meeting URL: https://apero.dev.virtufor.ch' + meetingId;
			dummy.select();
			document.execCommand("copy");
			document.body.removeChild(dummy);
            
            
		}

    return (
        <>
            <div>
                {/* <Button color="danger" onClick={toggle}>buttonLabel</Button> */}
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Call</ModalHeader>
                    <ModalBody>
                        {callBody}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={startPrivateMeeting}>Accept</Button>
                        <Button color="secondary" onClick={toggle}>Decline</Button>
                    </ModalFooter>
                </Modal>
            </div>

            
            {
                prelaunchScreen === false ? (
                    <>
                        <div className="custom-modal">
                            <div className="custom-modal-content">
                                <div className="custom-modal-header">
                                    <h3>Participants</h3>
                                    <button className="a_btn" onClick={() => { $('.custom-modal').removeClass('active') }}>Close</button>
                                </div>
                                <div className="custom-modal-body">
                                    {
                                        participantsList && participantsList.map((participant) => {
                                            console.log("participant====>>>>",participant);
                                             return(
                                                <div className="participants-list" id="participan_listid">
                                                <p id="text_id">{participant.name}</p> 
                                                <button className="a_btn" id="usercall" onClick={() => makeACall(participant.name)}>Make A Call</button>                                                                                         
                                                </div>
                                             )
                                        }   
                                        )
                                    }   
                                     
                                </div>
                            </div>
                        </div>

                        <div class="meeting_call_otr">  
                            <div class="meeting_call_add_user_btn" onClick={() => $('.custom-modal').addClass('active')}>
                            
                            </div>
                            <div class="meeting_call_box">
                                <div class="meeting_call_inr">
                                    {/* <!-- local user video --> */}
                                    <img src={KelvinPhoto} class='local_video_mute_img d-none' alt="" />
                                
                                    <div class="meeting_user_video_box">
                                        <div class="user_video_deatil_box">
                                            <h2>{local_username}   </h2>
                                        </div>
                                    </div>
                                </div>
                               
                                <div  class={`meeting_member_box user${userColLength}`}>
                               
                                   
                                </div>
                                <div class="meeting_btm_button_box">
                                    <div class="meeting_volume_button_box">
                                        <div class="meeting_btm_button_box_icon">
                                            <img src={tileview} onClick={() => {
                                                            $('.meeting_member_box').toggleClass('user_box_list')
                                                            $("body").toggleClass('TileChange')
                                                            if($("body").hasClass('TileChange')){
                                                                $('.meeting_member_box').css({"position":"relative","max-width":"100%"});
                                                                
                                                            }
                                                            else{
                                                                $('.meeting_member_box').css({"position":"absolute","max-width":"230px"});
                                                                
                                                                
                                                            }
                                                            console.log(remoteTracks.length)
                                            }} className="meeting-icons1" />
                                        </div>
                                    </div>
                                    <div class="meeting_center_button_box">
                                        <div class="meeting_mute_button_box" onClick={muteHandler}>
                                            <div class="meeting_btm_button_box_icon">
                                                {
                                                    audioIcon ? <img src={audioOnImg} className="meeting-icons" /> : <img src={audioOffImg} className="meeting-icons" />
                                                }
                                            </div>
                                        </div>
                                        <div class="meeting_end_button_box" onClick={unload}>
                                            <svg width="94" height="90" viewBox="0 0 94 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M0 30C0 13.4315 13.4315 0 30 0H64C80.5685 0 94 13.4315 94 30V60C94 76.5685 80.5685 90 64 90H30C13.4315 90 0 76.5685 0 60V30Z"
                                                    fill="#FB1717" />
                                                <path
                                                    d="M35.8616 45.4732L35.8616 50.2427C35.8576 50.8811 35.6684 51.5046 35.3169 52.0376C34.9654 52.5705 34.4667 52.9899 33.8814 53.2449L29.8145 54.9909C29.2176 55.2431 28.5594 55.313 27.9228 55.1918C27.2862 55.0705 26.6998 54.7636 26.2374 54.3095L20.9143 48.9864C20.6051 48.6723 20.3626 48.2988 20.2015 47.8884C20.0405 47.4781 19.9641 47.0394 19.977 46.5987C19.9899 46.1581 20.0919 45.7247 20.2768 45.3245C20.4616 44.9243 20.7256 44.5656 21.0527 44.2701C42.6858 25.1708 64.0422 38.3082 71.42 44.1317C71.7803 44.4198 72.0754 44.7809 72.286 45.1912C72.4967 45.6015 72.6181 46.0518 72.6422 46.5124C72.6664 46.973 72.5927 47.4335 72.4261 47.8636C72.2595 48.2936 72.0037 48.6836 71.6755 49.0077L66.5334 54.1499C66.0732 54.6074 65.4866 54.9167 64.8492 55.0381C64.2117 55.1596 63.5525 55.0875 62.9563 54.8312L58.8894 53.0852C58.3003 52.8374 57.7973 52.4214 57.4433 51.8894C57.0892 51.3573 56.8997 50.7327 56.8986 50.0936L56.8986 45.3241C56.8986 45.3241 46.231 37.4033 35.8616 45.4732Z"
                                                    fill="#000000" />
                                            </svg>
                                        </div>
                                        <div class="meeting_record_button_box">
                                            <div onClick={onVideoMuteStateChanged}>
                                                <div class="meeting_btm_button_box_icon">
                                                    {
                                                        videoIcon ? <img src={videoOnImg} className="meeting-icons" /> : <img src={videoOffImg} className="meeting-icons" />
                                                    }
                                                </div>
                                            </div>
                                        </div>                                       
                                        {
                                            source !== "private" && (
                                                <div class="meeting_record_button_box" style={{ marginLeft: 35 }}>
                                                    <div class="meeting_btm_button_box_icon "
                                                        onClick={() => $('.custom-modal').addClass('active')}>
                                                        <img src={participantImage} alt="" className="meeting-icons" />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div class="meeting_setting_button_box">
                                    <div class="meeting_record_button_box">
                                            <div >
                                                <div class="meeting_btm_button_box_icon">
                                                 <img src={copy} className="meeting-icons1" onClick={copyToClipboard}  alt=""/>
                                                </div>
                                                <div class="popup">
                                                <div>
                                                    <span class="MeetingURL">Copy Meeting URL!</span>
                                                    <span class="popuptext d-none" id="myPopup">Copied!</span>
                                                </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <Prelaunch changeAudioOutput={changeAudioOutput} mediaDevices={allMediaDevices} prelaunchMediaHandler={prelaunchMediaHandler} setPrelaunchScreen={setPrelaunchScreen} />
                )
            }

        </>
    )

}

export default MeetingRoom;