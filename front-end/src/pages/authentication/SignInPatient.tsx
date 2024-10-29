import { FC, useState } from "react";
import SignInComponent, { SignInRequest } from "../../components/shared/SignInComponent";
import { Divider, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import authService from "../../services/auth-service";
import { signIn } from "../../features/slices/auth-slice";

const SignInPatient: FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false)
    const naviagte = useNavigate()

    const handleLogin = async (payload: SignInRequest) => {
        setLoading(true)
        const response = await authService.signInPatient(payload);
        setLoading(false)
        if(response.success) {
            dispatch(signIn(response.data))
            naviagte('/')
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    return <div className="bg-white py-8 px-6 rounded-lg shadow">
        <p className="mb-6 text-2xl font-bold">ĐĂNG NHẬP ỨNG DỤNG</p>
        <SignInComponent 
            onSubmit={handleLogin}
        />
        <Divider />
        <div className="flex gap-x-2 text-[15px] justify-center">
            <p>Chưa có tài khoản</p>
            <Link className="text-primary" to='/auth/sign-up'>Đăng kí ngay</Link>
        </div>
    </div>
};

export default SignInPatient;
