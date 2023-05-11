import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import PrimaryButton from '../Button';
import mainImg from './images/mainImg.png';
import online from './images/onlne.png';
import ai from './images/ai.png';
import board from './images//board.png';
import AIChat from '../GPT/AIChatBtn';
import Link from 'next/link';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import TeacherCardComponents from '../TeacherCard';
import { db } from '@/utils/firebase';
import { useAuth } from '../../context/AuthContext';

const {
    TeacherImg,
    TeacherCard,
    CoursePrice,
    TeacherInfoContainer,
    TeacherName,
    Subject,
    TeacherDescription,
    TeacherBtn,
    RatingContainer,
    RatingNumber,
    calculateAverage,
    renderStars,
} = TeacherCardComponents;

const MainWrapper = styled.div`
    margin: 65px 0;
`;

const TeacherCardWrapper = styled.div`
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const BannerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    /* gap: 44px; */
    padding: 0 20px;
`;

const BannerTextContainer = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 15px 25px;
    gap: 10px;
    width: 441px;
    margin: 0 auto;
`;

const BannerText = styled.p`
    font-weight: 700;
    font-size: 48px;
    line-height: 64px;
    margin-bottom: 0;
    letter-spacing: 1px;
`;

const FeaturesContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 700px;
    position: relative;
    margin-bottom: 40px;
`;

const MainDescriptionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin-bottom: 45px;
`;

const MainDescription = styled.p`
    font-size: 36px;
    font-weight: 700;
    line-height: 48px;
    text-align: center;
    z-index: 1;
`;

const MainDescriptionHightline = styled.div`
    position: absolute;
    bottom: 35px;
    background: #ffd335;
    width: 574px;
    height: 23px;
`;

const FeatureBg = styled.div`
    width: 100%;
    height: 295px;
    background: #ffd335;
    position: absolute;
    bottom: 0;
`;

const FeatureBoxContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    /* margin: 0 50px; */
`;

const FeatureBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 350px;
    height: 426px;
    filter: drop-shadow(7px 9px 0px #000000);
    background: #ffffff;
    border: 10px solid #ffd335;
    z-index: 1;
`;

const FeatureBoxTitle = styled.p`
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.1em;
    margin: 30px 0 32px 0;
`;

const FeatureBoxText = styled.p`
    font-weight: 500;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
    color: #454545;
    margin-top: 26px;
    width: 276px;
`;

const Hightline = styled.div`
    height: 4px;
    width: 57px;
    background: #ffd335;
`;

const TeachersInfoContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    /* height: 700px; */
    position: relative;
`;

const TeachersContainer = styled.div`
    display: flex;
    /* justify-content: center; */
    gap: 10px;
    margin-bottom: 143px;
    overflow-x: scroll;
    scroll-behavior: smooth;
    position: relative;
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: hidden;
`;

const Mask = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(
        to right,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0) 20%,
        rgba(255, 255, 255, 0) 80%,
        rgba(255, 255, 255, 1) 100%
    );
    pointer-events: none;
`;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const ScrollButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: relative;
`;

const ScrollButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    background-color: #acacac;
    color: white;
    border-radius: 50%;
    width: auto;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
    padding: 0 12px;
    margin: 0 8px 100px;
    position: absolute;
    &:hover {
        background-color: #000;
    }
`;

const ScrollButtonLeft = styled(ScrollButton)`
    left: 15px;
    z-index: 1;
`;

const ScrollButtonRight = styled(ScrollButton)`
    right: 15px;
    z-index: 1;
