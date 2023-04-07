import React, { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@material-ui/core';
import { Videocam, GroupAdd, Group, CallEnd, VolumeUp, Mic } from '@material-ui/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import ScreenSharing from './ScreenSharing';
import Chatroom from './Chatroom';
import Canvas from './Canvas';
import * as bodyPix from '@tensorflow-models/body-pix';

const firebaseConfig = {
    apiKey: process.env.FIRESTORE_API_KEY,
    authDomain: 'board-12c3c.firebaseapp.com',
    projectId: 'board-12c3c',
    storageBucket: 'board-12c3c.appspot.com',
    messagingSenderId: '662676665549',
    appId: '1:662676665549:web:d2d23417c365f3ec666584',
    measurementId: 'G-YY6Q81WPY9',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const configuration: RTCConfiguration = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

const VideoChat: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [roomIdInput, setRoomIdInput] = useState('');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);

    useEffect(() => {
        if (localStream && remoteStream && localVideoRef.current && remoteVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [localStream, remoteStream]);

    const openUserMedia = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        setRemoteStream(new MediaStream());
    };

    const hangUp = async () => {
        localStream?.getTracks().forEach((track) => {
            track.stop();
        });

        remoteStream?.getTracks().forEach((track) => track.stop());

        peerConnection?.close();

        setLocalStream(null);
        setRemoteStream(null);
        setPeerConnection(null);
        setRoomId(null);

        if (roomId) {
            const db = firebase.firestore();
            const roomRef = db.collection('rooms').doc(roomId);
            const calleeCandidates = await roomRef.collection('calleeCandidates').get();
            calleeCandidates.forEach(async (candidate) => {
                await candidate.ref.delete();
            });
            const callerCandidates = await roomRef.collection('callerCandidates').get();
            callerCandidates.forEach(async (candidate) => {
                await candidate.ref.delete();
            });
            await roomRef.delete();
        }
    };

    const createRoom = async () => {
        const db = firebase.firestore();
        const roomRef = await db.collection('rooms').doc();

        const pc = new RTCPeerConnection(configuration);

        pc.oniceconnectionstatechange = (event) => {
            console.log('ICE connection state change:', pc.iceConnectionState);
            // handle ICE connection state change here
        };

        setPeerConnection(pc);

        localStream?.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream?.addTrack(track);
            });
        };

        const callerCandidatesCollection = roomRef.collection('callerCandidates');
        pc.onicecandidate = (event) => {
            // console.log('event.candidate in create room:', event.candidate);
            if (event.candidate) {
                callerCandidatesCollection.add(event.candidate.toJSON());
            }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const roomWithOffer = {
            offer: {
                type: offer.type,
                sdp: offer.sdp,
            },
        };

        await roomRef.set(roomWithOffer);
        setRoomId(roomRef.id);
        // console.log('pc in createroom:', pc);

        // Listen for remote description
        roomRef.onSnapshot(async (snapshot) => {
            const data = snapshot.data();
            if (data?.answer && !pc.currentRemoteDescription) {
                const rtcSessionDescription = new RTCSessionDescription(data.answer);
                await pc.setRemoteDescription(rtcSessionDescription);
                // console.log('Remote description set:', rtcSessionDescription);
            }
        });

        roomRef.collection('calleeCandidates').onSnapshot((snapshot: { docChanges: () => any[] }) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added') {
                    // console.log('pc in createroom(onSnapshot):', pc);
                    const data = change.doc.data();
                    await pc.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });
    };

    const handleCreateRoom = async () => {
        await createRoom();
        setRoomDialogOpen(false);
    };

    const joinRoomById = async () => {
        if (roomIdInput === '') return;
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(`${roomIdInput}`);
        const roomSnapshot = await roomRef.get();

        if (roomSnapshot.exists) {
            const pc = new RTCPeerConnection(configuration);

            pc.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream?.addTrack(track);
                });
            };

            pc.oniceconnectionstatechange = (event) => {
                console.log('ICE connection state change:', pc.iceConnectionState);
            };

            setPeerConnection(pc);

            localStream?.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
            });

            const offer = roomSnapshot.data()?.offer;
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            pc.onicecandidate = (event) => {
                // console.log('event.candidate in joinRoomById:', event.candidate);
                if (event.candidate) {
                    // console.log('add calleeCandidates in joinroom()');
                    roomRef.collection('calleeCandidates').add(event.candidate.toJSON());
                }
            };

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            const roomWithAnswer = {
                answer: {
                    type: answer.type,
                    sdp: answer.sdp,
                },
            };

            await roomRef.update(roomWithAnswer);

            // Move the onSnapshot handler after the setRemoteDescription call
            roomRef.collection('callerCandidates').onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    if (change.type === 'added') {
                        // console.log('onSnapshot callerCandidates in joinroom()');

                        const data = change.doc.data();
                        await pc.addIceCandidate(new RTCIceCandidate(data));
                        // console.log('pc.addIceCandidate in joinroom:', pc.addIceCandidate);
                    }
                });
            });

            setRoomId(roomRef.id);
            setRoomDialogOpen(false);
        } else {
            alert('Room not found');
        }
    };

    const handleRoomIdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomIdInput(event.target.value);
    };

    useEffect(() => {
        if (peerConnection) {
            const handleIceCandidate = async (event: RTCPeerConnectionIceEvent) => {
                if (event.candidate && roomId) {
                    const roomRef = db.collection('rooms').doc(roomId);
                    const role = localStream && !remoteStream?.getTracks().length ? 'caller' : 'callee';
                    const candidatesCollection = roomRef.collection(`${role}Candidates`);
                    await candidatesCollection.add(event.candidate.toJSON());
                }
            };

            peerConnection.addEventListener('icecandidate', handleIceCandidate);

            return () => {
                peerConnection.removeEventListener('icecandidate', handleIceCandidate);
            };
        }
    }, [peerConnection, roomId, localStream, remoteStream]);

    const toggleMic = () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = !audioTracks[0].enabled;
                setIsMicMuted(!isMicMuted);
            }
        }
    };

    const toggleAudio = () => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
            setIsAudioMuted(!isAudioMuted);
        }
    };

    return (
        <div>
            {peerConnection && <Canvas roomId={roomId} />}
            <div>
                <video ref={localVideoRef} autoPlay muted style={{ width: '50%', border: '1px solid black' }}></video>
                <video ref={remoteVideoRef} autoPlay style={{ width: '50%', border: '1px solid black' }}></video>
            </div>
            <div>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={openUserMedia}
                    disabled={!!localStream}
                    startIcon={<Videocam />}
                >
                    開啟鏡頭
                </Button>
                <ScreenSharing
                    localStream={localStream}
                    peerConnection={peerConnection}
                    isScreenSharing={isScreenSharing}
                    setIsScreenSharing={setIsScreenSharing}
                    roomId={roomId}
                />
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleCreateRoom}
                    disabled={!localStream || !!roomId}
                    startIcon={<GroupAdd />}
                >
                    建立房間
                </Button>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={() => setRoomDialogOpen(true)}
                    disabled={!localStream || !!roomId}
                    startIcon={<Group />}
                >
                    加入房間
                </Button>
                <Button variant='contained' color='primary' onClick={hangUp} disabled={!roomId} startIcon={<CallEnd />}>
                    掛斷
                </Button>
                <Button
                    variant='contained'
                    color={isMicMuted ? 'secondary' : 'primary'}
                    onClick={toggleMic}
                    disabled={!localStream || !roomId}
                    startIcon={<Mic />}
                >
                    {isMicMuted ? '開啟麥克風' : '關閉麥克風'}
                </Button>
                <Button
                    variant='contained'
                    color={isAudioMuted ? 'secondary' : 'primary'}
                    onClick={toggleAudio}
                    disabled={!remoteStream || !roomId}
                    startIcon={<VolumeUp />}
                >
                    {isAudioMuted ? '開啟音量' : '關閉音量'}
                </Button>
            </div>
            <Dialog open={roomDialogOpen} onClose={() => setRoomDialogOpen(false)}>
                <DialogTitle>加入房間</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin='dense'
                        label='房間ID'
                        fullWidth
                        value={roomIdInput}
                        onChange={handleRoomIdInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRoomDialogOpen(false)} color='primary'>
                        取消
                    </Button>
                    <Button onClick={joinRoomById} color='primary' disabled={!localStream || roomIdInput === ''}>
                        加入
                    </Button>
                </DialogActions>
            </Dialog>
            {roomId && (
                <Typography variant='h6' gutterBottom>
                    房間ID: {roomId}
                </Typography>
            )}
            {peerConnection && <Chatroom roomId={roomId} />}
        </div>
    );
};

export default VideoChat;
