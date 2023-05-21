import React from 'react';
import styled from 'styled-components';
import Button from '../../../components/common/Button';
import Link from 'next/link.js';

type SignUpFormProps = {
    userType: string;
    showTeacherDetails: boolean;
    finalStep: boolean;
    message: string;
};

const SubmitButton = styled(Button)`
    border-radius: 9px;
    letter-spacing: 2px;
    background-color: ${(props) =>
        props.children === '下一步' || props.children === '最後一步' ? 'black' : '#ffab34'};
    &:hover {
        background-color: ${(props) =>
            props.children === '下一步' || props.children === '最後一步' ? '#333' : '#f9b352'};
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: gray;
    width: fit-content;
    display: inline-block;
    margin-top: 10px;
    &:hover {
        color: #333333;
    }
`;

const SignUpForm: React.FC<SignUpFormProps> = ({ userType, showTeacherDetails, finalStep, message }) => {
    return (
        <ButtonContainer>
            <SubmitButton type='submit'>
                {userType === 'teacher'
                    ? showTeacherDetails
                        ? finalStep
                            ? '提交'
                            : '最後一步'
                        : '下一步'
                    : finalStep
                    ? '提交'
                    : '提交'}
            </SubmitButton>
            {message && <p>{message}</p>}
            {!showTeacherDetails && <DirectLink href='login'>已經有帳號，前往登入</DirectLink>}
        </ButtonContainer>
    );
};

export default SignUpForm;
