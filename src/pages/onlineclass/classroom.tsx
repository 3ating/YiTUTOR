import React, { HTMLAttributes, useEffect, useRef, useState, ButtonHTMLAttributes } from 'react';
import firebase from 'firebase/compat/app';
import { useRouter } from 'next/router';
import ClassChatroom from './components/Chatroom';
import Canvas from './components/canvas/Canvas';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { message } from 'antd';
import { db } from '@/utils/firebase';
import CountdownTimer from './components/CountdownTimer';
import LoginPrompt from '@/components/common/LoginPrompt';
import RatingModal from './components/RatingModal';
import VideoToolbar from './components/VideoToolbar';

interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
    variant?: 'h6' | 'body';
    gutterBottom?: boolean;
}
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
    active?: boolean;
}

interface LiveTextContainerProps {
    bothUsersJoined: boolean;
}

interface TheOtherAvatarProps {
    TheOtherUserJoined: boolean;
}

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 65px 0;
    box-sizing: border-box;
    background-color: antiquewhite;
    justify-content: center;
`;

const OnlineClassContainer = styled.div`
    padding: 0 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ClassContainer = styled.div`
    display: flex;
    position: relative;
    gap: 10px;
`;

const VideoWrapper = styled.div`
    position: absolute;
    bottom: 3.2%;
    right: 1.2%;
    width: 247px;
    height: 185px;
`;

const UsernameLabel = styled.div`
    position: absolute;
    left: 5px;
    bottom: 5px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: all 0.3s ease-in-out;

    &.visible {
        opacity: 1;
    }
`;

const VideoContainer = styled.div`
    width: 100%;
    position: relative;
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

const TimeAvatarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const RoomTitle = styled.p<TypographyProps>`
    display: flex;
    align-items: flex-end;
    font-size: 20px;
    margin: 0;
    z-index: 1;
`;

const VideoScreen = styled.video`
    width: 100%;
    height: 100%;
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

const LiveTextContainer = styled.div<LiveTextContainerProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${(props) => (props.bothUsersJoined ? '#ff5555' : '#ccc')};
    width: 68px;
    height: 25px;
    border-radius: 9px;
    position: absolute;
    top: 5px;
    right: 3px;
    z-index: 1;
`;

const LiveText = styled.p`
    font-size: 12px;
    letter-spacing: 3px;
    margin: 0;
    color: white;
`;

const ChatRoomContainer = styled.div``;

const AvatarContainer = styled.div`
    display: flex;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 5px;
`;

const TheOtherAvatar = styled.img<TheOtherAvatarProps>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 5px;
    filter: ${(props) => (props.TheOtherUserJoined ? 'none' : 'grayscale(100%)')};
    opacity: ${(props) => (props.TheOtherUserJoined ? '1' : '0.5')};
`;

const RemoteScreen = styled.video`
    width: 40%;
    display: ${({ show }: { show: boolean }) => (show ? 'block' : 'none')};
    border-radius: 4px;
    border: 1px solid #ddd;
    border-radius: 9px;
    object-fit: cover;
    max-height: 500px;
`;

const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
};

