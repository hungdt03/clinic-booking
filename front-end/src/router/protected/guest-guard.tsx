import { FC } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { Navigate } from "react-router-dom";
import Loading from "../../components/shared/Loading";

type GuestGuardProps = {
    element: React.ReactNode
}

const GuestGuard: FC<GuestGuardProps> = ({
    element
}) => {
    const { isAuthenticated, isInitialized } = useSelector(selectAuth)

    if(!isInitialized) return <Loading />
    
    if(isAuthenticated) return <Navigate to='/' replace />

    return element;
};

export default GuestGuard;
