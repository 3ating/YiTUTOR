import styled from 'styled-components';
import Image from 'next/image';
import PrimaryButton from './Button';

const TeachersContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 26px;
    margin-bottom: 143px;
`;

const TeacherImg = styled(Image)`
    margin-top: 20px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const TeacherCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
    height: 538px;
    border: 1px black solid;
    background: white;
    padding: 20px 0 10px;
`;

const CoursePrice = styled.p`
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.05em;
    margin: 24px 0 12px;
`;

const Hightline = styled.div`
    height: 4px;
    width: 57px;
    background: #ffd335;
`;

const TeacherInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 46px;
    /* width: 355px; */
`;

const TeacherName = styled.p`
    font-weight: 700;
    font-size: 32px;
    line-height: 42px;
    letter-spacing: 0.05em;
    margin: 28px 0 0 0;
`;

const Subject = styled.p`
    font-weight: 400;
    font-size: 18px;
    letter-spacing: 0.05em;
    line-height: 27px;
    margin: 5px 0 0 1px;
`;

const TeacherDescription = styled.p`
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    height: 95px;
    letter-spacing: 0.05em;
    color: #999999;
    margin-bottom: 25px;
`;

const TeacherBtn = styled(PrimaryButton)`
    width: 100%;
`;

const TeacherCardComponents = {
    TeachersContainer,
    TeacherImg,
    TeacherCard,
    CoursePrice,
    Hightline,
    TeacherInfoContainer,
    TeacherName,
    Subject,
    TeacherDescription,
    TeacherBtn,
};

export default TeacherCardComponents;
