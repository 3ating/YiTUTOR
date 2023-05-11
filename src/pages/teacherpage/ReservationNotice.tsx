// import React from 'react';
// import styled from 'styled-components';
// import { VscDebugBreakpointFunction } from 'react-icons/vsc';

// const CalendarHintContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     width: fit-content;
//     width: 100%;
// `;

// const CalendarHintTitle = styled.p`
//     font-size: 30px;
//     letter-spacing: 2px;
//     margin: 30px 0 0 0;
// `;

// const CalendarHintContentContainer = styled.div`
//     display: flex;
//     align-items: center;
//     margin-top: 10px;
// `;

// const CalendarHintContent = styled.p`
//     font-size: 22px;
//     margin: 0;
//     margin-left: 5px;
//     color: gray;
//     letter-spacing: 1px;
// `;
// export default function ReservationNotice() {
//     return (
//         <CalendarHintContainer>
//             <CalendarHintTitle>購買課程須知</CalendarHintTitle>
//             <CalendarHintContentContainer>
//                 <VscDebugBreakpointFunction />
//                 <CalendarHintContent>先選擇日曆中預上課的日期，右側會出現近三天老師能上課的時段</CalendarHintContent>
//             </CalendarHintContentContainer>
//             <CalendarHintContentContainer>
//                 <VscDebugBreakpointFunction />
//                 <CalendarHintContent>若無出現時間， 表示近幾日無可預約時段，請重新選擇日期</CalendarHintContent>
//             </CalendarHintContentContainer>
//             <CalendarHintContentContainer>
//                 <VscDebugBreakpointFunction />
//                 <CalendarHintContent>選定日期與時間後按下確認，課程排定成功 🎉</CalendarHintContent>
//             </CalendarHintContentContainer>
//             <CalendarHintTitle>YiTUTOR 線上課程須知</CalendarHintTitle>
//             <CalendarHintContentContainer>
//                 <VscDebugBreakpointFunction />
//                 <CalendarHintContent>排定課程前請先確認有剩餘堂數。若無剩餘堂數，請先購買</CalendarHintContent>
//             </CalendarHintContentContainer>
//             <CalendarHintContentContainer>
//                 <VscDebugBreakpointFunction />
//                 <CalendarHintContent>一次購買 5 堂或 10 堂通常有額外折扣（以老師訂定之價錢為主）</CalendarHintContent>
//             </CalendarHintContentContainer>
//             <CalendarHintContentContainer>
//                 <VscDebugBreakpointFunction />
//                 <CalendarHintContent>使用 YiTUTOR 線上上課不需額外下載通訊軟體</CalendarHintContent>
//             </CalendarHintContentContainer>
//             <CalendarHintContentContainer>
//                 <VscDebugBreakpointFunction />
//                 <CalendarHintContent>課程時間為 50 分鐘，時間從老師與學生皆進線上教室後開始計算</CalendarHintContent>
//             </CalendarHintContentContainer>
//         </CalendarHintContainer>
//     );
// }
import React from 'react';
import styled from 'styled-components';
import { VscDebugBreakpointFunction } from 'react-icons/vsc';

const CalendarHintContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: fit-content;
    width: 100%;
`;

const CalendarHintTitle = styled.p`
    font-size: 30px;
    letter-spacing: 2px;
    margin: 30px 0 0 0;
`;

const CalendarHintContentContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const CalendarHintContent = styled.p`
    font-size: 22px;
    margin: 0;
    margin-left: 5px;
    color: gray;
    letter-spacing: 1px;
`;

const hints = [
    {
        title: '購買課程須知',
        items: [
            '先選擇日曆中預上課的日期，右側會出現近三天老師能上課的時段',
            '若無出現時間，表示近幾日無可預約時段，請重新選擇日期',
            '選定日期與時間後按下確認，課程排定成功 🎉',
        ],
    },
    {
        title: 'YiTUTOR 線上課程須知',
        items: [
            '排定課程前請先確認有剩餘堂數。若無剩餘堂數，請先購買',
            '一次購買 5 堂或 10 堂通常有額外折扣（以老師訂定之價錢為主）',
            '使用 YiTUTOR 線上上課不需額外下載通訊軟體',
            '課程時間為 50 分鐘，時間從老師與學生皆進線上教室後開始計算',
        ],
    },
];

export default function ReservationNotice() {
    return (
        <CalendarHintContainer>
            {hints.map((hint, index) => (
                <React.Fragment key={index}>
                    <CalendarHintTitle>{hint.title}</CalendarHintTitle>
                    {hint.items.map((item, subIndex) => (
                        <CalendarHintContentContainer key={subIndex}>
                            <VscDebugBreakpointFunction />
                            <CalendarHintContent>{item}</CalendarHintContent>
                        </CalendarHintContentContainer>
                    ))}
                </React.Fragment>
            ))}
        </CalendarHintContainer>
    );
}
