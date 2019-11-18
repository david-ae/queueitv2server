using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Bson;
using queueitv2.Areas.Operations.Models;
using queueitv2.Hubs;
using queueitv2.Infrastructure.Repositories;
using queueitv2.Model;
using queueitv2.Model.DomainModel;
using queueitv2.Model.DomainModel.interfaces;
using queueitv2.Model.DomainModel.valueobjects;

namespace queueitv2.Areas.Operations.Controllers
{
  
  [Route("api/operations/[controller]")]
  //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
  [ApiController]
  public class HomeController : ControllerBase
  {
    #region "SignalR Hub"
    private IHubContext<TransactionHub> _transactionHubContext;
    #endregion

    #region "Repositories"
    private UnitOfWork _unitOfWork;
    #endregion

    #region "Identity"
    private readonly UserManager<Users> _userManager;
    #endregion

    #region logger
    private ILogger<HomeController> _logger;
    #endregion

    public HomeController(IHubContext<TransactionHub> transactionHubContext, UnitOfWork unitOfWork,
        UserManager<Users> userManager, ILogger<HomeController> logger)
    {
      _unitOfWork = unitOfWork;
      _transactionHubContext = transactionHubContext;
      _userManager = userManager;
      _logger = logger;
    }

    #region "SignalR Transactions Pull"
    [HttpGet, Route("getTodaysTransactions")]
    public async Task<IActionResult> GetTodaysTransaction()
    {
      try
      {
          var transactions = await _unitOfWork.Transactions.GetTodaysTransactions();
          var submittedTransactions = await _unitOfWork.Transactions.GetTodaysSubmittedTransactions();
          var processingTransactions = await _unitOfWork.Transactions.GetTodaysProcessingTransactions();
          var rejectedTransactions = await _unitOfWork.Transactions.GetTodaysRejectedTransactions();
          await _transactionHubContext.Clients.All.SendAsync("GetTodaysSubmittedTransactions", submittedTransactions);
          await _transactionHubContext.Clients.All.SendAsync("GetTodaysProcessingTransactions", processingTransactions);
          await _transactionHubContext.Clients.All.SendAsync("GetTodaysRejectedTransactions", rejectedTransactions);
          await _transactionHubContext.Clients.All.SendAsync("GetTodayTransactions", transactions);

          return Ok();      
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest();
    }

    [HttpGet, HttpOptions, Route("getAssignedTellersTransactions")]
    public async Task<IActionResult> GetAssignedTellersTransactions([FromBody] string id)
    {
      try
      {
        var transactions = await _unitOfWork.Transactions.GetAssignedTransactionsForSeniorTeller(id);
        var submittedTransactions = await _unitOfWork.Transactions.GetTodaysSubmittedTransactions();
        var processingTransactions = await _unitOfWork.Transactions.GetTodaysProcessingTransactions();
        var rejectedTransactions = await _unitOfWork.Transactions.GetTodaysRejectedTransactions();
        await _transactionHubContext.Clients.All.SendAsync("GetTodaysSubmittedTransactions", submittedTransactions);
        await _transactionHubContext.Clients.All.SendAsync("GetTodaysProcessingTransactions", processingTransactions);
        await _transactionHubContext.Clients.All.SendAsync("GetTodaysRejectedTransactions", rejectedTransactions);
        await _transactionHubContext.Clients.All.SendAsync("GetAssignedTellersTransactions", transactions);

        return Ok();
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest();
    }

    #endregion

    #region "Transaction Operations"

    [HttpPost, Route("addtransaction")]
    public async Task<IActionResult> AddTransaction([FromBody]TransactionApiModel model)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(model);
        }

        var transaction = new Transactions
        {
          customerName = model.customerName,
          platenumber = model.platenumber,
          allocatedTime = model.allocatedTime,
          transactionType = model.transactionType,
          amount = model.amount,
          timeSubmitted = model.timeSubmitted,
          createdBy = model.createdBy,
          outletName = model.outletName,
          status = model.status,
          datecreated = DateTime.UtcNow
        };

        var recipientOfTransaction = await GetTellerById(model.treatedBy);

        transaction.treatedBy.Add(recipientOfTransaction);

        await _unitOfWork.Transactions.Add(transaction);
        var result = await _unitOfWork.Commit();

        if (result)
        {
          var transactions = await _unitOfWork.Transactions.GetTodaysTransactions();
          var submittedTransactions = await _unitOfWork.Transactions.GetTodaysSubmittedTransactions();
          var processingTransactions = await _unitOfWork.Transactions.GetTodaysProcessingTransactions();
          var rejectedTransactions = await _unitOfWork.Transactions.GetTodaysRejectedTransactions();
          await _transactionHubContext.Clients.All.SendAsync("GetTodayTransactions", transactions);
          await _transactionHubContext.Clients.All.SendAsync("GetTodaysSubmittedTransactions", submittedTransactions);
          await _transactionHubContext.Clients.All.SendAsync("GetTodaysProcessingTransactions", processingTransactions);
          await _transactionHubContext.Clients.All.SendAsync("GetTodaysRejectedTransactions", rejectedTransactions);
          return Ok(transaction);
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest();
    }

    [HttpPost, Route("updatetransaction")]
    public async Task<IActionResult> UpdateTransaction([FromBody]TransactionsUpdateApiModel model)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(model);
        }

