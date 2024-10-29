import { FC, useEffect, useState } from "react";
import BasicInfoClinicForm from "./BasicInfoClinicForm";
import IntroductionClinicForm from "./IntroductionClinicForm";
import { ClinicResource } from "../../../resources";
import clinicService from "../../../services/clinic-service";

const ClinicIntroduction: FC = () => {
    const [clinic, setClinic] = useState<ClinicResource | null>(null)

    const fetchClinicDetails = async () => {
        const response = await clinicService.getClinicDetails();
        if (response.success) {
            setClinic(response.data)
        }
    }

    useEffect(() => {
        fetchClinicDetails()
    }, [])
    return <div className="h-full overflow-y-auto flex flex-col custom-scrollbar scrollbar-w-2 px-2">
        {clinic &&
            <>
                <BasicInfoClinicForm
                    clinic={clinic}
                    onRefresh={() => fetchClinicDetails()}
                />
                <IntroductionClinicForm
                    clinic={clinic}
                    onRefresh={() => fetchClinicDetails()}
                />
            </>
        }
    </div>
};

export default ClinicIntroduction;
