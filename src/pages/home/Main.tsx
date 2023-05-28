import { useTeachers } from '@/context/TeacherContext';
import 'firebase/compat/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import styled from 'styled-components';
import ChatBtn from '../../components/chat/ChatBtn';
import PrimaryButton from '../../components/common/Button';
import TeacherInfoCard from '../../components/common/TeacherInfoCard';
import { useAuth } from '../../context/AuthContext';
import board from './images//board.png';
import ai from './images/ai.png';
import mainImg from './images/mainImg.png';
import online from './images/onlne.png';

const MainWrapper = styled.div`
    margin: 65px 0;
`;

const BannerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
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

const MainDescriptionHighline = styled.div`
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

const Highline = styled.div`
    height: 4px;
    width: 57px;
    background: #ffd335;
`;

const TeachersInfoContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: relative;
`;

const TeachersContainer = styled.div`
    display: flex;
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

const PADDING = 10;
const CARD_WIDTH = 400;
const TOTALCARD_WIDTH = CARD_WIDTH + 2 * PADDING;

export default function Main() {
    const { isLoading } = useAuth();
    const { teachers } = useTeachers();
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollTo = (direction: string) => {
        if (containerRef.current) {
            const container = containerRef.current;
            const currentScroll = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const nextScroll =
                direction === 'right' ? currentScroll + TOTALCARD_WIDTH : currentScroll - TOTALCARD_WIDTH;
            container.scrollLeft = Math.min(maxScroll, Math.max(nextScroll, 0));
        }
    };

    const handleScrollLeft = () => {
        scrollTo('left');
    };

    const handleScrollRight = () => {
        scrollTo('right');
    };

    return (
        <MainWrapper>
            <BannerContainer>
                <BannerTextContainer>
                    <BannerText>
                        Easy to Learn
                        <br /> Easy to Achieve <br />
                        with YiTUTOR
                    </BannerText>
                    <DirectLink href={'/auth/signup'}>
                        {!isLoading && <PrimaryButton>立即加入</PrimaryButton>}
                    </DirectLink>
                </BannerTextContainer>
                <Image src={mainImg} width={700} alt='Banner image' style={{ margin: '0 auto' }} />
            </BannerContainer>
            <FeaturesContainer>
                <MainDescriptionContainer>
                    <MainDescription>Discover personalized online tutoring</MainDescription>
                    <MainDescriptionHighline />
                </MainDescriptionContainer>
                <FeatureBoxContainer>
                    <FeatureBox>
                        <Image src={online} alt='Online' />
                        <FeatureBoxTitle>一對一視訊線上家教</FeatureBoxTitle>
                        <Highline />
                        <FeatureBoxText>
                            視訊上課、螢幕分享、客製化教學
                            <br />
                            提高學習成效
                        </FeatureBoxText>
                    </FeatureBox>
                    <FeatureBox>
                        <Image src={board} alt='Online' style={{ marginTop: '50px' }} />
                        <FeatureBoxTitle>白板同步解題</FeatureBoxTitle>
                        <Highline />
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
                        <Highline />
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
                    <MainDescription>Find your own Tutor</MainDescription>
                    <MainDescriptionHighline />
                </MainDescriptionContainer>
                <ScrollButtonContainer>
                    <ScrollButtonLeft onClick={handleScrollLeft}>&lt;</ScrollButtonLeft>
                    <TeachersContainer ref={containerRef}>
                        {teachers.map((teacher, index) => (
                            <TeacherInfoCard key={index} teacher={teacher} href={`../../teachers/${teacher.uid}`} />
                        ))}
                    </TeachersContainer>
                    <Mask />
                    <ScrollButtonRight onClick={handleScrollRight}>&gt;</ScrollButtonRight>
                </ScrollButtonContainer>
            </TeachersInfoContainer>
            <ChatBtn />
        </MainWrapper>
    );
}