        var transaction = new Transactions
        {
          Id = model.Id,
          customerName = model.customerName,
          platenumber = model.platenumber,
          allocatedTime = model.allocatedTime,
          transactionType = model.transactionType,
          amount = model.amount,
          timeSubmitted = model.timeSubmitted,
          createdBy = model.createdBy,
          outletName = model.outletName,
          treatedBy = model.treatedBy,
          status = model.status,
          completedBy = model.completedBy,
          flaggedIssueBy = model.flaggedIssueBy,
          rejectedBy = model.rejectedBy,
          returnedBy = model.returnedBy,
          timeIssueFlagged = model.timeIssueFlagged,
          timeCompleted = model.timeCompleted,
          timeRejected = model.timeRejected,
          datecreated = DateTime.UtcNow
        };

        var result = await _unitOfWork.Transactions.UpdateTransactionAsync(transaction);

        if (result)
        {
          var transactions = await _unitOfWork.Transactions.GetTodaysTransactions();
          await _transactionHubContext.Clients.All.SendAsync("GetTodayTransactions", transactions);
          var submittedTransactions = await _unitOfWork.Transactions.GetTodaysSubmittedTransactions();
          var processingTransactions = await _unitOfWork.Transactions.GetTodaysProcessingTransactions();
          var rejectedTransactions = await _unitOfWork.Transactions.GetTodaysRejectedTransactions();
          await _transactionHubContext.Clients.All.SendAsync("GetTodaysSubmittedTransactions", submittedTransactions);
          await _transactionHubContext.Clients.All.SendAsync("GetTodaysProcessingTransactions", processingTransactions);
          await _transactionHubContext.Clients.All.SendAsync("GetTodaysRejectedTransactions", rejectedTransactions);
          return Ok();
        }
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest();
    }
    #endregion

