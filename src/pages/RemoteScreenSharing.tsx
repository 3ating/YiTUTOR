import React, { useRef, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const db = firebase.firestore();

interface RemoteScreenSharingProps {
    peerConnection: RTCPeerConnection | null;
    roomId: any | null;
}

const RemoteScreenSharing: React.FC<RemoteScreenSharingProps> = ({ peerConnection, roomId }) => {
    const remoteScreenRef = useRef<HTMLVideoElement | null>(null);
    const [remoteScreen, setRemoteScreen] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (!roomId || !peerConnection) {
            return;
        }

        const handleScreenSharing = async (trackId: string) => {
            const track = peerConnection.getReceivers().find((receiver) => receiver.track?.id === trackId)?.track;
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

    return (
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
    );
};

export default RemoteScreenSharing;
