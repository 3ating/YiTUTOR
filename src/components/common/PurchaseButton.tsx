import TeacherCardComponents from '@/components/common/TeacherCard';
import Link from 'next/link';
import styled from 'styled-components';

const { TeacherBtn } = TeacherCardComponents;

const DirectLink = styled(Link)`
    text-decoration: none;
    color: black;
`;

const PurchaseButton = ({ href }: { href: string }) => {
    return (
        <DirectLink href={href}>
            <TeacherBtn>購買課程</TeacherBtn>
        </DirectLink>
    );
};

export default PurchaseButton;
