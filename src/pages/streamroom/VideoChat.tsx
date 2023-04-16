import React, { HTMLAttributes, useEffect, useRef, useState, ButtonHTMLAttributes } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import ScreenSharing from './ScreenSharing';
import ClassChatroom from './ClassChatroom';
import Canvas from './canvas/Canvas';
import styled from 'styled-components';
import { useAuth } from '../auth/AuthContext';

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

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
}

interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
    variant?: 'h6' | 'body';
    gutterBottom?: boolean;
}
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
}

const Button = styled.button<ButtonProps>`
    background-color: ${({ primary }) => (primary ? 'blue' : 'gray')};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    &:hover {
        background-color: ${({ primary }) => (primary ? 'darkblue' : 'darkgray')};
    }
    &:disabled {
        background-color: lightgray;
        color: gray;
        cursor: not-allowed;
    }
`;

const Dialog = styled.div<DialogProps>`
    display: ${({ open }) => (open ? 'block' : 'none')};
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
`;

const DialogActions = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 8px;
    gap: 8px;
`;

const DialogContent = styled.div`
    background-color: white;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
`;

const DialogTitle = styled.h2`
    margin: 0;
    padding-bottom: 10px;
`;

const TextField = styled.input`
    display: block;
    width: 100%;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    margin-bottom: 10px;
`;

const Typography = styled.p<TypographyProps>`
    font-size: ${({ variant }) => (variant === 'h6' ? '1.25rem' : '1rem')};
    margin-bottom: ${({ gutterBottom }) => (gutterBottom ? '0.35em' : '0')};
`;

const StyledIcon = styled.i`
    font-size: 1.2rem;
    margin-right: 4px;
`;

const configuration: RTCConfiguration = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

const VideoChat: React.FC = () => {
    const { userUid } = useAuth();
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
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
    const [hostUidInput, setHostUidInput] = useState('');

    const toggleBackgroundBlur = () => {
        setIsBackgroundBlurred(!isBackgroundBlurred);
    };

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
        const userRef = db.collection('users').doc(userUid!);
        const roomRef = await userRef.collection('rooms').doc();

        // const roomRef = await db.collection('rooms').doc();

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
    console.log(userUid);

    const joinRoomById = async () => {
        if (roomIdInput === '') return;
        const db = firebase.firestore();
        const hostUid = hostUidInput;
        const userRef = db.collection('users').doc(hostUid);
        const roomRef = userRef.collection('rooms').doc(`${roomIdInput}`);
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
            <div style={{ display: 'flex' }}>
                <video ref={localVideoRef} autoPlay muted style={{ width: '50%', border: '1px solid black' }}></video>
                <video ref={remoteVideoRef} autoPlay style={{ width: '50%', border: '1px solid black' }}></video>
            </div>
            <div>
                <Button primary onClick={openUserMedia} disabled={!!localStream}>
                    <StyledIcon />
                    開啟鏡頭
                </Button>
                <ScreenSharing
                    localStream={localStream}
                    peerConnection={peerConnection}
                    isScreenSharing={isScreenSharing}
                    setIsScreenSharing={setIsScreenSharing}
                    roomId={roomId}
                />
                <Button primary onClick={handleCreateRoom} disabled={!localStream || !!roomId}>
                    <StyledIcon />
                    建立房間
                </Button>
                <Button primary onClick={() => setRoomDialogOpen(true)} disabled={!localStream || !!roomId}>
                    <StyledIcon />
                    加入房間
                </Button>
                <Button primary onClick={hangUp} disabled={!roomId}>
                    <StyledIcon />
                    掛斷
                </Button>
                <Button primary={!isMicMuted} onClick={toggleMic} disabled={!localStream || !roomId}>
                    <StyledIcon />
                    {isMicMuted ? '開啟麥克風' : '關閉麥克風'}
                </Button>
                <Button primary={!isAudioMuted} onClick={toggleAudio} disabled={!remoteStream || !roomId}>
                    <StyledIcon />
                    {isAudioMuted ? '開啟音量' : '關閉音量'}
                </Button>
            </div>
            <Dialog open={roomDialogOpen}>
                <DialogTitle>加入房間</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        value={hostUidInput}
                        onChange={(event) => setHostUidInput(event.target.value)}
                        placeholder='Host UID'
                        style={{ width: '95%', marginBottom: '16px' }}
                    />
                    <TextField
                        autoFocus
                        value={roomIdInput}
                        onChange={handleRoomIdInputChange}
                        placeholder='Room ID'
                        style={{ width: '95%', marginBottom: '16px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRoomDialogOpen(false)}>取消</Button>
                    <Button onClick={joinRoomById} disabled={!localStream || roomIdInput === ''}>
                        加入
                    </Button>
                </DialogActions>
            </Dialog>
            {roomId && (
                <>
                    <Typography variant='h6' gutterBottom>
                        User ID: {userUid}
                    </Typography>
                    <Typography variant='h6' gutterBottom>
                        房間ID: {roomId}
                    </Typography>
                </>
            )}
            {peerConnection && <ClassChatroom roomId={roomId} />}
        </div>
    );
};

export default VideoChat;
