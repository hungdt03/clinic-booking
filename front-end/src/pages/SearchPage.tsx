import React, { FC, useEffect, useState } from "react";
import { SearchOutlined } from '@ant-design/icons'
import { Divider } from "antd";
import DoctorSearchItem from "../components/seachResult/DoctorSearchItem";
import ClinicSearchItem from "../components/seachResult/ClinicSearchItem";
import { useLocation, useNavigate } from "react-router-dom";
import { ClinicResource, DoctorOwnerResource, SearchResource } from "../resources";
import searchService from "../services/search-service";
import cn from "../app/components";

export type TypeOption = 'all' | 'doctor' | 'clinic';

const validTypeOptions: TypeOption[] = ['all', 'doctor', 'clinic'];

export type SearchParams = {
    type: TypeOption;
    query: string;
    speciality: string;
}

const initialValues: SearchParams = {
    type: 'all',
    query: '',
    speciality: ''
}

const SearchPage: FC = () => {
    const location = useLocation()
    const [searchParams, setSearchParams] = useState<SearchParams>(initialValues)
    const [searchResult, setSearchResult] = useState<SearchResource[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const q = queryParams.get('q');
        const type = queryParams.get('type');
        const speciality = queryParams.get('speciality');

        const updatedSearchParams = {
            ...searchParams,
            query: q ?? '',
            speciality: speciality ?? '',
            type: validTypeOptions.includes(type as TypeOption) ? (type as TypeOption) : 'all'
        }

        setSearchParams(updatedSearchParams)
        searchData(updatedSearchParams);
    }, [location.search])

    const searchData = async (params: SearchParams) => {
        const response = await searchService.searchData(params);
        if (response.success) {
            setSearchResult(response.data);
        }
    }

    const handleSearch = async (params: SearchParams) => {
        const queryParams = new URLSearchParams({
            q: params.query,
            speciality: params.speciality,
            type: params.type
        });
        navigate(`/search?${queryParams.toString()}`);
    }

    const onTypeChange = (type: TypeOption) => {
        const updatedSearchParams = {
            ...searchParams,
            type
        }
        setSearchParams(updatedSearchParams)
        handleSearch(updatedSearchParams)
    }


    return <div className="bg-white">
        <div className="pt-8 shadow-inner border-[1px] border-gray-200 px-4 lg:px-0">
            <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-100 rounded-3xl">
                    <input value={searchParams.query} onChange={e => setSearchParams({
                        ...searchParams,
                        query: e.target.value
                    })} className="outline-none bg-slate-100 w-full" placeholder="Tìm theo triệu chứng, bác sĩ, bệnh viện" />
                    <button onClick={() => handleSearch(searchParams)} className="outline-none">
                        <SearchOutlined />
                    </button>
                </div>
                <ul className="flex items-center gap-6 text-[15px]">
                    <li onClick={() => onTypeChange('all')} className={cn('py-2 border-b-[2px] cursor-pointer', searchParams.type === 'all' ? 'border-primary text-primary' : 'border-transparent')}>Tất cả</li>
                    <li onClick={() => onTypeChange('doctor')} className={cn('py-2 border-b-[2px] cursor-pointer', searchParams.type === 'doctor' ? 'border-primary text-primary' : 'border-transparent')}>Bác sĩ</li>
                    <li onClick={() => onTypeChange('clinic')} className={cn('py-2 border-b-[2px] cursor-pointer', searchParams.type === 'clinic' ? 'border-primary text-primary' : 'border-transparent')}>Phòng khám</li>
                </ul>
            </div>
        </div>
        <div className="bg-slate-50 py-8 lg:px-0 px-4">
            <div className="w-full max-w-screen-lg mx-auto bg-white rounded-lg border-[1px] border-gray-200 pb-4">
                <span className="text-left px-4 pt-3 flex items-center text-[15px]">Tìm thấy {searchResult.length} kết quả.</span>
                <Divider className="mt-3" />

                <div className="flex flex-col">
                    {searchResult.length > 0 ? searchResult.map(item => {
                        if (item.type === 'CLINIC') {
                            const clinic = item.data as ClinicResource
                            return <React.Fragment key={clinic.id}>
                                <ClinicSearchItem clinic={clinic} />
                                <Divider />
                            </React.Fragment>
                        } else {
                            const doctor = item.data as DoctorOwnerResource
                            return <React.Fragment key={doctor.user.id}>
                                <DoctorSearchItem doctor={doctor} />
                                <Divider />
                            </React.Fragment>
                        }

                    })
                        :
                        <div className="flex flex-col items-start justify-center gap-y-2 text-gray-700">
                            <div className="flex flex-col items-start gap-y-3 px-8">
                                <svg className="mb-4 text-gray-400 w-16 h-16 lg:w-24 lg:h-24 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span className="font-semibold text-[17px]">Không tìm thấy kết quả phù hợp</span>
                                <p className="text-[15px] text-left">Bạn có thể kiểm tra và thử lại với một số gợi ý sau:</p>
                                <ul className="flex flex-col items-start text-[15px]">
                                    <li className="text-left">Kiểm tra xem từ đó có đúng chính tả không.</li>
                                    <li className="text-left">Hãy thử giảm số lượng từ trong cụm từ tìm kiếm của bạn hoặc thử tìm kiếm lại bằng cụm từ tổng quát hơn.</li>
                                    <li className="text-left">Nếu cụm từ tìm kiếm của bạn có nhiều hơn một từ, hãy kiểm tra khoảng cách.</li>
                                    <li className="text-left">Thay đổi tuỳ chọn tìm kiếm hoặc cụm từ khác phổ biến hơn.</li>
                                </ul>
                            </div>
                        </div>
                    }

                </div>
            </div>

        </div>
    </div>
};

export default SearchPage;
