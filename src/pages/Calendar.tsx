import React, { useState } from 'react';
import styled from 'styled-components';
import Schedule from './Schedule';

const CalendarContainer = styled.div`
    font-family: Arial, sans-serif;
    width: 350px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    /* margin: 0 auto; */
`;

const CalendarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background-color: #eee;
    border-radius: 8px 8px 0 0;
`;

const CalendarButton = styled.button`
    background-color: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 16px;
`;

const CalendarMonth = styled.div`
    font-size: 18px;
    font-weight: bold;
`;

const CalendarWeekdays = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: #eee;
    padding: 8px;
    border-bottom: 1px solid #ccc;
`;

const CalendarDay = styled.div<{ isToday?: boolean; isSelected?: boolean }>`
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    background-color: ${({ isToday, isSelected }) => (isSelected ? '#000' : isToday ? '#ccc' : 'transparent')};
    color: ${({ isSelected }) => (isSelected ? '#fff' : 'inherit')};
`;

const CalendarDayHeader = styled(CalendarDay)`
    font-size: 14px;
    font-weight: bold;
    color: #666;
`;

const CalendarDayEmpty = styled(CalendarDay)`
    background-color: #f5f5f5;
    cursor: default;
`;

const CalendarDaysGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    padding: 8px;
    background-color: #fff;
    border-radius: 0 0 8px 8px;
`;
interface CalendarProps {
    handleSelectDate: (date: Date) => void;
    setSelectedTime: (selectedTime: { dayLabel: string; time: string } | null) => void;
    setShowBookButtons: (show: boolean) => void;
}

export default function Calendar({ handleSelectDate, setShowBookButtons, setSelectedTime }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const prevMonth = () => {
        setSelectedDate((prevDate) => {
            const prevMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
            return prevMonth;
        });
    };

    const nextMonth = () => {
        setSelectedDate((prevDate) => {
            const nextMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
            return nextMonth;
        });
    };
    return (
        <CalendarContainer>
            <CalendarHeader>
                <CalendarButton onClick={prevMonth}>&lt;</CalendarButton>
                <CalendarMonth>
                    {selectedDate.toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </CalendarMonth>
                <CalendarButton onClick={nextMonth}>&gt;</CalendarButton>
            </CalendarHeader>
            <CalendarWeekdays>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((weekday) => (
                    <CalendarDayHeader key={weekday}>{weekday}</CalendarDayHeader>
                ))}
            </CalendarWeekdays>
            <CalendarDaysGrid>
                {(() => {
                    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

                    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
                    const startWeekday = startOfMonth.getDay();
                    const daysInMonth = endOfMonth.getDate();
                    const days = [];

                    for (let i = 1; i <= startWeekday; i++) {
                        days.push(<CalendarDayEmpty key={`empty-${i}`} />);
                    }

                    for (let i = 1; i <= daysInMonth; i++) {
                        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const handleClickDate = () => {
                            handleSelectDate(date);
                            setSelectedDate(date);
                            setShowBookButtons(false);
                            setSelectedTime(null);
                        };
                        days.push(
                            <CalendarDay
                                key={`day-${i}`}
                                isToday={isToday}
                                isSelected={isSelected}
                                onClick={handleClickDate}
                            >
                                {i}
                            </CalendarDay>
                        );
                    }

                    return days;
                })()}
            </CalendarDaysGrid>
        </CalendarContainer>
    );
}
