import { FC, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

type RoleAcceptProps = {
    children: ReactNode;
    roles: string[]
}

const RoleAccept: FC<RoleAcceptProps> = ({
    children,
    roles
}) => {
    const { user, isAuthenticated, isInitialized } = useSelector(selectAuth);
    const navigate = useNavigate()
    
    if(!isInitialized) return <Loading />
    
    if(!isAuthenticated) {
        navigate('/sign-in-patient')
    }
    return roles.includes(user!.role) ? children : <></>;
};

export default RoleAccept;
