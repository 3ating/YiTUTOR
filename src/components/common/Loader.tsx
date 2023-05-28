import { DotLoader } from 'react-spinners';

const Loader = () => {
    return (
        <div
            className='text-center mt-5'
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <DotLoader color='#ffab34' size={60} />
        </div>
    );
};

export default Loader;