    #region "For dropdowns"
    [HttpGet, Route("getalltransactiontypes")]
    public async Task<IActionResult> GetAllTransactionType()
    {
      try
      {
        var transactiontypes = await _unitOfWork.TransactionTypes.GetAll();

        return Ok(transactiontypes);
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest();
    }
    #endregion
    //[HttpGet, Route("getalltransactions")]
    //public async Task<IActionResult> GetAllTransactions()
    //{
    //    var transactions = await _unitOfWork.Transactions.GetAll();
    //    return Ok(transactions);
    //}

    [HttpGet, Route("getallseniortellers")]
    public IActionResult GetSeniorTellers()
    {
      try
      {
        var tellers = GetSeniorTellersV2();

        return Ok(tellers);
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest();
    }

    [HttpGet, Route("getalltransactionaltellers")]
    public IActionResult GetTransactionalTellers()
    {
      try
      {
        var tellers = GetTransactionalTellersV2();

        return Ok(tellers);
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex.Message + ex.StackTrace);
      }

      return BadRequest();
    }

    public async Task<Accounts> GetTellerUsingAccountsById(string id)
    {
      try
      {
        var teller = await _unitOfWork.Accounts.GetTellerByObjectId(id);

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
        }

        return user;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public async Task<UserVO> GetTellerById(string id)
    {
      try
      {
        var teller = await _userManager.FindByIdAsync(id);

        var user = new UserVO();

        if (teller != null)
        {
          user = new UserVO
          {
            firstname = teller.FirstName,
            lastname = teller.LastName,
            Identity = ConvertToIbjectId(teller.Id),
            roles = teller.Roles,
            email = teller.Email,
            userType = teller.UserType,
            legacyId = teller.legacyId,
            isActive = teller.isActive
          };
        }

        return user;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public List<UserVO> GetSeniorTellersV2()
    {
      try
      {
        var seniorTellers = new List<UserVO>();

        var users = _userManager.Users.ToList();

        foreach (var user in users)
        {
          if (user.Roles.Contains("SENIOR TELLER") && user.isActive == true)
          {
            var teller = new UserVO
            {
              firstname = user.FirstName,
              lastname = user.LastName,
              Identity = ConvertToIbjectId(user.Id),
              roles = user.Roles,
              email = user.Email,
              userType = user.UserType,
              legacyId = user.legacyId,
              isActive = user.isActive
            };

            seniorTellers.Add(teller);
          }
        }

        return seniorTellers;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public List<UserVO> GetTransactionalTellersV2()
    {
      try
      {
        var transactionalTellers = new List<UserVO>();

        var users = _userManager.Users.ToList();

        foreach (var user in users)
        {
          if (user.Roles.Contains("TRANSACTIONAL TELLER") && user.isActive == true)
          {
            var teller = new UserVO
            {
              firstname = user.FirstName,
              lastname = user.LastName,
              Identity = ConvertToIbjectId(user.Id),
              roles = user.Roles,
              email = user.Email,
              userType = user.UserType,
              legacyId = user.legacyId,
              isActive = user.isActive
            };
            transactionalTellers.Add(teller);
          }
        }

        return transactionalTellers;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public List<UserVO> GetTellersV2()
    {
      try
      {
        var tellers = new List<UserVO>();

        var users = _userManager.Users.ToList();

        foreach (var user in users)
        {
          if (user.Roles.Contains("TELLER") && user.isActive == true)
          {
            var teller = new UserVO
            {
              firstname = user.FirstName,
              lastname = user.LastName,
              Identity = ConvertToIbjectId(user.Id),
              roles = user.Roles,
              email = user.Email,
              userType = user.UserType,
              legacyId = user.legacyId,
              isActive = user.isActive
            };
            tellers.Add(teller);
          }
        }

        return tellers;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public ObjectId ConvertToIbjectId(string id)
    {
      try
      {
        var oId = new ObjectId(id);
        return oId;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    #region "Repair Data"
    [HttpGet, Route("getalltransaction")]
    public async Task<IActionResult> GetAllTransactions()
    {
      var transactions = await _unitOfWork.Transactions.GetAll();
      //var trans = JsonConvert.DeserializeObject<List<Transactions>>(transactions);
      //var counter = 0;
      //foreach(var bson in transactions)
      //{
      //    counter++;
      //    var obj = BsonSerializer.Deserialize<Transactions>(bson);
      //    Console.WriteLine(obj.Id + " Number: " + counter);
      //}
      //BsonReader reader = new BsonReader(transactions);
      return Ok(transactions);
    }
    #endregion
  }
}
