import { FC, useState } from "react";
import SignInComponent, { SignInRequest } from "../../components/shared/SignInComponent";
import { Divider, message } from "antd";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth-service";
import { signIn } from "../../features/slices/auth-slice";
import Loading from "../../components/shared/Loading";

const SignInDoctor: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false)
    const naviagte = useNavigate()

    const handleLogin = async (payload: SignInRequest) => {
        setLoading(true)
        const response = await authService.signInDoctor(payload);
        setLoading(false)
        if (response.success) {
            dispatch(signIn(response.data))
            
            if(response.data.user?.role === 'DOCTOR_EMPLOYEE') {
                naviagte('/d-employee')
            } else {
                naviagte('/d-owner')
            }

            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    return <div className="bg-white py-8 px-6 rounded-lg shadow">
        <p className="mb-6 text-2xl font-bold">ĐĂNG NHẬP DÀNH CHO BÁC SĨ</p>
        <SignInComponent
            onSubmit={(values) => handleLogin(values)}
        />
        <Divider />
        {loading && <Loading />}
    </div>
};

export default SignInDoctor;
