import Image from 'next/image';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsStarHalf } from 'react-icons/bs';
import styled from 'styled-components';
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
    object-fit: cover;
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
    margin: 17px 0 9px;
`;

const Highline = styled.div`
    height: 4px;
    width: 57px;
    background: #ffd335;
`;

const TeacherInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 46px;
    width: 228px;
`;

const TeacherName = styled.p`
    font-weight: 700;
    font-size: 32px;
    line-height: 42px;
    letter-spacing: 0.05em;
    margin: 12px 0 0 0;
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

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 5px 0 0;
`;

const RatingNumber = styled.p`
    font-size: 18px;
    font-weight: 550;
    margin: 0;
`;

const StarIcon = styled(AiFillStar)`
    color: #f5c518;
`;

const EmptyStarIcon = styled(AiOutlineStar)`
    color: #f5c518;
`;

const HalfStarIcon = styled(BsStarHalf)`
    color: #f5c518;
`;

const calculateAverage = (ratings: number[] = []) => {
    if (!Array.isArray(ratings) || ratings.length === 0) {
        return 0;
    }

    const sum = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum / ratings.length;
};

const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <>
            {Array.from({ length: fullStars }, (_, i) => (
                <StarIcon key={i} />
            ))}
            {halfStar && <HalfStarIcon />}
            {Array.from({ length: emptyStars }, (_, i) => (
                <EmptyStarIcon key={i} />
            ))}
        </>
    );
};

const TeacherCardComponents = {
    TeachersContainer,
    TeacherImg,
    TeacherCard,
    CoursePrice,
    Highline,
    TeacherInfoContainer,
    TeacherName,
    Subject,
    TeacherDescription,
    TeacherBtn,
    RatingContainer,
    RatingNumber,
    StarIcon,
    EmptyStarIcon,
    HalfStarIcon,
    calculateAverage,
    renderStars,
};

export default TeacherCardComponents;
