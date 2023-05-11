import React from 'react';
import styled from 'styled-components';

const TimeButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(6, auto);
    gap: 10px;
    justify-content: center;
    margin-top: 5px;
`;

const TimeDayContainer = styled.div`
    margin-bottom: 10px;
`;

const WeekDay = styled.p`
    font-size: 14px;
    margin: 0;
`;

const TimeButton = styled.button<{ selected: boolean }>`
    background-color: ${(props) => (props.selected ? '#000' : '#ccc')};
    color: ${(props) => (props.selected ? 'white' : 'black')};
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    width: 100px;
    letter-spacing: 1px;
    &:hover {
        background-color: #000;
        color: white;
    }
`;

interface TeacherTimeSelectionProps {
    selectedTimes: { [day: string]: Set<number> };
    handleTimeButtonClick: (day: string, hour: number) => void;
    convertDayToChinese: (day: string) => string;
}

const TeacherTimeSelection: React.FC<TeacherTimeSelectionProps> = ({
    selectedTimes,
    handleTimeButtonClick,
    convertDayToChinese,
}) => {
    return (
        <div>
            {Object.keys(selectedTimes).map((day) => (
                <TimeDayContainer key={day}>
                    <WeekDay>{convertDayToChinese(day)}</WeekDay>
                    <TimeButtonContainer>
                        {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => (
                            <TimeButton
                                key={hour}
                                selected={selectedTimes[day].has(hour)}
                                onClick={() => handleTimeButtonClick(day, hour)}
                                type='button'
                            >
                                {hour}:00
                            </TimeButton>
                        ))}
                    </TimeButtonContainer>
                </TimeDayContainer>
            ))}
        </div>
    );
};

export default TeacherTimeSelection;
