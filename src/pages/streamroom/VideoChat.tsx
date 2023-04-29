import React, { HTMLAttributes, useEffect, useRef, useState, ButtonHTMLAttributes } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import ScreenSharing from './ScreenSharing';
import ClassChatroom from './ClassChatroom';
import Canvas from './canvas/Canvas';
import styled from 'styled-components';
import { useAuth } from '../../../public/AuthContext';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { AiFillSwitcher } from 'react-icons/ai';
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill, BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { ImPhoneHangUp } from 'react-icons/im';
import { TbMessageCircle2Filled, TbScreenShare } from 'react-icons/tb';
import { FaVolumeDown, FaVolumeMute } from 'react-icons/fa';
import { RiVideoAddFill } from 'react-icons/ri';

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
    active?: boolean;
}

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: antiquewhite;
`;

const OnlineClassContainer = styled.div`
    position: relative;
    margin: auto 0;
    /* margin-top: 30px; */
    /* height: calc(100vh - 160px); */
`;

const ClassContainer = styled.div`
    display: flex;
    margin-top: 30px;
`;

const VideoContainer = styled.div`
    width: 100%;
    /* display: flex; */
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0 0;
`;

const CreateButton = styled.button<ButtonProps>`
    background-color: ${({ primary }) => (primary ? '#ffd335' : 'gray')};
    color: white;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    padding: 10px 19px 8px 19px;
    text-align: center;
    text-decoration: none;
    &:hover {
        background-color: ${({ primary }) => (primary ? '#ffab34' : 'darkgray')};
    }
    &:disabled {
        background-color: lightgray;
        color: gray;
        cursor: not-allowed;
    }
`;

const ControlButton = styled.button<ButtonProps>`
    background-color: ${({ active }) => (active ? 'gray' : 'red')};
    color: white;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    padding: 10px 13px 8px 13px;
    text-align: center;
    text-decoration: none;
    &:hover {
        background-color: ${({ active }) => (active ? 'darkgray' : 'darkred')};
    }
    &:disabled {
        background-color: lightgray;
        color: gray;
        cursor: not-allowed;
    }
`;

const ShareScreenButton = styled.button<ButtonProps>`
    background-color: ${({ active }) => (active ? '#ffd335' : 'gray')};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    padding: 10px 13px 8px 13px;
    text-align: center;
    text-decoration: none;
    &:hover {
        background-color: ${({ active }) => (active ? '#ffab34' : 'darkgray')};
    }
    &:disabled {
        background-color: lightgray;
        color: gray;
        cursor: not-allowed;
    }
`;

const VideoScreenButton = styled.button<ButtonProps>`
    background-color: ${({ active }) => (active ? 'gray' : '#ffd335')};
    color: white;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    padding: 10px 13px 8px 13px;
    text-align: center;
    text-decoration: none;
    &:hover {
        background-color: ${({ active }) => (active ? 'darkgray' : '#ffab34')};
    }
    &:disabled {
        background-color: lightgray;
        color: gray;
        cursor: not-allowed;
    }
`;

const HangUpButton = styled.button<ButtonProps>`
    background-color: red;
    color: white;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    padding: 10px 19px 8px 19px;
    text-align: center;
    text-decoration: none;
    &:hover {
        background-color: darkred;
    }
    &:disabled {
        background-color: lightgray;
        color: gray;
        cursor: not-allowed;
    }
`;

const ChatButton = styled(VideoScreenButton)`
    /* background-color: ${({ active }) => (active ? 'gray' : 'red')};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    padding: 8px 16px 6px 16px;
    text-align: center;
    text-decoration: none;
    &:hover {
        background-color: ${({ active }) => (active ? 'darkgray' : 'darkred')};
    }
    &:disabled {
        background-color: lightgray;
        color: gray;
        cursor: not-allowed;
    } */
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

const RoomTitle = styled.p<TypographyProps>`
    position: absolute;
    font-size: 16px;
    margin: 0;
    top: 8px;
    left: 16px;
    z-index: 1;
`;

const CenteredContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const UnLoginText = styled.p`
    font-size: 24px;
    letter-spacing: 2px;
    margin: 0 0 5px;
`;

const DirectLink = styled(Link)`
    font-size: 24px;
    letter-spacing: 2px;
    text-decoration: none;
    color: black;
`;

const VideoScreen = styled.video`
    position: absolute;
    bottom: 3.5%;
    right: 2%;
    /* width: 25%; */
    height: 40%;
    border-radius: 7px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    z-index: 1;
    background-color: black;
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.3s ease-in-out;

    &.visible {
        opacity: 1;
        transform: scale(1);
    }
`;

const ChatRoomContainer = styled.div`
    /* margin: 20px 0 5px 0; */
`;

const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
};

