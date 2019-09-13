using queueitv2.Model.DomainModel;
using queueitv2.Model.DomainModel.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Operations.interfaces
{
    public interface ITransactionRepository: IRepository<Transactions>
    {
        Task<bool> UpdateTransactionAsync(Transactions obj);
        Task<List<Transactions>> GetTodaysTransactions();
        Task<List<Transactions>> GetAssignedTransactionsForSeniorTeller(string id);
    }
}
