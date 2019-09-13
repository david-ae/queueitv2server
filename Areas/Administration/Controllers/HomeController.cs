using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using queueitv2.Areas.Administration.Model;
using queueitv2.Infrastructure;
using queueitv2.Infrastructure.Repositories;
using queueitv2.Model;
using queueitv2.Model.DomainModel;

namespace queueitv2.Areas.Administration.Controllers
{
    //[Authorize]
    [Route("api/administration/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private UnitOfWork _unitOfWork;

        #region logger
        private ILogger<HomeController> _logger;
        #endregion

        public HomeController(UnitOfWork unitOfWork, ILogger<HomeController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }

        #region "Role"

        [HttpPost, HttpOptions, Route("addrole")]
        public async Task< IActionResult> AddRole([FromBody]string rolename)
        {
            try
            {
                var newRole = new Roles
                {
                    name = rolename,
                    datecreated = DateTime.Now
                };

                await _unitOfWork.Roles.Add(newRole);
                var result = await _unitOfWork.Commit();
                if (result)
                {
                    return Ok(newRole);
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest();
        }

        [HttpPost, Route("updaterole")]
        public async Task<IActionResult> UpdateRole([FromBody]RoleApiModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(model);
                }

                var role = new Roles
                {
                    Id = model.Id,
                    name = model.name
                };

                var result = await _unitOfWork.Roles.UpdateRoleAsync(role);
                if (Convert.ToBoolean( result))
                {
                    return Ok(role);
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest(model);
        }

        [HttpGet, Route("getallroles")]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var roles = await _unitOfWork.Roles.GetAll();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest();
        }

        [HttpGet, Route("getrole")]
        public IActionResult GetRole([FromBody]string id)
        {
            try
            {
                var role = _unitOfWork.Roles.GetById(id);
                return Ok(role);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest();
        }

        #endregion

        #region "Status"

        [HttpPost, Route("addstatus")]
        public async Task< IActionResult> AddStatus([FromBody]string statusname)
        {
            try
            {
                var newStatus = new Status
                {
                    name = statusname
                };

                await _unitOfWork.Status.Add(newStatus);
                var result = await _unitOfWork.Commit();
                if (result)
                {
                    return Ok(newStatus);
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest();
        }

        [HttpPost, Route("updatestatus")]
        public async Task<IActionResult> UpdateStatus([FromBody]StatusApiModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(model);
                }

                var status = new Status
                {
                    Id = model.Id,
                    name = model.name
                };

                var result = await _unitOfWork.Status.UpdateStatusAsync(status);
                if (result)
                {
                    return Ok(status);
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest(model);
        }

        [HttpGet, Route("getallstatus")]
        public async Task<IActionResult> GetAllStatus()
        {
            try
            {
                var status = await _unitOfWork.Status.GetAll();

                return Ok(status);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest();
        }

        #endregion

        #region "TransactionType"

        [HttpPost, Route("gettransactiontype")]
        public IActionResult GetTransactiontype([FromBody]string id)
        {
            try
            {
                var transactiontype = _unitOfWork.TransactionTypes.GetById(id);
                return Ok(transactiontype);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest();
        }

        [HttpPost, Route("addtransactiontype")]
        public async Task< IActionResult> AddTransactiontype([FromBody]string transactiontypename)
        {
            try
            {
                var newTransactiontype = new TransactionTypes
                {
                    name = transactiontypename,
                    datecreated = DateTime.Now
                };

                await _unitOfWork.TransactionTypes.Add(newTransactiontype);
                var result = await _unitOfWork.Commit();
                if (result)
                {
                    return Ok(newTransactiontype);
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest();
        }

        [HttpPost, Route("updatetransactiontype")]
        public async Task<IActionResult> UpdateTransactiontype([FromBody]TransactionTypeApiModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(model);
                }

                var transactionType = new TransactionTypes
                {
                    Id = model.Id,
                    name = model.name
                };

                var result = await _unitOfWork.TransactionTypes.UpdateTransactionTypeAsync(transactionType);
                if (result)
                {
                    return Ok(transactionType);
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest(model);
        }

        [HttpGet, Route("getalltransactiontypes")]
        public async Task<IActionResult> GetAllTransactionType()
        {
            try
            {
                var transactiontype = await _unitOfWork.TransactionTypes.GetAll();

                return Ok(transactiontype);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest();
        }

        #endregion

        #region "Reports"

        [HttpPost, Route("gettransactionsdateinrange")]
        public async Task<IActionResult> GetTransactionsDateInRange([FromBody]DateRangeApiModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                var transactions = await _unitOfWork.Reports.GetTransactionsBetweenDates(model.dateFrom, model.dateTo);
                
                if (transactions.Count > 0)
                {
                    return Ok(transactions);
                }
                else
                {
                    return Ok(null);
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message + ex.StackTrace);
            }

            return BadRequest();
        }

        #endregion
    }
}
