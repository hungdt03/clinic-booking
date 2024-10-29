import { FC, useEffect, useState } from "react";

import { Divider, UploadFile } from "antd";
import BasicInformationForm from "./BasicInformationForm";
import EducationForm from "./EducationForm";
import WorkExperienceForm from "./WorkExperienceForm";
import AwardForm from "./AwardForm";
import IntroducationForm from "./IntroducationForm";
import { DoctorOwnerResource } from "../../../resources";
import doctorService from "../../../services/doctor-service";
import Loading from "../../../components/shared/Loading";

export type EducationType = {
    fromYear: string;
    toYear: string;
    studyPlace: string;
}

export type WorkExperienceType = {
    fromYear: string;
    toYear: string;
    workPlace: string;
}

export type AwardsAndResearchesType = {
    fromYear: string;
    toYear: string;
    workPlace: string;
}

export type IntroductionRequest = {
    name: string;
    phoneNumber: string;
    dateOrBirth: Date;
    academicTitle: string;
    thumbnail: UploadFile;
    degree: string;
    currentWorkPlace: string;
    position: string;
    experienceYears: string;
    address: string;
    introductionPlain: string;
    introductionHtml: string;
    images: UploadFile[];
    awardsAndResearches: AwardsAndResearchesType[];
    workExperiences: WorkExperienceType[];
    educations: EducationType[];

}


export type EducationRequest = {
    educations: EducationType[];
}

export type WorkExperienceRequest = {
    workExperiences: WorkExperienceType[];
}

export type AwardsAndResearchesRequest = {
    awardsAndResearches: AwardsAndResearchesType[];
}

export type DoctorIntroductionRequest = {
    introductionPlain: string;
    introductionHtml: string;
}

const DoctorIntroduction: FC = () => {
    const [doctor, setDoctor] = useState<DoctorOwnerResource | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchDoctorDetails = async () => {
        setLoading(true)
        const response = await doctorService.getDoctorOwnerDetails();
        setLoading(false)
        if (response.success) {
            setDoctor(response.data)
        }
    }

    useEffect(() => {
        fetchDoctorDetails()
    }, [])

    return <div className="h-full overflow-y-auto flex flex-col custom-scrollbar scrollbar-w-2 px-2">
        {loading && <Loading />}
        {doctor &&
            <>
                <BasicInformationForm onRefresh={() => fetchDoctorDetails()} doctor={doctor} />
                <Divider />
                <EducationForm onRefresh={() => fetchDoctorDetails()} doctor={doctor} />
                <Divider />
                <WorkExperienceForm onRefresh={() => fetchDoctorDetails()} doctor={doctor} />
                <Divider />
                <AwardForm onRefresh={() => fetchDoctorDetails()} doctor={doctor} />
                <Divider />
                <IntroducationForm doctor={doctor} onRefresh={() => fetchDoctorDetails()} />
            </>
        }
    </div>
};

export default DoctorIntroduction;
