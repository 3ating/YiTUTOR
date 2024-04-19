import { MoonLoader } from 'react-spinners';

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
            <MoonLoader color='#ffab34' size={50} />
        </div>
    );
};

export default Loader;
