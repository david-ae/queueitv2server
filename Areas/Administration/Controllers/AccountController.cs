using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using queueitv2.Areas.Administration.Model;
using queueitv2.Infrastructure.Repositories;
using queueitv2.Model;
using queueitv2.Model.DomainModel.valueobjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace queueitv2.Areas.Administration.Controllers
{
    
  [Route("api/administration/[controller]")]
  [ApiController]
  public class AccountController : ControllerBase
  {
    private UnitOfWork _unitOfWork;

    #region "Identity"
    private readonly SignInManager<Users> _signInManager;
    private readonly UserManager<Users> _userManager;
    #endregion

    #region "Others"
    private readonly IConfiguration _configuration;
    private readonly JsonSerializerSettings _serializerSettings;
    #endregion

    #region logger
    private ILogger<AccountController> _logger;
    #endregion

    public AccountController(
        UserManager<Users> userManager,
        SignInManager<Users> signInManager,
        IConfiguration configuration,
        ILogger<AccountController> logger,
        UnitOfWork unitOfWork
        )
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _configuration = configuration;
      _logger = logger;
      _unitOfWork = unitOfWork;
      _serializerSettings = new JsonSerializerSettings
      {
        Formatting = Formatting.Indented
      };
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    // POST api/values
    [HttpPost, Route("register")]
    public async Task<object> Register([FromBody]ManageUserApiModel model)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var user = new Users
        {
          FirstName = model.firstname,
          LastName = model.lastname,
          Email = model.email,
          UserName = model.email,
          UserType = "Modern User",
          isActive = true,
          Datecreated = DateTime.Now
        };

        var result = await _userManager.CreateAsync(user, "password");

        if (result.Succeeded)
        {
          //await _signInManager.SignInAsync(user, false);
          var response = new
          {
            id = user.Id,
            //auth_token = await GenerateJwtToken(user.UserName, user),
            expires_in = 300,
            firstname = user.FirstName,
            lastname = user.LastName,
            email = user.Email,
            roles = user.Roles
          };

          var json = JsonConvert.SerializeObject(response, _serializerSettings);
          return new OkObjectResult(json);
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return new BadRequestObjectResult(model);
    }

        [AllowAnonymous]
    [HttpPost, Route("login")]
    public async Task<object> Login([FromBody]UserLoginApiModel model)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }
        var user = await _userManager.FindByEmailAsync(model.Username);

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);

        object response = null;

        switch (result.Succeeded)
        {
          case true:
            // Serialize and return the response
            response = new
            {
              id = user.Id,
              auth_token = await GenerateJwtToken(user.UserName, user),
              expires_in = 300,
              authenticated = true
            };
            break;
          case false:
            // Serialize and return the response
            response = new
            {
              id = "",
              auth_token = "",
              expires_in = 0,
              authenticated = false
            };
            break;
        }

        var json = JsonConvert.SerializeObject(response, _serializerSettings);
        return Ok(json);
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return new BadRequestObjectResult(model);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost, Route("changeuserpassword")]
    public async Task<IActionResult> Reset([FromBody]ChangePasswordApiModel model)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.email);

        if (user != null)
        {
          var result = await _userManager.ChangePasswordAsync(user, model.newPassword, model.confirmNewPassword);

          if (result.Succeeded)
          {
            return new OkObjectResult(user);
          }
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return new BadRequestObjectResult(model);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet, Route("getallusers")]
    public async Task<IActionResult> GetAllUsers()
    {
      try
      {
        var users = await _unitOfWork.Users.GetAll();

        var userVos = turnUsersToUserVO(users);

        return Ok(userVos);
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return new BadRequestResult();
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost, Route("getalltellers")]
    public async Task<IActionResult> GetAllTellers()
    {
      try
      {
        var users = await _unitOfWork.Users.GetAll();

        var tellers = new List<Users>();

        foreach (var user in users)
        {
          if (user.Roles.Contains("TELLER"))
          {
            tellers.Add(user);
          }
        }

        var userVos = turnUsersToUserVO(tellers);

        return Ok(userVos);
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return new BadRequestResult();
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost, Route("getallactiveusers")]
    public async Task<IActionResult> GetAllActiveUsers()
    {
      try
      {
        var users = await _unitOfWork.Users.GetAll();

        var activeUsers = new List<Users>();

        foreach (var user in users)
        {
          if (user.isActive == true)
          {
            activeUsers.Add(user);
          }
        }

        var userVos = turnUsersToUserVO(activeUsers);

        return Ok(userVos);
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return new BadRequestResult();
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost, Route("removerole")]
    public async Task<IActionResult> RemoveFromRole([FromBody]ManageRoleApiModel model)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.email);

        if (user != null)
        {
          var result = await _userManager.RemoveFromRoleAsync(user, model.rolename);

          if (result.Succeeded)
          {
            return new OkObjectResult(user);
          }
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return new BadRequestObjectResult(model);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost, Route("addusertorole")]
    public async Task<IActionResult> AddUserToRole([FromBody]ManageRoleApiModel model)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.email);

        if (user != null)
        {
          var result = await _userManager.AddToRoleAsync(user, model.rolename);

          if (result.Succeeded)
          {
            return new OkObjectResult(user);
          }
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return new BadRequestObjectResult(model);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost, Route("addroletouser")]
    public async Task<IActionResult> AddRoleToUser([FromBody]UserRoleViewModel model)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var user = await _userManager.FindByIdAsync(model.UserId);
        var role = await _unitOfWork.Roles.GetById(model.RoleId);
        var result = _userManager.AddToRoleAsync(user, role.name);

        if (result.IsCompletedSuccessfully)
        {
          return Ok();
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest();
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost, Route("updateuser")]
    public async Task<IActionResult> ModifyUser([FromBody]ManageUserApiModel model)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var user = await _userManager.FindByIdAsync(model.id);

        if (user != null)
        {
          user.FirstName = model.firstname;
          user.LastName = model.lastname;
          user.Email = model.email;
          user.UpdatedOn = DateTime.Now;

          var result = await _userManager.UpdateAsync(user);

          if (result.Succeeded)
          {
            return Ok(user);
          }
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest();
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost, Route("deactivateuser")]
    public async Task<IActionResult> DeactivateUser([FromBody]string id)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var user = await _userManager.FindByIdAsync(id);

        if (user != null)
        {
          user.isActive = false;

          var result = await _userManager.UpdateAsync(user);

          if (result.Succeeded)
          {
            return Ok(user);
          }
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest(ModelState);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost, Route("reactivateuser")]
    public async Task<IActionResult> ReactivateUser([FromBody]string id)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var user = await _userManager.FindByIdAsync(id);

        if (user != null)
        {
          user.isActive = true;

          var result = await _userManager.UpdateAsync(user);

          if (result.Succeeded)
          {
            return Ok(user);
          }
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest(ModelState);
    }

    [AllowAnonymous]
    [HttpPost, Route("getNewAccountProfile")]
    public async Task<IActionResult> getNewAccountProfile([FromBody] string email)
    {
      try
      {
        var teller = await _unitOfWork.Accounts.GetTellerByEmail(email);

        if (teller != null)
        {
          var user = new Users
          {
            Email = teller.username,
            FirstName = teller.firstname,
            LastName = teller.lastname,
            UserName = teller.username,
            NormalizedEmail = teller.username.ToUpper(),
            NormalizedUserName = teller.username.ToUpper(),
            Roles = teller.roles,
            legacyId = teller.Identity.ToString(),
            UserType = "Legacy User",
            isActive = true,
            Datecreated = DateTime.Now
          };

          var result = await _userManager.CreateAsync(user, "password");

          if (result.Succeeded)
          {
            //await _signInManager.SignInAsync(user, false);
            var response = new
            {
              id = user.Id,
              //auth_token = await GenerateJwtToken(user.UserName, user),
              expires_in = 300,
              firstname = user.FirstName,
              lastname = user.LastName,
              email = user.Email,
              roles = user.Roles
            };

            var json = JsonConvert.SerializeObject(response, _serializerSettings);
            return new OkObjectResult(json);
          }

          return Ok(user);
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest(email);
    }

    private async Task<object> GenerateJwtToken(string email, Users user)
    {
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(_configuration["Jwt:Issuer"],

        _configuration["Jwt:Issuer"],

        expires: DateTime.Now.AddMinutes(30),

        signingCredentials: creds);

      return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [AllowAnonymous]
    [HttpGet, Route("getTellerUsingIdentityById")]
    public async Task<IActionResult> GetTellerUsingIdentityById([FromBody] string id)
    {
      try
      {
        var teller = await _userManager.FindByIdAsync(id);

        if (teller != null)
        {
          var user = new UserVO
          {
            email = teller.Email,
            firstname = teller.FirstName,
            lastname = teller.LastName,
            Identity = teller.Id,
            roles = teller.Roles
          };

          return Ok(user);
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest(id);
    }

    [AllowAnonymous]
    [HttpPost, Route("getTellerUsingAccountById")]
    public async Task<IActionResult> GetTellerUsingAccountsById([FromBody] string id)
    {
      try
      {
        var teller = await _unitOfWork.Accounts.GetTellerByObjectId(id);

        if (teller != null)
        {
          var user = new Accounts
          {
            username = teller.username,
            firstname = teller.firstname,
            lastname = teller.lastname,
            Identity = teller.Identity,
            roles = teller.roles
          };

          return Ok(user);
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest(id);
    }

    [AllowAnonymous]
    [HttpGet, Route("getUserUsingAccountByEmail")]
    public async Task<IActionResult> GetUserUsingAccountsByEmail( string email)
    {
      try
      {
        var teller = await _unitOfWork.Accounts.GetTellerByEmail(email);

        var user = new Accounts();

        if (teller != null)
        {
          user = new Accounts
          {
            username = teller.username,
            firstname = teller.firstname,
            lastname = teller.lastname,
            Identity = teller.Identity,
            roles = teller.roles
          };

          return Ok(user);
        }

        user = null;

        return Ok(user);
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest(email);
    }

    [AllowAnonymous]
    [HttpGet, Route("getUserUsingId")]
    public async Task<IActionResult> GetUserUsingId(string id)
    {
      try
      {
        var user = await _userManager.FindByIdAsync(id);

        if (user != null && user.isActive == true)
        {
          var loggedInUser = new UserVO
          {
            email = user.Email,
            firstname = user.FirstName,
            lastname = user.LastName,
            Identity = user.Id,
            isActive = user.isActive,
            legacyId = user.legacyId,
            roles = user.Roles,
            userType = user.UserType
          };

          return Ok(loggedInUser);
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest(id);
    }

    public List<UserVO> turnUsersToUserVO(IEnumerable<Users> users)
    {
      var userVos = new List<UserVO>();

      foreach (var user in users)
      {
        var userVo = new UserVO
        {
          email = user.Email,
          firstname = user.FirstName,
          lastname = user.LastName,
          roles = user.Roles,
          Identity = user.Id,
          isActive = user.isActive,
          userType = user.UserType,
          legacyId = user.legacyId
        };
        userVos.Add(userVo);
      }

      return userVos;
    }
  }
}