`;

interface Teacher {
    uid: string;
    evaluation: number[];
    subject: any;
    name: string;
    email: string;
    phone: string;
    userType: string;
    description?: string;
    price?: { qty: number; price: number }[];
    avatar?: string;
}

// const firebaseConfig = {
//     apiKey: process.env.FIRESTORE_API_KEY,
//     authDomain: 'board-12c3c.firebaseapp.com',
//     projectId: 'board-12c3c',
//     storageBucket: 'board-12c3c.appspot.com',
//     messagingSenderId: '662676665549',
//     appId: '1:662676665549:web:d2d23417c365f3ec666584',
//     measurementId: 'G-YY6Q81WPY9',
// };

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

// const db = firebase.firestore();

export default function Main() {
    const { isLoading } = useAuth();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollTo = (direction: string) => {
        if (containerRef.current) {
            const container = containerRef.current;
            const cardWidth = 400;
            const padding = 10;
            const totalCardWidth = cardWidth + 2 * padding;

            const currentScroll = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;

            if (direction === 'right') {
                const nextScroll = currentScroll + totalCardWidth;
                container.scrollLeft = nextScroll > maxScroll ? maxScroll : nextScroll;
            } else {
                const prevScroll = currentScroll - totalCardWidth;
                container.scrollLeft = prevScroll < 0 ? 0 : prevScroll;
            }
        }
    };

    const handleScrollLeft = () => {
        scrollTo('left');
    };

    const handleScrollRight = () => {
        scrollTo('right');
    };

    useEffect(() => {
        const unsubscribe = db
            .collection('users')
            .where('userType', '==', 'teacher')
            .onSnapshot((snapshot) => {
                const teachersData: Teacher[] = snapshot.docs.map((doc) => {
                    return {
                        ...doc.data(),
                        uid: doc.id,
                    } as unknown as Teacher;
                });
                setTeachers(teachersData);
            });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <MainWrapper>
            <BannerContainer>
                <BannerTextContainer>
                    <BannerText>
                        Easy to Learn
                        <br /> Easy to Achieve <br />
                        with YiTUTOR
                    </BannerText>
                    <DirectLink href={'/membership/signup'}>
                        {!isLoading && <PrimaryButton>立即加入</PrimaryButton>}
                    </DirectLink>
                </BannerTextContainer>
                <Image src={mainImg} width={700} alt='Banner image' style={{ margin: '0 auto' }} />
            </BannerContainer>
            <FeaturesContainer>
                <MainDescriptionContainer>
                    <MainDescription>Discover personalized online tutoring</MainDescription>
                    <MainDescriptionHightline />
                </MainDescriptionContainer>
                <FeatureBoxContainer>
                    <FeatureBox>
                        <Image src={online} alt='Online' />
                        <FeatureBoxTitle>一對一視訊線上家教</FeatureBoxTitle>
                        <Hightline />
                        <FeatureBoxText>
                            視訊上課、螢幕分享、客製化教學
                            <br />
                            提高學習成效
                        </FeatureBoxText>
                    </FeatureBox>
                    <FeatureBox>
                        <Image src={board} alt='Online' style={{ marginTop: '50px' }} />
                        <FeatureBoxTitle>白板同步解題</FeatureBoxTitle>
                        <Hightline />
                        <FeatureBoxText>
                            視覺化講解，學習不抽象
                            <br />
                            難題依序擊破
                        </FeatureBoxText>
                        <FeatureBoxText></FeatureBoxText>
                    </FeatureBox>
                    <FeatureBox>
                        <Image src={ai} width={100} alt='Online' />
                        <FeatureBoxTitle>互動式 AI 助教</FeatureBoxTitle>
                        <Hightline />
                        <FeatureBoxText>
                            AI 即時回覆，高效學習
                            <br />
                            開啟學習新世紀
                        </FeatureBoxText>
                    </FeatureBox>
                    <FeatureBg />
                </FeatureBoxContainer>
            </FeaturesContainer>
            <TeachersInfoContainer>
                <MainDescriptionContainer>
                    <MainDescription>Discover personalized online tutoring</MainDescription>
                    <MainDescriptionHightline />
                </MainDescriptionContainer>

                <ScrollButtonContainer>
                    <ScrollButtonLeft onClick={handleScrollLeft}>&lt;</ScrollButtonLeft>
                    <TeachersContainer ref={containerRef}>
                        {teachers &&
                            teachers.map((teacher, index) => (
                                <TeacherCardWrapper key={index}>
                                    <TeacherCard>
                                        {teacher.avatar && (
                                            <TeacherImg
                                                src={teacher.avatar}
                                                alt={`${teacher.name} 的大頭照`}
                                                width={148}
                                                height={148}
                                            />
                                        )}
                                        <CoursePrice>NT${teacher.price?.[0]?.price}/50分鐘</CoursePrice>
                                        <Hightline />
                                        <TeacherInfoContainer>
                                            <TeacherName>{teacher.name}</TeacherName>
                                            <Subject>{teacher.subject}家教</Subject>
                                            <RatingContainer>
                                                <RatingNumber>
                                                    {calculateAverage(teacher.evaluation).toFixed(1)}
                                                </RatingNumber>
                                                {renderStars(
                                                    parseFloat(calculateAverage(teacher.evaluation).toFixed(1))
                                                )}
                                            </RatingContainer>
                                            <TeacherDescription>{teacher.description}</TeacherDescription>
                                            <div>
                                                <DirectLink href={`/teacherpage/${teacher.uid}`} key={teacher.uid}>
                                                    <TeacherBtn>購買課程</TeacherBtn>
                                                </DirectLink>
                                            </div>
                                        </TeacherInfoContainer>
                                    </TeacherCard>
                                </TeacherCardWrapper>
                            ))}
                    </TeachersContainer>
                    <Mask />
                    <ScrollButtonRight onClick={handleScrollRight}>&gt;</ScrollButtonRight>
                </ScrollButtonContainer>
            </TeachersInfoContainer>
            <AIChat />
        </MainWrapper>
    );
}
