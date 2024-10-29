using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Validations
{
    public class Validation : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var firstError = context.ModelState.Values
                    .SelectMany(v => v.Errors)
                    .FirstOrDefault();

                if (firstError != null)
                {
                    var response = new BaseResponse
                    {
                        Success = false,
                        Message = firstError.ErrorMessage,
                        StatusCode = System.Net.HttpStatusCode.UnprocessableEntity
                    };

                    context.Result = new UnprocessableEntityObjectResult(response);

                }
            }
        }
    }
}
