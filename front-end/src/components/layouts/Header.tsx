import { FC, useState } from "react";
import Logo from "../shared/Logo";
import Navbar from "../shared/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { Drawer, Tree } from "antd";
import { Link } from "react-router-dom";

const Header: FC = () => {

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return <header className="flex justify-between py-2 px-6 h-[60px] shadow sticky left-0 right-0 z-50 top-0 bg-white">
        <div className="flex gap-x-4 items-center">
            <button onClick={showDrawer} className="md:hidden">
                <FontAwesomeIcon className="text-lg text-primary" icon={faBars} />
            </button>
            <Drawer width='100%' onClose={onClose} open={open}>
                <div className="flex flex-col items-start gap-y-1 w-full">
                    <Link className="px-3 py-3 font-semibold text-[16px] rounded-md hover:bg-sky-50 hover:text-primary w-full" to='/booking/clinic'>Đặt khám phòng khám</Link>
                    <Link className="px-3 py-3 font-semibold text-[16px] rounded-md hover:bg-sky-50 hover:text-primary w-full" to='/booking/clinic'>Đặt khám bác sĩ</Link>
                    <Link className="px-3 py-3 font-semibold text-[16px] rounded-md hover:bg-sky-50 hover:text-primary w-full" to='/notification'>Thông báo</Link>
                    <Link className="px-3 py-3 font-semibold text-[16px] rounded-md hover:bg-sky-50 hover:text-primary w-full" to='/contact'>Liên hệ</Link>
                </div>
            </Drawer>
            <Logo />
        </div>
        <Navbar />
    </header>

};

export default Header;
