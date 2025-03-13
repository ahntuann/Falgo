using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace api.Helpers
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var methodParameters = context.MethodInfo.GetParameters();
            var formFileParameterNames = methodParameters
                .Where(p => p.ParameterType == typeof(IFormFile) || p.ParameterType == typeof(List<IFormFile>))
                .Select(p => p.Name)
                .ToList();

            var dtoParameters = methodParameters
                .Where(p => p.ParameterType.GetProperties().Any(prop => prop.PropertyType == typeof(IFormFile) || prop.PropertyType == typeof(List<IFormFile>)))
                .SelectMany(p => p.ParameterType.GetProperties()
                    .Where(prop => prop.PropertyType == typeof(IFormFile) || prop.PropertyType == typeof(List<IFormFile>))
                    .Select(prop => prop.Name))
                .ToList();

            formFileParameterNames.AddRange(dtoParameters);

            if (formFileParameterNames.Any())
            {
                operation.RequestBody = new OpenApiRequestBody
                {
                    Content = new Dictionary<string, OpenApiMediaType>
                    {
                        ["multipart/form-data"] = new OpenApiMediaType
                        {
                            Schema = new OpenApiSchema
                            {
                                Type = "object",
                                Properties = formFileParameterNames.ToDictionary(
                                    name => name,
                                    name => new OpenApiSchema
                                    {
                                        Type = "string",
                                        Format = "binary"
                                    }
                                ),
                                Required = new HashSet<string>(formFileParameterNames)
                            }
                        }
                    }
                };
            }
        }
    }
}