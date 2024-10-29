import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tokenService from "../../services/token-service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { signIn } from "../../features/slices/auth-slice";
import { Button } from "antd";

const UserLogin: FC = () => {
    const [error, setError] = useState("")

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleAuthenticateTokenLogin = async (email: string, activationToken: string) => {
        const response = await tokenService.authenticateTokenLogin(email, activationToken);
        if (response.success) {
            console.log(response)
            dispatch(signIn(response.data));
            navigate('/admin')
        } else {
            setError(response.message)
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get("email");
        const activationTokenParam = params.get("activationToken");

        if (emailParam && activationTokenParam) {
            handleAuthenticateTokenLogin(emailParam, activationTokenParam);
        } else {
            navigate("/not-found");
        }
    }, [navigate]);
    
    return <div className="flex items-center justify-center py-8 h-screen">
        <div className="flex flex-col gap-y-3">
            {error && <p className="p-4 rounded-md bg-red-50 border-[1px] border-red-600 text-[15px] text-red-600">{error}</p>}
            <Button type="primary">
                <Link to='/'>Quay về trang chủ</Link>
            </Button>
        </div>
    </div>
};

export default UserLogin;
