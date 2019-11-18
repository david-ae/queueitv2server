using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace queueitv2.Model
{
  public class JWTTokenConfiguration
  {
    public static void AddAuthentication(IServiceCollection services, IConfiguration configuration)

    {

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

      .AddJwtBearer(options =>

      {
        
        options.TokenValidationParameters = new TokenValidationParameters

        {

          ValidateIssuer = true,

          ValidateAudience = true,

          ValidateLifetime = true,

          ValidateIssuerSigningKey = true,

          ValidIssuer = configuration["Jwt:Issuer"],

          ValidAudience = configuration["Jwt:Issuer"],

          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))

        };

        services.AddCors();

      });

    }

  }


}
