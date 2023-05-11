import React, {
    useRef,
    useState,
    useEffect,
    ButtonHTMLAttributes,
    Dispatch,
    SetStateAction,
    MutableRefObject,
} from 'react';
// import { Button } from '@material-ui/core';
// import { ScreenShare } from '@material-ui/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { TbScreenShare } from 'react-icons/tb';
import { Tooltip, message } from 'antd';
import { db } from '@/utils/firebase';

// interface ScreenSharingProps {
//     localStream: MediaStream | null;
//     peerConnection: RTCPeerConnection | null;
//     isScreenSharing: boolean;
//     setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
//     roomId: string | null;
// }

interface ScreenSharingProps {
    localStream: MediaStream | null;
    peerConnection: RTCPeerConnection | null;
    isScreenSharing: boolean;
    setIsScreenSharing: Dispatch<SetStateAction<boolean>>;
    remoteScreenRef: MutableRefObject<HTMLVideoElement | null>;
    roomId: string;
    remoteScreen: MediaStream | null;
    setRemoteScreen: Dispatch<SetStateAction<MediaStream | null>>;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
    active?: boolean;
}

const ScreenShareIcon = styled.svg`
    width: 24px;
    height: 24px;
    margin-right: 4px;
`;

const RemoteScreen = styled.video`
    width: 50%;
    display: ${({ show }: { show: boolean }) => (show ? 'block' : 'none')};
    border-radius: 4px;
    border: 1px solid #ddd;
    margin-top: 8px;
`;

// const ShareScreenButton = styled.button<ButtonProps>`
//     background-color: ${({ active }) => (active ? 'cornflowerblue' : 'gray')};
//     color: white;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
//     display: inline-block;
//     font-size: 14px;
//     margin: 4px 2px;
//     padding: 8px 16px 6px 16px;
//     text-align: center;
//     text-decoration: none;
//     &:hover {
//         background-color: ${({ active }) => (active ? 'lightskyblue' : 'darkgray')};
//     }
//     &:disabled {
//         background-color: lightgray;
//         color: gray;
//         cursor: not-allowed;
//     }
// `;
const ShareScreenButton = styled.button<ButtonProps>`
    background-color: ${({ active }) => (active ? '#ffd335' : 'gray')};
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
        background-color: ${({ active }) => (active ? 'darkgoldenrod' : 'darkgray')};
    }
    &:disabled {
        background-color: lightgray;
        color: gray;
        cursor: not-allowed;
    }
`;

