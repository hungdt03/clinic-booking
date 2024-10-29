import axios from "axios";

export type ProviceResource = {
    province_id: string;
    province_name: string;
    province_type: string;
}

export type DistrictResource = {
    district_id: string;
    district_name: string;
    district_type: string;
    lat: string;
    lng: string;
    province_id: string;
}

export type WardResource = {
    ward_id: string;
    ward_name: string;
    ward_type: string;
    district_id: string;
}


export type AddressOption = {
    label: string;
    value: string;
}

type AddressResponse<T> = {
    results: T[]
}

class AddressService {

    async getProvinces() : Promise<AddressOption[]> {
        const response = await axios.get('https://vapi.vnappmob.com/api/province/');
        if(response.status === 200) {
            const data = response.data as AddressResponse<ProviceResource>;
            return data.results.map(province => ({
                label: province.province_name,
                value: province.province_id
            } as AddressOption))
        }

        return []
    }

    async getDistrictsByProvinceId(provinceId: string) : Promise<AddressOption[]> {
        const response = await axios.get('https://vapi.vnappmob.com/api/province/district/' + provinceId);
        if(response.status === 200) {
            const data = response.data as AddressResponse<DistrictResource>;
            return data.results.map(district => ({
                label: district.district_name,
                value: district.district_id
            } as AddressOption))
        }

        return []
    }

    async getWardsByDistrictId(districtId: string) : Promise<AddressOption[]> {
        const response = await axios.get('https://vapi.vnappmob.com/api/province/ward/' + districtId);
        if(response.status === 200) {
            const data = response.data as AddressResponse<WardResource>;
            return data.results.map(ward => ({
                label: ward.ward_name,
                value: ward.ward_id
            } as AddressOption))
        }

        return []
    }

}

const addressService = new AddressService();
export default addressService;