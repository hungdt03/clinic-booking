import { ButtonHTMLAttributes, FC } from "react";
import cn from "../../app/components";


interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    
}

const MyButton: FC<MyButtonProps> = (props) => {
    return <button {...props} className={cn('px-4 py-2 rounded-md border-[1px] text-primary border-primary hover:bg-primary hover:text-white transition-all duration-150 ease-linear', props.className)}>{props.children}</button>
};

export default MyButton;