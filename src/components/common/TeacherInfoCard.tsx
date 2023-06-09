import PurchaseButton from '@/components/common/PurchaseButton';
import { Teacher } from '@/types/Teacher';
import styled from 'styled-components';
import TeacherCardComponents from './TeacherCard';

interface TeacherInfoCardProps {
    teacher: Teacher;
    href: string;
}

const {
    TeacherImg,
    TeacherCard,
    Highline,
    CoursePrice,
    TeacherInfoContainer,
    TeacherName,
    Subject,
    TeacherDescription,
    RatingContainer,
    RatingNumber,
    calculateAverage,
    renderStars,
} = TeacherCardComponents;

const TeacherCardWrapper = styled.div`
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const TeacherInfoCard = ({ teacher, href }: TeacherInfoCardProps) => {
    return (
        <TeacherCardWrapper>
            <TeacherCard>
                {teacher.avatar && (
                    <TeacherImg src={teacher.avatar} alt={`${teacher.name} 的大頭照`} width={148} height={148} />
                )}
                <CoursePrice>NT${teacher.price?.[0]?.price}/50分鐘</CoursePrice>
                <Highline />
                <TeacherInfoContainer>
                    <TeacherName>{teacher.name}</TeacherName>
                    <Subject>{teacher.subject}家教</Subject>
                    <RatingContainer>
                        <RatingNumber>{calculateAverage(teacher.evaluation).toFixed(1)}</RatingNumber>
                        {renderStars(parseFloat(calculateAverage(teacher.evaluation).toFixed(1)))}
                    </RatingContainer>
                    <TeacherDescription>{teacher.description}</TeacherDescription>
                    <PurchaseButton href={href} />
                </TeacherInfoContainer>
            </TeacherCard>
        </TeacherCardWrapper>
    );
};

export default TeacherInfoCard;
