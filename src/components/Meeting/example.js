/* global $, JitsiMeetJS */

// let url = window.location.href;
// url = url.split('?')[1]

let { username, roomname } = parseURLParams(window.location.href);

let local_username = username[0];
let meetingname = roomname[0];
meetingname = meetingname.toLowerCase();
let remote_username = '';

let socket;
socket = io('http://localhost:5000');
socket.emit('join', ({ room: "roomname" }))


const options = {
    serviceUrl: 'https://dockermeet.memoriadev.com/http-bind',
    hosts: {
        domain: 'dockermeet.memoriadev.com',
        muc: 'conference.dockermeet.memoriadev.com'
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
    },
    // disableSimulcast: false,
    // preferH264: true,
    // disableH264: false,
    // videoQuality: {
    //     maxBitratesVideo: {
    //         low: 180,
    //         standard: 180,
    //         high: 180,
    //     },
    // }
    // resolution: 180,

    // constraints: {
    //     video: {
    //         aspectRatio: 16 / 9,
    //         height: {
    //             ideal: 180,
    //             max: 180,
    //             min: 180
    //         }
    //     }
    // },
    // constraints: {
    //     video: {
    //         aspectRatio: 16 / 9,
    //         height: {
    //             ideal: 1280,
    //             max: 1280,
    //             min: 1280
    //         },
    //         width: {
    //             ideal: 1280,
    //             max: 1280,
    //             min: 1280
    //         }

    //     }
    // }
}

const confOptions = {
    openBridgeChannel: true
};

let connection = null;
let isJoined = false;
let room = null;

let localTracks = [];
const remoteTracks = {};

/**
 * Handles local tracks.
 * @param tracks Array with JitsiTrack objects
 */
function onLocalTracks(tracks) {
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
            $('.meeting_call_inr').append(`<video autoplay='1' id='localVideo${i}' />`);
            localTracks[i].attach($(`#localVideo${i}`)[0]);
        } else {
            $('.meeting_call_inr').append(
                `<audio autoplay='1' muted='true' id='localAudio${i}' />`);
            localTracks[i].attach($(`#localAudio${i}`)[0]);
        }
        if (isJoined) {
            room.addTrack(localTracks[i]);
        }
    }
}


function startPrivateMeeting() {

    let privateroomname = local_username+remote_username;
    socket.emit('call-accepted', ({ callFrom: remote_username, callTo: local_username }))
    let userStatus = document.getElementById('user-status');
	try{
			userStatus.innerHTML = " (Busy)";
	}catch(error){
		
	}
	
    
    $('#decline-call').click();
    window.open(`http://127.0.0.1:5500/src/components/Meeting/meeting-room.html?username=${local_username}&roomname=${privateroomname}`)

}

/**
 * Handles remote tracks
 * @param track JitsiTrack object
 */

function makeACall(name) {
    remote_username = name;
    console.log(remote_username)
    socket.emit('request-a-call', { callFrom: local_username, callTo: name })
}

socket.on('on-call-request', ({ callFrom, callTo }) => {
        remote_username = callFrom;
    if (local_username === callTo) {
        $('.call-modal-body').text(`${remote_username} is calling you...`)
        $('#new-call-button').click();
    }
})

socket.on('join-private-meeting', ({ callFrom, callTo }) => {

    console.log("callFrom: ", callFrom)
    console.log("callTo: ", callTo)

    if (local_username === callFrom) {
        let privateroomname = callTo + callFrom;
        let userStatus = document.getElementById('user-status');
        
		try{
			userStatus.innerHTML = " (Busy)";
		}catch(error){
			
		}
		
        window.open(`http://127.0.0.1:5500/src/components/Meeting/meeting-room.html?username=${local_username}&roomname=${privateroomname}`)
    }

})

function onRemoteTrack(track) {
    if (track.isLocal()) {
        return;
    }
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

    if (track.getType() === 'video') {
        $('.meeting_member_box').append(
            `
            <div class="member_box" id='remote-user-${participant}' onclick="makeACall('${participantName}')">
				<div class="member_video_box">
                <img src="images/oliver-ragfelt-khV4fTy6-D8-unsplash 1.png" class="d-none" id='${participant}img' alt="">
				<a href="#" class="join_bg ${participant}-private-meeting">Start Private Meet</a>
                <video autoplay='1' class="${participant}video" id='${participant}video${idx}' style="pointer-events: none" />
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
}

let isVideoMuted = false;
async function onVideoMuteStateChanged(e) {
    // const participant = track.getParticipantId();

    console.log("onVideoMuteStateChanged")
    for (let i = 0; i < localTracks.length; i++) {

        if (localTracks[i].type === "video") {

            try {

                if (isVideoMuted === true) {
                    localTracks[i].unmute();
                    console.log("video unmuted====>");
                    $('.local_video_mute_img').addClass('d-none')
                } else {
                    localTracks[i].mute();
                    console.log("video muted====>");
                    $('.local_video_mute_img').removeClass('d-none')
                }
                isVideoMuted = !isVideoMuted;

            } catch (err) {
                console.log(err);
            }

        }
    }
}


function parseURLParams(url) {
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
let isAudioMuted = false;
function muteHandler() {

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


}


/**
 * That function is executed when the conference is joined
 */
function onConferenceJoined() {
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
    console.log('user left');
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
}

/**
 * That function is called when connection is established successfully
 */
function onConnectionSuccess() {
    room = connection.initJitsiConference(meetingname, confOptions);
    room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
    room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
        const participant = track.getParticipantId();
        const element = $(`#remote-user-${participant}`);
        if (element) {
            element.remove();
        }
        console.log(`track removed!!!${track}`);
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
            // const idx = remoteTracks[participant].push(track);
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

/**
 * This function is called when the connection fail.
 */
function onDeviceListChanged(devices) {
    console.info('current devices', devices);
}

/**
 * This function is called when we disconnect.
 */
function disconnect() {
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
function unload() {
    for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].dispose();
    }
    room.leave();
    connection.disconnect();
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
    JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
}

$(window).bind('beforeunload', unload);
$(window).bind('unload', unload);

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

connection.connect();

JitsiMeetJS.createLocalTracks({ devices: ['audio', 'video'] })
    .then(onLocalTracks)
    .catch(error => {
        throw error;
    });

if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
    JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
        const audioOutputDevices
            = devices.filter(d => d.kind === 'audiooutput');

        if (audioOutputDevices.length > 1) {
            $('#audioOutputSelect').html(
                audioOutputDevices
                    .map(
                        d =>
                            `<option value="${d.deviceId}">${d.label}</option>`)
                    .join('\n'));

            $('#audioOutputSelectWrapper').show();
        }
    });
}