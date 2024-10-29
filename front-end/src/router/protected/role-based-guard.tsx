import { FC } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import ManageForbidden from "../../pages/errors/ManageForbidden";

type RoleBasedGuardProps = {
    accessibleRoles: string[];
    element: React.ReactNode;
}

const RoleBasedGuard: FC<RoleBasedGuardProps> = ({
    accessibleRoles,
    element
}) => {
    const { user } = useSelector(selectAuth);

    if(!accessibleRoles.includes(user!.role)) return <ManageForbidden />;

    return element
};

export default RoleBasedGuard;
