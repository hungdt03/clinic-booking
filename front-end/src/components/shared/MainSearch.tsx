import { FC } from "react";
import images from "../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";

type MainSearchProps = {
    value?: string;
    onChange?: (value: string) => void,
    onSubmit?: () => void
}

const MainSearch: FC<MainSearchProps> = ({
    value = '',
    onChange,
    onSubmit
}) => {

    return <div style={{
        height: '520px',
    }}
        className="relative flex justify-center items-center p-8 lg:p-20 xl:p-28 text-white bg-primary"
    >
        <div className="absolute top-0 right-0 bottom-0 bg-opacity-25 bg-primary">
            <img alt="Ảnh minh họa tìm kiếm" width={676} height={520} src={images.mainSearch} />
        </div>
        <div className="flex flex-col items-center justify-center gap-y-4 z-10 max-w-[896px]">
            <p className="md:text-3xl xl:text5xl font-bold text-xl">Ứng dụng đặt khám</p>
            <p className="md:text-xl text-sm text-center">Đặt khám với hơn 600 bác sĩ, 25 bệnh viện, 100 phòng khám trên YouMed
                để có số thứ tự và khung giờ khám trước.</p>
            <div className="bg-white rounded-[9999px] overflow-hidden flex items-center w-full text-black px-3">
                <input value={value} onChange={e => onChange?.(e.target.value)} placeholder="Triệu chứng, bác sĩ, phòng khám ..." className="outline-none border-none bg-white px-3 py-3 w-full" />
                <button disabled={value.length === 0} onClick={onSubmit} className="px-3 py-3">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
        </div>
    </div>

};

export default MainSearch;
