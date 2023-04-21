import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import PrimaryButton from '../Button';
import mainImg from './mainImg.png';
import online from './onlne.png';
import ai from './ai.png';
import board from './board.png';
import teacherImg from './teacherimg.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BannerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 44px;
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
    margin-left: auto;
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

const MainMainDescriptionContainer = styled.div`
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
`;

const CoursePrice = styled.p`
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.05em;
`;

const TeacherInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 46px;
`;

const TeacherName = styled.p`
    font-weight: 700;
    font-size: 32px;
    line-height: 42px;
    letter-spacing: 0.05em;
    margin: 0;
`;

const Subject = styled.p`
    font-weight: 400;
    font-size: 20px;
    letter-spacing: 0.05em;
    line-height: 27px;
    margin: 5px 0 0 0;
`;

const TeacherDescription = styled.p`
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.05em;
    color: #999999;
    margin-bottom: 35px;
`;

const TeacherBtn = styled(PrimaryButton)`
    width: 100%;
`;

export default function Main() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        adaptiveHeight: true,
    };
    return (
        <>
            <BannerContainer>
                <BannerTextContainer>
                    <BannerText>Easy to Learn, Easy to Achieve with YiTUTOR</BannerText>
                    <PrimaryButton>立即加入</PrimaryButton>
                </BannerTextContainer>
                <Image src={mainImg} width={700} alt='Banner image' />
            </BannerContainer>
            <FeaturesContainer>
                <MainMainDescriptionContainer>
                    <MainDescription>Discover personalized online tutoring</MainDescription>
                    <MainDescriptionHightline />
                </MainMainDescriptionContainer>
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
                <MainMainDescriptionContainer>
                    <MainDescription>Discover personalized online tutoring</MainDescription>
                    <MainDescriptionHightline />
                </MainMainDescriptionContainer>

                <TeachersContainer>
                    <TeacherCard>
                        <TeacherImg src={teacherImg} alt='Online' />
                        <CoursePrice>NT$3000/50分鐘</CoursePrice>
                        <Hightline />
                        <TeacherInfoContainer>
                            <TeacherName>Sam</TeacherName>
                            <Subject>英文家教</Subject>
                            <TeacherDescription>
                                👩🏻‍🎓澳洲碩士畢業⭐️旅居澳洲六年多⭐️雅思專家⭐️過往學生一律7分以上⭐️台灣國際學校SAT數學老師⭐️
                                IELTS 寫作、口說邏輯思考⭐️OET考試技...
                            </TeacherDescription>
                            <TeacherBtn>購買課程</TeacherBtn>
                        </TeacherInfoContainer>
                    </TeacherCard>

                    <TeacherCard>
                        <TeacherImg src={teacherImg} alt='Online' />
                        <CoursePrice>NT$3000/50分鐘</CoursePrice>
                        <Hightline />
                        <TeacherInfoContainer>
                            <TeacherName>Sam</TeacherName>
                            <Subject>英文家教</Subject>
                            <TeacherDescription>
                                👩🏻‍🎓澳洲碩士畢業⭐️旅居澳洲六年多⭐️雅思專家⭐️過往學生一律7分以上⭐️台灣國際學校SAT數學老師⭐️
                                IELTS 寫作、口說邏輯思考⭐️OET考試技...
                            </TeacherDescription>
                            <TeacherBtn>購買課程</TeacherBtn>
                        </TeacherInfoContainer>
                    </TeacherCard>

                    <TeacherCard>
                        <TeacherImg src={teacherImg} alt='Online' />
                        <CoursePrice>NT$3000/50分鐘</CoursePrice>
                        <Hightline />
                        <TeacherInfoContainer>
                            <TeacherName>Sam</TeacherName>
                            <Subject>英文家教</Subject>
                            <TeacherDescription>
                                👩🏻‍🎓澳洲碩士畢業⭐️旅居澳洲六年多⭐️雅思專家⭐️過往學生一律7分以上⭐️台灣國際學校SAT數學老師⭐️
                                IELTS 寫作、口說邏輯思考⭐️OET考試技...
                            </TeacherDescription>
                            <TeacherBtn>購買課程</TeacherBtn>
                        </TeacherInfoContainer>
                    </TeacherCard>

                    {/* <TeacherCard>
                        <TeacherImg src={teacherImg} alt='Online' />
                        <CoursePrice>NT$3000/50分鐘</CoursePrice>
                        <Hightline />
                        <TeacherInfoContainer>
                            <TeacherName>Sam</TeacherName>
                            <Subject>英文家教</Subject>
                            <TeacherDescription>
                                👩🏻‍🎓澳洲碩士畢業⭐️旅居澳洲六年多⭐️雅思專家⭐️過往學生一律7分以上⭐️台灣國際學校SAT數學老師⭐️
                                IELTS 寫作、口說邏輯思考⭐️OET考試技...
                            </TeacherDescription>
                            <TeacherBtn>購買課程</TeacherBtn>
                        </TeacherInfoContainer>
                    </TeacherCard>

                    <TeacherCard>
                        <TeacherImg src={teacherImg} alt='Online' />
                        <CoursePrice>NT$3000/50分鐘</CoursePrice>
                        <Hightline />
                        <TeacherInfoContainer>
                            <TeacherName>Sam</TeacherName>
                            <Subject>英文家教</Subject>
                            <TeacherDescription>
                                👩🏻‍🎓澳洲碩士畢業⭐️旅居澳洲六年多⭐️雅思專家⭐️過往學生一律7分以上⭐️台灣國際學校SAT數學老師⭐️
                                IELTS 寫作、口說邏輯思考⭐️OET考試技...
                            </TeacherDescription>
                            <TeacherBtn>購買課程</TeacherBtn>
                        </TeacherInfoContainer>
                    </TeacherCard> */}
                </TeachersContainer>
            </TeachersInfoContainer>
        </>
    );
}