const VideoChat: React.FC = () => {
    const router = useRouter();
    const { userUid, userInfo } = useAuth();
    const [showLocalVideo, setShowLocalVideo] = useState(true);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const remoteStream = useRef<MediaStream | null>(null);
    const remoteScreenRef = useRef<HTMLVideoElement | null>(null);
    const [remoteScreen, setRemoteScreen] = useState<MediaStream | null>(null);
    const prevBothUsersJoined = useRef(false);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [roomIdInput, setRoomIdInput] = useState('');
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [showChatroom, setShowChatroom] = useState(false);
    const [bothUsersJoined, setBothUsersJoined] = useState(false);
    const [anotheruserAvatar, setAnotherUserAvatar] = useState('');
    const [anotherUserName, setAnotherUserName] = useState('');
    const [classUrlId, setClassUrlId] = useState<string | null>(null);
    const [showRatingModal, setShowRatingModal] = useState(false);

    const findRoomByUserId = async (userId: string | null) => {
        if (!userId) return null;

        const db = firebase.firestore();
        const roomsRef = db.collection('rooms');
        const snapshot = await roomsRef.where('userUid', '==', userId).get();

        if (!snapshot.empty) {
            return snapshot.docs[0].id;
        } else {
            return null;
        }
    };

    const getUserAvatar = async (userId: string | null | undefined) => {
        if (!userId) return '';

        const db = firebase.firestore();
        const userRef = db.collection('users').doc(userId);
        const userSnapshot = await userRef.get();

        if (userSnapshot.exists) {
            return userSnapshot.data()?.avatar || '';
        } else {
            return '';
        }
    };

    const getUserName = async (userId: string | null | undefined) => {
        if (!userId) return '';

        const db = firebase.firestore();
        const userRef = db.collection('users').doc(userId);
        const userSnapshot = await userRef.get();

        if (userSnapshot.exists) {
            return userSnapshot.data()?.name || '';
        } else {
            return '';
        }
    };

    const openUserMedia = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;
        remoteStream.current = new MediaStream();

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream.current;
        }

        const userAvatar = await getUserAvatar(classUrlId);
        setAnotherUserAvatar(userAvatar);

        const userName = await getUserName(classUrlId);
        setAnotherUserName(userName);
        const existingRoomId = await findRoomByUserId(classUrlId);

        if (existingRoomId) {
            setRoomIdInput(existingRoomId);
            await joinRoomById(existingRoomId);
            message.success(`Hello！您已成功進入線上教室`);
        } else {
            await createRoom();
            message.success(`Hello！您已成功進入線上教室`);
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

            await roomRef.update({ callEnded: true });

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
        setBothUsersJoined(false);

        if (classUrlId) {
            const db = firebase.firestore();
            const usersRef = db.collection('users');
            const usersSnapshot = await usersRef.get();
            usersSnapshot.forEach(async (userDoc) => {
                const userData = userDoc.data();
                const userBookings = userData.bookings || [];
                const updatedBookings = userBookings.filter((booking: any) => {
                    return booking.studentId !== classUrlId && booking.teacherId !== classUrlId;
                });
                if (userBookings.length !== updatedBookings.length) {
                    await userDoc.ref.update({ bookings: updatedBookings });
                }
            });
        }
    };

    const createRoom = async () => {
        const db = firebase.firestore();
        const roomRef = await db.collection('rooms').doc();

        const pc = new RTCPeerConnection(configuration);

        pc.oniceconnectionstatechange = (event) => {};

        setPeerConnection(pc);

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
            if (localStream.current && remoteStream.current) {
                setBothUsersJoined(true);
            }
        };

        const callerCandidatesCollection = roomRef.collection('callerCandidates');
        pc.onicecandidate = (event) => {
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

        roomRef.onSnapshot(async (snapshot) => {
            const data = snapshot.data();
            if (data?.callEnded) {
                hangUp();
            }
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

    const joinRoomById = async (roomId: string) => {
        if (!roomId) return;
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(`${roomId}`);
        const roomSnapshot = await roomRef.get();

        roomRef.onSnapshot(async (snapshot) => {
            const data = snapshot.data();
            if (data?.callEnded) {
                hangUp();
            }
        });

        if (roomSnapshot.exists) {
            const pc = new RTCPeerConnection(configuration);

            pc.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.current?.addTrack(track);
                });
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream.current;
                }
                if (localStream.current && remoteStream.current) {
                    setBothUsersJoined(true);
                }
            };
            pc.oniceconnectionstatechange = (event) => {};
            setPeerConnection(pc);
            if (localStream.current) {
                localStream.current.getTracks().forEach((track) => {
                    pc.addTrack(track, localStream.current!);
                });
            }

            const offer = roomSnapshot.data()?.offer;
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            pc.onicecandidate = (event) => {
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
            roomRef.collection('callerCandidates').onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    if (change.type === 'added') {
                        const data = change.doc.data();
                        await pc.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });

            setRoomId(roomRef.id);
            setRoomDialogOpen(false);
        } else {
            alert('Room not found');
        }
    };

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

    const toggleVideoScreen = () => {
        setShowLocalVideo(!showLocalVideo);
    };

    useEffect(() => {
        if (peerConnection) {
            const handleIceCandidate = async (event: RTCPeerConnectionIceEvent) => {
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

    useEffect(() => {
        if (localStream.current && remoteStream.current && localVideoRef.current && remoteVideoRef.current) {
            localVideoRef.current.srcObject = localStream.current;
            remoteVideoRef.current.srcObject = remoteStream.current;
        }
    }, [localStream, remoteStream]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        setClassUrlId(userId);
    }, []);

    useEffect(() => {
        if (prevBothUsersJoined.current && !bothUsersJoined && userInfo?.userType === 'student') {
            setShowRatingModal(true);
        }
        if (prevBothUsersJoined.current && !bothUsersJoined && userInfo?.userType === 'teacher') {
            router.push(`/teachers/${userUid}`);
        }
        prevBothUsersJoined.current = bothUsersJoined;
    }, [bothUsersJoined, userInfo]);

    useEffect(() => {
        if (!bothUsersJoined) return;
        setTimeout(() => {
            message.info('線上上課開始');
        }, 500);
    }, [bothUsersJoined]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (bothUsersJoined) {
                event.preventDefault();
                event.returnValue = '您確定要離開視訊通話嗎？未保存的更改可能會丟失。';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [bothUsersJoined]);

    return (
        <MainWrapper>
            {userUid ? (
                <OnlineClassContainer>
                    {roomId && (
                        <>
                            <TimeAvatarContainer>
                                <AvatarContainer>
                                    <Avatar src={userInfo?.avatar} alt='User Avatar' />
                                    {classUrlId && (
                                        <TheOtherAvatar
                                            src={anotheruserAvatar}
                                            alt='User Avatar'
                                            TheOtherUserJoined={bothUsersJoined}
                                        />
                                    )}
                                </AvatarContainer>
                                <RoomTitle>
                                    <CountdownTimer initialTime={50 * 60} bothUsersJoined={bothUsersJoined} />
                                </RoomTitle>
                            </TimeAvatarContainer>
                        </>
                    )}
                    <ClassContainer>
                        <VideoContainer>
                            <div style={{ position: 'relative' }}>
                                <Canvas roomId={roomId} />
                                <VideoWrapper>
                                    <VideoScreen
                                        ref={localVideoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className={showLocalVideo ? 'visible' : ''}
                                    ></VideoScreen>
                                    <UsernameLabel className={showLocalVideo ? 'visible' : ''}>你</UsernameLabel>
                                </VideoWrapper>
                                <VideoWrapper>
                                    <VideoScreen
                                        ref={remoteVideoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className={!showLocalVideo ? 'visible' : ''}
                                        style={{ backgroundColor: 'white' }}
                                    ></VideoScreen>
                                    <UsernameLabel className={!showLocalVideo ? 'visible' : ''}>
                                        {anotherUserName}
                                    </UsernameLabel>
                                </VideoWrapper>
                            </div>
                            <LiveTextContainer bothUsersJoined={bothUsersJoined}>
                                <LiveText>{classUrlId ? '上課中' : '試用中'}</LiveText>{' '}
                            </LiveTextContainer>
                        </VideoContainer>
                        <RemoteScreen ref={remoteScreenRef} show={!!remoteScreen} autoPlay muted />
                        {showChatroom && (
                            <ChatRoomContainer>
                                <ClassChatroom roomId={roomId} toggleChat={toggleChat} />
                            </ChatRoomContainer>
                        )}
                    </ClassContainer>
                    <VideoToolbar
                        roomId={roomId}
                        showLocalVideo={showLocalVideo}
                        localStream={localStream.current}
                        remoteStream={remoteStream.current}
                        isVideoEnabled={isVideoEnabled}
                        isMicMuted={isMicMuted}
                        isAudioMuted={isAudioMuted}
                        showChatroom={showChatroom}
                        toggleVideoScreen={toggleVideoScreen}
                        openUserMedia={openUserMedia}
                        toggleChat={toggleChat}
                        toggleVideo={toggleVideo}
                        toggleMic={toggleMic}
                        toggleAudio={toggleAudio}
                        hangUp={hangUp}
                    />
                    <RatingModal
                        classUrlId={classUrlId}
                        userType={userInfo?.userType || ''}
                        userUid={userUid}
                        isVisible={showRatingModal}
                        closeModal={() => setShowRatingModal(false)}
                    />
                </OnlineClassContainer>
            ) : (
                <LoginPrompt />
            )}
        </MainWrapper>
    );
};

export default VideoChat;
