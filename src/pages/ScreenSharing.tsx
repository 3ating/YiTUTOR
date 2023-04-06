import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { ScreenShare } from '@material-ui/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDrG9uBznJyP7Fe_4JRwVG7pvR7SjScQsg',
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

interface ScreenSharingProps {
    localStream: MediaStream | null;
    peerConnection: RTCPeerConnection | null;
    isScreenSharing: boolean;
    setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
    roomId: string | null;
}

const ScreenSharing: React.FC<ScreenSharingProps> = ({
    localStream,
    peerConnection,
    isScreenSharing,
    setIsScreenSharing,
    roomId,
}) => {
    const remoteScreenRef = useRef<HTMLVideoElement | null>(null);
    const [remoteScreen, setRemoteScreen] = useState<MediaStream | null>(null);

    const sendSignalData = async (data: any) => {
        await db
            .collection('rooms')
            .doc(roomId || '')
            .update(data);
    };

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
            const newVideoTrackId = newVideoTrack.id;
            sendSignalData({ screenSharingTrackId: newVideoTrackId });

            if (peerConnection) {
                const sender = peerConnection.addTrack(newVideoTrack, stream);
                console.log('sender:', sender);
            }

            // Set the new remote stream for screen sharing video
            const newRemoteStream = new MediaStream(stream.getVideoTracks());
            setRemoteScreen(newRemoteStream);

            // Set the video srcObject for the screen sharing video element
            if (remoteScreenRef.current) {
                remoteScreenRef.current.srcObject = newRemoteStream;
            }
        } catch (err) {
            console.error('Error: ' + err);
        }
        setIsScreenSharing(true);
    };

    console.log('roomid in screensharing:', roomId);

    const stopScreenShare = async () => {
        if (remoteScreen) {
            const screenVideoTrack = remoteScreen
                .getVideoTracks()
                .find((track) => track.kind === 'video' && track.label.includes('screen'));
            if (screenVideoTrack) {
                if (peerConnection) {
                    const sender = peerConnection.getSenders().find((sender) => sender.track === screenVideoTrack);
                    if (sender) {
                        peerConnection.removeTrack(sender);
                    }
                }
                screenVideoTrack.stop();
            }
            setRemoteScreen(null);

            // Notify the remote user to stop receiving the screen sharing stream
            sendSignalData({ stopScreenShare: true });
            sendSignalData({ screenSharingTrackId: firebase.firestore.FieldValue.delete() });
        }
        setIsScreenSharing(false);
    };

    //replaceTrack()
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

    //         if (peerConnection && localStream) {
    //             const sender = peerConnection
    //                 .getSenders()
    //                 .find((sender) => sender.track && sender.track.kind === 'video');
    //             if (sender) {
    //                 await sender.replaceTrack(newVideoTrack);
    //             }
    //         }

    //         // Set the new remote stream for screen sharing video
    //         const newRemoteStream = new MediaStream([newVideoTrack]);
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

    // const stopScreenShare = async () => {
    //     if (remoteScreen && localStream) {
    //         const screenVideoTrack = remoteScreen
    //             .getVideoTracks()
    //             .find((track) => track.kind === 'video' && track.label.includes('screen'));
    //         const originalVideoTrack = localStream.getVideoTracks().find((track) => track.kind === 'video');
    //         if (screenVideoTrack && originalVideoTrack) {
    //             if (peerConnection) {
    //                 const sender = peerConnection.getSenders().find((sender) => sender.track === screenVideoTrack);
    //                 if (sender) {
    //                     await sender.replaceTrack(originalVideoTrack);
    //                 }
    //             }
    //             screenVideoTrack.stop();
    //         }
    //         setRemoteScreen(null);
    //     }
    //     setIsScreenSharing(false);
    // };

    useEffect(() => {
        if (!roomId || !peerConnection) {
            return;
        }

        const handleScreenSharing = async (trackId: string) => {
            console.log('108 trackID:', trackId);
            console.log('109 getReceivers:', peerConnection.getReceivers());

            const track = peerConnection.getReceivers().find((receiver) => receiver.track?.id === trackId)?.track;
            console.log('track:', track);

            if (track) {
                const newRemoteStream = new MediaStream([track]);
                setRemoteScreen(newRemoteStream);

                if (remoteScreenRef.current) {
                    remoteScreenRef.current.srcObject = newRemoteStream;
                }
            }
        };

        const unsubscribe = db
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

    console.log('remoteScreenRef', remoteScreenRef);

    return (
        <>
            {!isScreenSharing ? (
                <Button
                    variant='contained'
                    color='primary'
                    onClick={openScreenShare}
                    disabled={!localStream}
                    startIcon={<ScreenShare />}
                >
                    開啟螢幕共享
                </Button>
            ) : (
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={stopScreenShare}
                    disabled={!remoteScreen}
                    startIcon={<ScreenShare />}
                >
                    停止螢幕分享
                </Button>
            )}
            <video
                ref={remoteScreenRef}
                style={{
                    width: '100%',
                    display: remoteScreen ? 'block' : 'none',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    marginTop: '8px',
                }}
                autoPlay
                muted
            />
        </>
    );
};

export default ScreenSharing;
