import { FC, useState } from "react";
import SignInComponent, { SignInRequest } from "../../components/shared/SignInComponent";
import { Divider, message } from "antd";
import authService from "../../services/auth-service";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { signIn } from "../../features/slices/auth-slice";
import Loading from "../../components/shared/Loading";
import { useNavigate } from "react-router-dom";

const SignInManager: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false)
    const naviagte = useNavigate()

    const handleLogin = async (payload: SignInRequest) => {
        setLoading(true)
        const response = await authService.signInManager(payload);
        setLoading(false)
        if(response.success) {
            dispatch(signIn(response.data))
            naviagte('/admin')
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    return <div className="bg-white py-8 px-6 rounded-lg shadow">
        <p className="mb-6 text-2xl font-bold">ĐĂNG NHẬP DÀNH CHO PHÒNG KHÁM</p>
        <SignInComponent 
            onSubmit={(values) => handleLogin(values)}
        />
        <Divider />
        {loading && <Loading />}
    </div>
};

export default SignInManager;
