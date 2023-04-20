import React from 'react';
import styled from 'styled-components';

const ScheduleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 2rem;
`;

const DayRow = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
`;

const DayLabel = styled.div`
    width: 40px;
    text-align: center;
    font-weight: bold;
`;

const TimeSlot = styled.div<{ selected: boolean }>`
    width: 100px;
    height: 35px;
    border: 2px solid #3f51b5;
    border-radius: 4px;
    background-color: ${(props) => (props.selected ? 'white' : '#3f51b5')};
    color: ${(props) => (props.selected ? '#3f51b5' : 'white')};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${(props) => (props.selected ? 'pointer' : 'not-allowed')};
    transition: all 0.2s ease-in-out;

    ${(props) =>
        props.selected &&
        `
        &:hover {
            background-color: white;
            color: #3f51b5;
            transform: scale(1.1);
        }
    `}
`;

interface UserInfo {
    name: string;
    email: string;
    phone?: string;
    userType?: string;
    courses?: object;
    avatar?: string;
    description?: string;
    intro?: string;
    selectedTimes?: {
        day: string;
        hours: number[];
    }[];
}

interface ScheduleProps {
    selectedTimes: { day: string; hours: number[] }[];
    userInfo?: UserInfo;
    selectedDate: Date;
    onTimeSlotClick: () => void;
    setSelectedTime: (time: string) => void;
    selectedTime: string;
}

const Schedule: React.FC<ScheduleProps> = ({
    selectedTimes,
    selectedDate = new Date(),
    onTimeSlotClick,
    setSelectedTime,
    selectedTime,
}) => {
    const currentWeekday = selectedDate.getDay();
    const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const renderTimeSlots = (hours: number[], day: string) => {
        const timeSlots = [];
        for (let i = 9; i <= 21; i++) {
            const isSelected = hours.includes(i);
            if (isSelected) {
                timeSlots.push(
                    <TimeSlot key={`${day}-${i}`} selected={isSelected} onClick={() => handleTimeSlotClick(`${i}:00`)}>
                        {i}:00
                    </TimeSlot>
                );
            }
        }
        return timeSlots;
    };

    const renderWeekdays = () => {
        const weekdays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(selectedDate);
            day.setDate(selectedDate.getDate() + i);
            weekdays.push(day.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }));
        }
        return weekdays;
    };

    const getSelectedTimesForDay = (dayIndex: number) => {
        if (!selectedTimes) {
            return []; // 或其他默认值
        }

        const dayName = dayMapping[dayIndex];
        const dayData = selectedTimes.find((item) => item.day === dayName);
        return dayData ? dayData.hours : [];
    };

    const weekdays = renderWeekdays();

    const handleTimeSlotClick = (time: string) => {
        onTimeSlotClick();
        setSelectedTime(time);
    };

    return (
        <ScheduleContainer>
            {weekdays.map((dateLabel, index) => {
                const dayIndex = (currentWeekday + index) % 7;
                const hours = getSelectedTimesForDay(dayIndex);

                if (hours.length > 0) {
                    return (
                        <DayRow key={index}>
                            <DayLabel>{dateLabel}</DayLabel>
                            {renderTimeSlots(hours, dayMapping[dayIndex])}
                        </DayRow>
                    );
                } else {
                    return null;
                }
            })}
        </ScheduleContainer>
    );
};

export default Schedule;
