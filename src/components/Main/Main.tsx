import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import PrimaryButton from '../Button';
import mainImg from './mainImg.png';
import online from './onlne.png';
import ai from './ai.png';
import board from './board.png';
// import teacherImg from './teacherimg.png';
import AIChat from '../AIChatBtn';
import Link from 'next/link';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import TeacherCardComponents from '../TeacherCard';

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
    justify-content: center;
    gap: 26px;
    margin-bottom: 143px;
    overflow-x: hidden;
    position: relative;
    width: 100%;
    transition: transform 0.5s ease;
    flex-wrap: nowrap;
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
`;

const ScrollButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
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

const firebaseConfig = {
    apiKey: process.env.FIRESTORE_API_KEY,
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

export default function Main() {
    const [scrollIndex, setScrollIndex] = useState(0);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScrollLeft = () => {
        const container = containerRef.current;
        if (container) {
            const cardWidth = container.clientWidth / 3;
            const cardsToMove = 3;
            const totalScroll = cardWidth * cardsToMove;
            if (container.scrollLeft === 0) {
                container.scrollLeft = cardWidth * (teachers.length - cardsToMove);
            } else {
                container.scrollLeft -= totalScroll;
            }
        }
    };

    const handleScrollRight = () => {
        const container = containerRef.current;
        if (container) {
            const cardWidth = container.clientWidth / 3;
            const cardsToMove = 3;
            const totalScroll = cardWidth * cardsToMove;
            if (container.scrollLeft === cardWidth * (teachers.length - cardsToMove)) {
                container.scrollLeft = 0;
            } else {
                container.scrollLeft += totalScroll;
            }
        }
    };

    const renderTeacherCards = (cards: string | any[], index: number, cardsToShow = 3) => {
        const start = index * cardsToShow;
        const end = start + cardsToShow;
        return cards.slice(start, end);
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

    console.log('teachers', teachers.length);

    return (
        <>
            <BannerContainer>
                <BannerTextContainer>
                    <BannerText>Easy to Learn, Easy to Achieve with YiTUTOR</BannerText>
                    <DirectLink href={'/membership/SignUp'}>
                        <PrimaryButton>立即加入</PrimaryButton>
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
                    <ScrollButton onClick={handleScrollLeft}>&lt;</ScrollButton>
                    <TeachersContainer
                        ref={containerRef}
                        style={{
                            transform: `translateX(-${scrollIndex * 100}%)`,
                        }}
                    >
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
                                                <DirectLink href={`/teacher/${teacher.uid}`} key={teacher.uid}>
                                                    <TeacherBtn>購買課程</TeacherBtn>
                                                </DirectLink>
                                            </div>
                                        </TeacherInfoContainer>
                                    </TeacherCard>
                                </TeacherCardWrapper>
                            ))}
                        <Mask />
                    </TeachersContainer>
                    <ScrollButton onClick={handleScrollRight}>&gt;</ScrollButton>
                </ScrollButtonContainer>
            </TeachersInfoContainer>
            <AIChat />
        </>
    );
}
