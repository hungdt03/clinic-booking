import { FC } from "react";
import Logo from "../shared/Logo";
import Navbar from "../shared/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";

const Header: FC = () => {
    
    return <header className="flex justify-between py-2 px-6 h-[60px] shadow sticky left-0 right-0 z-50 top-0 bg-white">
        <div className="flex gap-x-2 items-center">
            <button className="md:hidden">
                <FontAwesomeIcon className="text-lg" icon={faBars} />
            </button>
            <Logo />
        </div>
        <Navbar />
    </header>
    
};

export default Header;
