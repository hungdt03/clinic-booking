import { FC } from "react";
import { Link } from "react-router-dom";

const Logo: FC = () => {
    return <Link to='/'>
        <img width='130px' src="https://cdn.youmed.vn/wp-content/themes/youmed/images/logo.svg" />
    </Link>
}

export default Logo;
