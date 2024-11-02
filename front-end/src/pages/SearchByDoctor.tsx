import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Radio, RadioChangeEvent } from "antd";
import { SearchOutlined } from '@ant-design/icons'
import React, { FC, useEffect, useState } from "react";
import DoctorSearchItem from "../components/seachResult/DoctorSearchItem";
import { DoctorOwnerResource, SpecialityResource } from "../resources";
import doctorService from "../services/doctor-service";
import { useLocation, useNavigate } from "react-router-dom";
import specialityService from "../services/speciality-service";


export type SearchDoctorParams = {
    q: string;
    speciality: string;
}

const initialValues: SearchDoctorParams = {
    q: '',
    speciality: ''
}


const SearchByDoctor: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<SearchDoctorParams>(initialValues);
    const [searchResult, setSearchResult] = useState<DoctorOwnerResource[]>([])
    const [medicalSpecialities, setMedicalSpecialities] = useState<SpecialityResource[]>([])

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const q = queryParams.get('q');
        const speciality = queryParams.get('speciality');

        const updatedParams = {
            ...searchTerm,
            q: q ?? '',
            speciality: speciality ?? ''
        }

        setSearchTerm(updatedParams);
        searchDoctors(updatedParams);
    }, [location.search]);

    useEffect(() => {
        const fetchSpecialities = async () => {
            const response = await specialityService.getAllSpecialities();
            if (response.success) {
                setMedicalSpecialities(response.data)
            }
        }

        fetchSpecialities();
    }, [])

    const searchDoctors = async (params: SearchDoctorParams) => {
        const response = await doctorService.searchDoctorOwners(params);
        if (response.success) {
            setSearchResult(response.data);
        }
    }

    const handleSearch = async (params: SearchDoctorParams) => {
        const queryParams = new URLSearchParams(params as any);
        navigate(`/booking/doctor/search?${queryParams.toString()}`);
    }


    const onChange = (e: RadioChangeEvent) => {
        const updatedParams : SearchDoctorParams = {
            ...searchTerm,
            speciality: e.target.value
        }
        setSearchTerm(updatedParams);
        handleSearch(updatedParams)
    };

    return <div>
        <div
            className="relative flex justify-center items-center p-8 text-white bg-primary"
        >
            <div className="flex flex-col items-center justify-center gap-y-4 z-10 w-full max-w-screen-md mx-auto">
                <div className="bg-white rounded-[9999px] overflow-hidden flex items-center w-full text-black px-3">
                    <input value={searchTerm.q} onChange={e => setSearchTerm({
                        ...searchTerm,
                        q: e.target.value
                    })} placeholder="Triệu chứng, bác sĩ, phòng khám ..." className="outline-none border-none bg-white px-3 py-3 w-full" />
                    <button onClick={() => handleSearch(searchTerm)} className="px-3 py-3">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </div>
        </div>

        <div className="w-[1200px] mx-auto grid grid-cols-12">
            <div className="col-span-3 pr-4 border-r-[1px] border-gray-200 py-4 flex flex-col items-start gap-y-5">
                <span className="font-medium">Chuyên khoa</span>
                <div className="flex flex-col gap-y-3">
                    <div className="flex items-center px-3 py-2 rounded-md border-[1px] border-gray-300">
                        <SearchOutlined />
                        <input placeholder="Tìm nhanh chuyên khoa" className="outline-none bg-transparent w-full" />
                    </div>
                    <Radio.Group className="text-left h-[500px] overflow-y-auto custom-scrollbar scrollbar-w-2" onChange={onChange} value={searchTerm.speciality}>
                        <div className="flex flex-col items-start gap-y-3">
                            {medicalSpecialities.map((speciality) => <Radio key={speciality.id} value={speciality.name}>{speciality.name}</Radio>)}
                        </div>
                    </Radio.Group>
                </div>
            </div>
            <div className="col-span-9">
                <span className="block py-6 pl-6 text-left text-[17px] font-medium text-gray-500">Tìm thấy {searchResult.length} kết quả</span>
                <Divider className="mt-0" />
                <div className="flex flex-col">
                    {searchResult.length > 0 ? searchResult.map(doctor => <React.Fragment key={doctor.user.id}>
                        <DoctorSearchItem doctor={doctor} />
                        <Divider />
                    </React.Fragment>) : <div className="flex flex-col items-center justify-center gap-y-2 text-gray-700">
                        <div className="max-w-[400px] flex flex-col gap-y-3">
                            <svg className="mx-auto mb-4 text-gray-400 w-24 h-24 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span className="font-semibold text-[17px]">Không tìm thấy kết quả phù hợp</span>
                            <p className="text-[15px]">Rất tiếc, chúng tôi không tìm thấy kết quả nào phù hợp với từ khoá bạn tìm kiếm. Vui lòng thử lại với từ khoá khác.</p>
                        </div>
                    </div>
                    }

                </div>
            </div>
        </div>
    </div>
};

export default SearchByDoctor;