const VideoChat: React.FC = () => {
    const ICON_SIZE = 22;
    const { userUid, userInfo, isLoading } = useAuth();
    const [showLocalVideo, setShowLocalVideo] = useState(true);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteStream = useRef<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [roomIdInput, setRoomIdInput] = useState('');
    const [cameraEnabled, setCameraEnabled] = useState(false);

    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [showChatroom, setShowChatroom] = useState(false);

    const [timeRemaining, setTimeRemaining] = useState(50 * 60);

    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);

    const toggleBackgroundBlur = () => {
        setIsBackgroundBlurred(!isBackgroundBlurred);
    };

    const toggleVideoScreen = () => {
        setShowLocalVideo(!showLocalVideo);
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
        setCameraEnabled(true);
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

    const toggleVideo = () => {
        if (localStream) {
            const videoTracks = localStream.current!.getVideoTracks();
            if (videoTracks.length > 0) {
                videoTracks[0].enabled = !videoTracks[0].enabled;
                setIsVideoEnabled(!isVideoEnabled);
            }
        }
    };

    const toggleChat = () => {
        setShowChatroom(!showChatroom);
    };

    useEffect(() => {
        if (!roomId) return;

        const timer = setInterval(() => {
            setTimeRemaining((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [roomId]);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedSeconds = seconds.toString().padStart(2, '0');

    console.log('userUid', userUid);
    console.log('isLoading', isLoading);

    return (
        <MainWrapper>
            <Header />

            {userUid ? (
                <OnlineClassContainer>
                    {roomId && (
                        <RoomTitle>
                            {roomId} - ⏰ {minutes}:{formattedSeconds}
                        </RoomTitle>
                    )}
                    <ClassContainer>
                        <VideoContainer>
                            <div style={{ position: 'relative' }}>
                                <Canvas roomId={roomId} />
                                <VideoScreen
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className={showLocalVideo ? 'visible' : ''}
                                ></VideoScreen>
                                <VideoScreen
                                    ref={remoteVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className={!showLocalVideo ? 'visible' : ''}
                                    style={{ backgroundColor: 'white' }}
                                ></VideoScreen>
                            </div>
                        </VideoContainer>
                        {showChatroom && (
                            <ChatRoomContainer>
                                <ClassChatroom roomId={roomId} toggleChat={toggleChat} />
                            </ChatRoomContainer>
                        )}
                    </ClassContainer>

                    <ButtonsContainer>
                        <CreateButton onClick={openUserMedia} primary={roomId == null} disabled={roomId !== null}>
                            <RiVideoAddFill size={ICON_SIZE} />
                        </CreateButton>

                        <VideoScreenButton
                            active={showLocalVideo}
                            onClick={toggleVideoScreen}
                            disabled={!localStream || !roomId}
                        >
                            <AiFillSwitcher size={ICON_SIZE} />
                        </VideoScreenButton>

                        <ScreenSharing
                            localStream={localStream.current}
                            peerConnection={peerConnection}
                            isScreenSharing={isScreenSharing}
                            setIsScreenSharing={setIsScreenSharing}
                            roomId={roomId}
                        />

                        <ChatButton active={!showChatroom} onClick={toggleChat} disabled={!remoteStream || !roomId}>
                            <TbMessageCircle2Filled size={ICON_SIZE} />
                        </ChatButton>

                        <ControlButton active={isVideoEnabled} onClick={toggleVideo} disabled={!localStream || !roomId}>
                            {isVideoEnabled ? (
                                <BsFillCameraVideoFill size={ICON_SIZE} />
                            ) : (
                                <BsFillCameraVideoOffFill size={ICON_SIZE} />
                            )}
                        </ControlButton>
                        <ControlButton active={!isMicMuted} onClick={toggleMic} disabled={!localStream || !roomId}>
                            {isMicMuted ? <BsMicMuteFill size={ICON_SIZE} /> : <BsMicFill size={ICON_SIZE} />}
                        </ControlButton>
                        <ControlButton active={isAudioMuted} onClick={toggleAudio} disabled={!remoteStream || !roomId}>
                            {isAudioMuted ? <FaVolumeDown size={ICON_SIZE} /> : <FaVolumeMute size={ICON_SIZE} />}
                        </ControlButton>

                        <HangUpButton onClick={hangUp} disabled={!localStream || !roomId}>
                            <ImPhoneHangUp size={ICON_SIZE} />
                        </HangUpButton>
                    </ButtonsContainer>
                </OnlineClassContainer>
            ) : (
                <CenteredContainer>
                    <UnLoginText>請先登入再使用此功能</UnLoginText>
                    <DirectLink href='/membership/SignIn'>點我登入</DirectLink>
                </CenteredContainer>
            )}
            <Footer />
        </MainWrapper>
    );
};

export default VideoChat;
