import { FC } from "react";

const PaymentMethodOption: FC = () => {
    return <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-x-4">
            <span className="w-6 h-6 bg-primary text-white rounded-full block">5</span>
            <span className="text-primary font-semibold">Loại hình thanh toán</span>
        </div>
        <div className="flex flex-col gap-y-4">
            <div className="p-4 rounded-md border-[1px] border-gray-100 text-left hover:border-primary">
                <span className="text-[17px] font-semibold">Thanh toán tại nơi khám</span>
            </div>
        </div>
    </div>
};

export default PaymentMethodOption;
