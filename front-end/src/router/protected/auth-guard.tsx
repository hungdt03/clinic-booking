import { FC } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { Navigate } from "react-router-dom";
import Loading from "../../components/shared/Loading";

type AuthGuardProps = {
    element: React.ReactNode
}

const AuthGuard: FC<AuthGuardProps> = ({
    element
}) => {
    const { isAuthenticated, isInitialized } = useSelector(selectAuth)

    if(!isInitialized) return <Loading />
    
    if(!isAuthenticated) return <Navigate to='/auth/sign-in-patient' replace />

    return element;
};

export default AuthGuard;
