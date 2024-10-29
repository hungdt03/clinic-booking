using clinic_schedule.Core.Requests.Brand;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IBrandService
    {
        Task<BaseResponse> CreateBrand(BrandRequest request);
        Task<BaseResponse> GetAllBrandsByClinicId(string clinicId);
        Task<BaseResponse> GetAllBrands();
        Task<BaseResponse> UpdateBrand(int id, BrandRequest request);
    }
}
