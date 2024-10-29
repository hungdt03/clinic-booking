namespace clinic_schedule.Infrastructures.Cloudinary
{
    public interface IUploadService
    {
        Task<string> UploadAsync(IFormFile file);
        Task<List<string>> MultiUploadAsync(List<IFormFile> files);
    }
}
