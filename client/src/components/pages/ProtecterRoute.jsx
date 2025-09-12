import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div style={{fontSize: '2rem', animation: 'waddle 1s infinite'}}>
            <img src="./logos/duckyai-s.png" alt="Logo Icon" className="sm:h-28 sm:w-28 h-42 w-42 rounded-full"/>
        </div>
        <style>
        {`
            @keyframes waddle{
                0% { transform: rotate(-10deg); }
                50% { transform: rotate(10deg); }
                100% { transform: rotate(-10deg); }
            }
        `}
        </style>
        </div>;

    return isSignedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;