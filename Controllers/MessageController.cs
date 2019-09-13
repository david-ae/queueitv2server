using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using queueitv2.Hubs;
using queueitv2.Infrastructure.Repositories;

namespace queueitv2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private IHubContext<TransactionHub> _messageHubContext;

        private UnitOfWork _unitOfWork;

        public MessageController(IHubContext<TransactionHub> messageHubContext, UnitOfWork unitOfWork)
        {
            _messageHubContext = messageHubContext;
            _unitOfWork = unitOfWork;
        }

        [HttpPost]
        public async Task< IActionResult> Post()
        {
            var transactions = await _unitOfWork.Transactions.GetAll();
            await _messageHubContext.Clients.All.SendAsync("GetAllTransactions", transactions);
            return Ok();
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }
    }
}