import React, { HTMLAttributes, useEffect, useRef, useState, ButtonHTMLAttributes } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import ScreenSharing from './ScreenSharing';
import ClassChatroom from './ClassChatroom';
import Canvas from './canvas/Canvas';
import styled from 'styled-components';
import { useAuth } from '../../../public/AuthContext';
import Link from 'next/link';

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

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
};

const VideoChat: React.FC = () => {
    const { userUid, userInfo } = useAuth();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteStream = useRef<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [roomIdInput, setRoomIdInput] = useState('');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);

    const toggleBackgroundBlur = () => {
        setIsBackgroundBlurred(!isBackgroundBlurred);
    };

    useEffect(() => {
        if (localStream.current && remoteStream.current && localVideoRef.current && remoteVideoRef.current) {
            localVideoRef.current.srcObject = localStream.current;
            remoteVideoRef.current.srcObject = remoteStream.current;
        }
    }, [localStream, remoteStream]);

    const findRoomByUserId = async (userId: string | null) => {
        if (!userId) return null;

        const db = firebase.firestore();
        const roomsRef = db.collection('rooms');
        const snapshot = await roomsRef.where('userUid', '==', userId).get();

        if (!snapshot.empty) {
            // Return the ID of the first room found with the matching userId
            return snapshot.docs[0].id;
        } else {
            return null;
        }
    };
    const openUserMedia = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;
        remoteStream.current = new MediaStream();

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream.current;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');

        const existingRoomId = await findRoomByUserId(userId);

        if (existingRoomId) {
            setRoomIdInput(existingRoomId);
            await joinRoomById(existingRoomId);
            console.log('有人開房間：', existingRoomId);
        } else {
            await createRoom();
            console.log('沒人開房間');
        }
    };

    const hangUp = async () => {
        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => {
                track.stop();
            });
        }

        if (remoteStream.current) {
            remoteStream.current.getTracks().forEach((track) => track.stop());
        }

        peerConnection?.close();

        localStream.current = null;
        remoteStream.current = null;
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
        console.log('localstream in create room:', localStream.current);

        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStream.current!);
            });
        }

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                if (remoteStream.current) {
                    remoteStream.current.addTrack(track);
                }
            });
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream.current;
            }
        };

        const callerCandidatesCollection = roomRef.collection('callerCandidates');
        pc.onicecandidate = (event) => {
            console.log('onicecandidate event triggered:', event);
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
            userUid: userUid,
        };

        await roomRef.set(roomWithOffer);
        setRoomId(roomRef.id);

        // Listen for remote description
        roomRef.onSnapshot(async (snapshot) => {
            const data = snapshot.data();
            if (data?.answer && !pc.currentRemoteDescription) {
                const rtcSessionDescription = new RTCSessionDescription(data.answer);
                await pc.setRemoteDescription(rtcSessionDescription);
            }
        });

        roomRef.collection('calleeCandidates').onSnapshot((snapshot: { docChanges: () => any[] }) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added') {
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

    const joinRoomById = async (roomId: string) => {
        if (!roomId) return;
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(`${roomId}`);
        const roomSnapshot = await roomRef.get();

        if (roomSnapshot.exists) {
            const pc = new RTCPeerConnection(configuration);

            pc.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.current?.addTrack(track);
                });
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream.current;
                }
            };

            pc.oniceconnectionstatechange = (event) => {
                console.log('ICE connection state change:', pc.iceConnectionState);
            };

            setPeerConnection(pc);
            console.log('localstream in joinroom:', localStream);

            if (localStream.current) {
                localStream.current.getTracks().forEach((track) => {
                    pc.addTrack(track, localStream.current!);
                });
            }

            const offer = roomSnapshot.data()?.offer;
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            pc.onicecandidate = (event) => {
                // console.log('event.candidate in joinRoomById:', event.candidate);
                if (event.candidate) {
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
                console.log('handleIceCandidate');

                if (event.candidate && roomId) {
                    const roomRef = db.collection('rooms').doc(roomId);
                    const role = localStream.current && !remoteStream.current?.getTracks().length ? 'caller' : 'callee';
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
            const audioTracks = localStream.current!.getAudioTracks();
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
    // console.log(userUid);
    // console.log(userInfo);

    // console.log('localVideoRef');

    // console.log('remoteVideoRef', remoteVideoRef);

    return (
        <>
            {userUid ? (
                <div>
                    {peerConnection && <Canvas roomId={roomId} />}
                    <div style={{ display: 'flex' }}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            style={{ width: '50%', border: '1px solid black' }}
                        ></video>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            style={{ width: '50%', border: '1px solid black' }}
                        ></video>
                    </div>
                    <div>
                        <Button primary onClick={openUserMedia} disabled={!!localStream.current}>
                            <StyledIcon />
                            開啟鏡頭
                        </Button>

                        <ScreenSharing
                            localStream={localStream.current}
                            peerConnection={peerConnection}
                            isScreenSharing={isScreenSharing}
                            setIsScreenSharing={setIsScreenSharing}
                            roomId={roomId}
                        />
                        {/* {userInfo?.userType === 'teacher' && ( */}
                        {/* <Button primary onClick={handleCreateRoom} disabled={!localStream || !!roomId}>
                            <StyledIcon />
                            建立房間
                        </Button> */}
                        {/* )} */}
                        {/* {userInfo?.userType === 'student' && ( */}
                        {/* <Button primary onClick={() => setRoomDialogOpen(true)} disabled={!localStream || !!roomId}>
                            <StyledIcon />
                            加入房間
                        </Button> */}
                        {/* )} */}
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
                                value={roomIdInput}
                                onChange={handleRoomIdInputChange}
                                style={{ width: '100%', marginBottom: '16px' }}
                            />
                        </DialogContent>
                        {/* <DialogActions>
                            <Button onClick={() => setRoomDialogOpen(false)}>取消</Button>
                            <Button onClick={joinRoomById} disabled={!localStream || roomIdInput === ''}>
                                加入
                            </Button>
                        </DialogActions> */}
                    </Dialog>
                    {roomId && (
                        <Typography variant='h6' gutterBottom>
                            房間ID: {roomId}
                        </Typography>
                    )}
                    {peerConnection && <ClassChatroom roomId={roomId} />}
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <DirectLink href='/membership/SignIn'>
                        <p>請先登入再使用此功能</p>
                    </DirectLink>
                </div>
            )}
        </>
    );
};

export default VideoChat;