const ScreenSharing: React.FC<ScreenSharingProps> = ({
    localStream,
    peerConnection,
    isScreenSharing,
    setIsScreenSharing,
    remoteScreenRef,
    roomId,
    remoteScreen,
    setRemoteScreen,
}) => {
    const ICON_SIZE = 22;
    const { userUid } = useAuth();
    const [screenSharingStream, setScreenSharingStream] = useState<MediaStream | null>(null);
    // const remoteScreenRef = useRef<HTMLVideoElement | null>(null);
    // const [remoteScreen, setRemoteScreen] = useState<MediaStream | null>(null);

    const sendSignalData = async (data: any) => {
        await db
            .collection('users')
            .doc(userUid || '')
            .collection('rooms')
            .doc(roomId || '')
            .update(data);
    };

    // const openScreenShare = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getDisplayMedia({
    //             video: {
    //                 width: { ideal: 1920 },
    //                 height: { ideal: 1080 },
    //                 frameRate: { ideal: 30 },
    //             },
    //         });

    //         const newVideoTrack = stream.getVideoTracks()[0];
    //         const newVideoTrackId = newVideoTrack.id;
    //         // sendSignalData({ screenSharingTrackId: newVideoTrackId });

    //         if (peerConnection) {
    //             const sender = peerConnection.addTrack(newVideoTrack, stream);
    //             console.log('sender:', sender);
    //         }

    //         // Set the new remote stream for screen sharing video
    //         const newRemoteStream = new MediaStream(stream.getVideoTracks());
    //         setRemoteScreen(newRemoteStream);

    //         // Set the video srcObject for the screen sharing video element
    //         if (remoteScreenRef.current) {
    //             remoteScreenRef.current.srcObject = newRemoteStream;
    //         }
    //     } catch (err) {
    //         console.error('Error: ' + err);
    //     }
    //     setIsScreenSharing(true);
    // };

    // console.log('roomid in screensharing:', roomId);

    // const stopScreenShare = async () => {
    //     if (remoteScreen) {
    //         const screenVideoTrack = remoteScreen
    //             .getVideoTracks()
    //             .find((track) => track.kind === 'video' && track.label.includes('screen'));
    //         if (screenVideoTrack) {
    //             if (peerConnection) {
    //                 const sender = peerConnection.getSenders().find((sender) => sender.track === screenVideoTrack);
    //                 if (sender) {
    //                     peerConnection.removeTrack(sender);
    //                 }
    //             }
    //             screenVideoTrack.stop();
    //         }
    //         setRemoteScreen(null);

    //         // Notify the remote user to stop receiving the screen sharing stream
    //         sendSignalData({ stopScreenShare: true });
    //         sendSignalData({ screenSharingTrackId: firebase.firestore.FieldValue.delete() });
    //     }
    //     setIsScreenSharing(false);
    // };

    //replaceTrack()
    const openScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 30 },
                },
            });

            const newVideoTrack = stream.getVideoTracks()[0];
            setScreenSharingStream(stream);
            if (peerConnection && localStream) {
                const sender = peerConnection
                    .getSenders()
                    .find((sender) => sender.track && sender.track.kind === 'video');
                if (sender) {
                    await sender.replaceTrack(newVideoTrack);
                }
            }

            const newRemoteStream = new MediaStream([newVideoTrack]);
            setRemoteScreen(newRemoteStream);

            if (remoteScreenRef.current) {
                remoteScreenRef.current.srcObject = newRemoteStream;
            }

            setIsScreenSharing(true);
        } catch (err) {
            console.error('Error: ' + err);
        }
    };

    const stopScreenShare = async () => {
        if (remoteScreen && localStream) {
            const screenVideoTrack = remoteScreen
                .getVideoTracks()
                .find(
                    (track: { kind: string; label: string | string[] }) =>
                        track.kind === 'video' && track.label.includes('screen')
                );
            if (screenSharingStream) {
                screenSharingStream.getTracks().forEach((track) => track.stop());
            }
            const originalVideoTrack = localStream.getVideoTracks().find((track) => track.kind === 'video');
            if (screenVideoTrack && originalVideoTrack) {
                if (peerConnection) {
                    const sender = peerConnection.getSenders().find((sender) => sender.track === screenVideoTrack);
                    if (sender) {
                        await sender.replaceTrack(originalVideoTrack);
                    }
                }
                screenVideoTrack.stop();
            }
            setRemoteScreen(null);
        }
        setIsScreenSharing(false);
    };

    useEffect(() => {
        if (!roomId || !peerConnection) {
            return;
        }

        const handleScreenSharing = async (trackId: string) => {
            // console.log('108 trackID:', trackId);
            // console.log('109 getReceivers:', peerConnection.getReceivers());

            const track = peerConnection.getReceivers().find((receiver) => receiver.track?.id === trackId)?.track;
            // console.log('track:', track);

            if (track) {
                const newRemoteStream = new MediaStream([track]);
                setRemoteScreen(newRemoteStream);

                if (remoteScreenRef.current) {
                    remoteScreenRef.current.srcObject = newRemoteStream;
                }
            }
        };

        const unsubscribe = db
            .collection('users')
            .doc(userUid || '')
            .collection('rooms')
            .doc(roomId)
            .onSnapshot((doc) => {
                const data = doc.data();
                if (data && data.screenSharingTrackId) {
                    handleScreenSharing(data.screenSharingTrackId);
                }
            });

        return () => {
            unsubscribe();
        };
    }, [roomId, peerConnection]);

    // console.log('remoteScreenRef', remoteScreenRef);

    return (
        <>
            {!isScreenSharing ? (
                <Tooltip title='螢幕分享'>
                    <ShareScreenButton
                        active={isScreenSharing}
                        onClick={openScreenShare}
                        disabled={!localStream || !roomId}
                    >
                        <TbScreenShare size={ICON_SIZE} />
                    </ShareScreenButton>
                </Tooltip>
            ) : (
                <Tooltip title='螢幕分享'>
                    <ShareScreenButton active={isScreenSharing} onClick={stopScreenShare}>
                        <TbScreenShare size={ICON_SIZE} />
                    </ShareScreenButton>
                </Tooltip>
            )}
            {/* <RemoteScreen ref={remoteScreenRef} show={!!remoteScreen} autoPlay muted /> */}
        </>

        // <>
        //     <ShareScreenButton active={isScreenSharing} onClick={openScreenShare} disabled={!localStream || !roomId}>
        //         <TbScreenShare size={ICON_SIZE} />
        //     </ShareScreenButton>
        //     <RemoteScreen ref={remoteScreenRef} show={!!remoteScreen} autoPlay muted />
        // </>
    );
};

export default ScreenSharing;
