import React from 'react';

const DotLoadingIcon: React.FC = () => {
    return (
        <span>
            <i className='dot' />
            <i className='dot' />
            <i className='dot' />
            <style jsx>{`
                .dot {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #ccc;
                    margin-right: 4px;
                    animation: dotBounce 1.4s infinite ease-in-out;
                }
                .dot:last-child {
                    margin-right: 0;
                }
                .dot:nth-child(1) {
                    animation-delay: -0.32s;
                }
                .dot:nth-child(2) {
                    animation-delay: -0.16s;
                }
                @keyframes dotBounce {
                    0%,
                    80%,
                    100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-30%);
                    }
                }
            `}</style>
        </span>
    );
};

export default DotLoadingIcon;
