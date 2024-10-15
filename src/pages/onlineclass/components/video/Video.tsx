import React from 'react';
import styled from 'styled-components';

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

const VideoScreen = styled.video`
    width: 100%;
    height: 100%;
    border-radius: 7px;
    box-shadow:
        0 4px 6px rgba(0, 0, 0, 0.1),
        0 1px 3px rgba(0, 0, 0, 0.08);
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
interface VideoComponentProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isVisible: boolean;
    username: string;
}

const VideoComponent: React.FC<VideoComponentProps> = ({
    videoRef,
    isVisible,
    username,
}) => {
    return (
        <VideoWrapper>
            <VideoScreen
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={isVisible ? 'visible' : ''}
            ></VideoScreen>
            <UsernameLabel className={isVisible ? 'visible' : ''}>
                {username}
            </UsernameLabel>
        </VideoWrapper>
    );
};

export default VideoComponent;
