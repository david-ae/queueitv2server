using Microsoft.AspNetCore.SignalR;
using queueitv2.Infrastructure.Repositories;
using queueitv2.Model.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Hubs
{
  public class TransactionHub : Hub
  {
    public Task GetTodayTransactions(List<Transactions> transactions)
    {
      return Clients.All.SendAsync("GetTodayTransactions", transactions);
    }

    public Task GetTodaysSubmittedTransactions(List<Transactions> transactions)
    {
      return Clients.All.SendAsync("GetTodaysSubmittedTransactions", transactions);
    }

    public Task GetTodaysProcessingTransactions(List<Transactions> transactions)
    {
      return Clients.All.SendAsync("GetTodaysProcessingTransactions", transactions.Count);
    }

    public Task GetTodaysRejectedTransactions(List<Transactions> transactions)
    {
      return Clients.All.SendAsync("GetTodaysRejectedTransactions", transactions.Count);
    }

    public Task GetAssignedTellersTransactions(List<Transactions> transactions)
    {
      return Clients.All.SendAsync("GetAssignedTellersTransactions", transactions.Count);
    }
  }
}
