import { FC } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { Navigate } from "react-router-dom";
import Loading from "../../components/shared/Loading";

type ChangePasswordAccessProps = {
    element: React.ReactNode
}

const ChangePasswordAccess: FC<ChangePasswordAccessProps> = ({
    element
}) => {
    const { isChangePassword, isInitialized } = useSelector(selectAuth)

    if(!isInitialized) return <Loading />
    
    if(!isChangePassword) return <Navigate to='/change-password' replace />

    return element;
};

export default ChangePasswordAccess;
