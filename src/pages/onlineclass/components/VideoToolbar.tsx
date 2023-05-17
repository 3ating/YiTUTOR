import React, { ButtonHTMLAttributes } from 'react';
import { Tooltip } from 'antd';
import { AiFillSwitcher } from 'react-icons/ai';
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill, BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { ImPhoneHangUp } from 'react-icons/im';
import { TbMessageCircle2Filled } from 'react-icons/tb';
import { FaVolumeDown, FaVolumeMute } from 'react-icons/fa';
import { RiVideoAddFill } from 'react-icons/ri';
import styled from 'styled-components';

interface VideoToolbar {
    roomId: string | null;
    showLocalVideo: boolean;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isVideoEnabled: boolean;
    isMicMuted: boolean;
    isAudioMuted: boolean;
    showChatroom: boolean;
    toggleVideoScreen: () => void;
    openUserMedia: () => void;
    toggleChat: () => void;
    toggleVideo: () => void;
    toggleMic: () => void;
    toggleAudio: () => void;
    hangUp: () => void;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
    active?: boolean;
}

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0 0;
`;

const BaseButton = styled.button<ButtonProps>`
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
    &:disabled {
        background-color: lightgray;
        color: gray;
        cursor: not-allowed;
    }
`;

const CreateButton = styled(BaseButton)`
    background-color: ${({ primary }) => (primary ? '#ffd335' : 'gray')};
    &:hover {
        background-color: ${({ primary }) => (primary ? '#ffab34' : 'darkgray')};
    }
`;

const ControlButton = styled(BaseButton)`
    background-color: ${({ active }) => (active ? 'gray' : 'red')};
    &:hover {
        background-color: ${({ active }) => (active ? 'darkgray' : 'darkred')};
    }
`;

const VideoScreenButton = styled(BaseButton)`
    background-color: ${({ active }) => (active ? 'gray' : '#ffd335')};
    &:hover {
        background-color: ${({ active }) => (active ? 'darkgray' : '#ffab34')};
    }
`;

const HangUpButton = styled(BaseButton)`
    background-color: red;
    &:hover {
        background-color: darkred;
    }
`;

const ChatButton = styled(VideoScreenButton)``;

const VideoToolbar: React.FC<VideoToolbar> = ({
    roomId,
    showLocalVideo,
    localStream,
    remoteStream,
    isVideoEnabled,
    isMicMuted,
    isAudioMuted,
    showChatroom,
    toggleVideoScreen,
    openUserMedia,
    toggleChat,
    toggleVideo,
    toggleMic,
    toggleAudio,
    hangUp,
}) => {
    const ICON_SIZE = 22;
    return (
        <ButtonsContainer>
            {!roomId ? (
                <Tooltip title='開啟鏡頭 / 進入教室'>
                    <CreateButton onClick={openUserMedia} primary={roomId == null} disabled={roomId !== null}>
                        <RiVideoAddFill size={ICON_SIZE} />
                    </CreateButton>
                </Tooltip>
            ) : (
                <>
                    <Tooltip title='切換視訊'>
                        <VideoScreenButton
                            active={showLocalVideo}
                            onClick={toggleVideoScreen}
                            disabled={!localStream || !roomId}
                        >
                            <AiFillSwitcher size={ICON_SIZE} />
                        </VideoScreenButton>
                    </Tooltip>
                    <Tooltip title='聊天室'>
                        <ChatButton active={!showChatroom} onClick={toggleChat} disabled={!remoteStream || !roomId}>
                            <TbMessageCircle2Filled size={ICON_SIZE} />
                        </ChatButton>
                    </Tooltip>
                    <Tooltip title='視訊開關'>
                        <ControlButton active={isVideoEnabled} onClick={toggleVideo} disabled={!localStream || !roomId}>
                            {isVideoEnabled ? (
                                <BsFillCameraVideoFill size={ICON_SIZE} />
                            ) : (
                                <BsFillCameraVideoOffFill size={ICON_SIZE} />
                            )}
                        </ControlButton>
                    </Tooltip>
                    <Tooltip title='音訊開關'>
                        <ControlButton active={!isMicMuted} onClick={toggleMic} disabled={!localStream || !roomId}>
                            {isMicMuted ? <BsMicMuteFill size={ICON_SIZE} /> : <BsMicFill size={ICON_SIZE} />}
                        </ControlButton>
                    </Tooltip>
                    <Tooltip title='音量開關'>
                        <ControlButton active={isAudioMuted} onClick={toggleAudio} disabled={!remoteStream || !roomId}>
                            {isAudioMuted ? <FaVolumeDown size={ICON_SIZE} /> : <FaVolumeMute size={ICON_SIZE} />}
                        </ControlButton>
                    </Tooltip>
                    <Tooltip title='離開教室'>
                        <HangUpButton onClick={hangUp} disabled={!localStream || !roomId}>
                            <ImPhoneHangUp size={ICON_SIZE} />
                        </HangUpButton>
                    </Tooltip>
                </>
            )}
        </ButtonsContainer>
    );
};

export default VideoToolbar;
