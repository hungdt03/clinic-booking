import { AxiosError } from "axios";
import { FC, useEffect } from "react";
import { Link, useLocation, useNavigate, useRouteError } from "react-router-dom";

const ErrorBoundary: FC = () => {
    const error = useRouteError() as AxiosError
    const location = useLocation()
    const navigate = useNavigate()

    const retry = error.response?.config._retry

    useEffect(() => {
        console.log('retry')
        console.log(retry)
    }, [])

    const handleSignin = () => {
        navigate("/auth/sign-in-patient")
    }

    return (
        <div className="p-6 mx-auto w-[460px] text-center translate-y-2/4">
            <div className="flex flex-col gap-y-6">
                <h1 className="m-0 font-bold text-gray-500 text-9xl bg-clip-text bg-gradient-to-r from-main-lower to-main-upper">
                    Oops!
                </h1>
                <p className="font-sans text-lg font-bold opacity-80">
                    {retry ? 'SESSION HAS EXPIRED!' : 'SOMETHING WENT WRONG!'}
                </p>
                <div>
                    {retry ? (
                        <button
                            onClick={handleSignin}
                            className="px-4 py-2 text-sm font-bold bg-green-600 text-white rounded-full bg-main"
                        >
                            SIGNIN AGAIN
                        </button>
                    ) : (
                        <Link
                            to={location.pathname}
                            className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-full bg-main"
                        >
                            RELOAD PAGE
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
};

export default ErrorBoundary;
