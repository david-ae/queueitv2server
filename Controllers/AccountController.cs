using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using queueitv2.Model;
using Microsoft.AspNetCore.Identity.MongoDB;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Newtonsoft.Json;
using queueitv2.Areas.Administration.Model;

namespace queueitv2.Controllers
{
    //[Route("api/administration/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<Users> _signInManager;
        private readonly UserManager<Users> _userManager;

        #region "Others"
        private readonly IConfiguration _configuration;
        private readonly JsonSerializerSettings _serializerSettings;
        #endregion

        public AccountController(
            UserManager<Users> userManager,
            SignInManager<Users> signInManager,
            IConfiguration configuration
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        [HttpPost, Route("login")]
        public async Task<object> Login([FromBody] UserLoginApiModel model)
        {
            //var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);

            //if (result.Succeeded)
            //{
            //    var user = _userManager.Users.SingleOrDefault(r => r.UserName == model.Username);
            //    if (user != null)
            //    {
            //        // Serialize and return the response
            //        var response = new
            //        {
            //            id = user.Id,
            //            auth_token = await GenerateJwtToken(model.Username, user),
            //            expires_in = 300,
            //            firstname = user.FirstName,
            //            lastname = user.LastName
            //        };

            //        var json = JsonConvert.SerializeObject(response, _serializerSettings);
            //        return new OkObjectResult(json);
            //    }
            //    else
            //    {
            //        throw new ApplicationException("USER NOT FOUND");
            //    }
            //}

            throw new ApplicationException("UNKNOWN_ERROR");
        }

        private async Task<object> GenerateJwtToken(string email, Users user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["JwtExpireDays"]));

            var token = new JwtSecurityToken(
                _configuration["JwtIssuer"],
                _configuration["JwtIssuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }       
    }
}
