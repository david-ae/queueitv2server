using queueitv2.Model.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration.interfaces
{
    public interface ITransactionTypeRepository: IRepository<TransactionTypes>
    {
        Task<bool> UpdateTransactionTypeAsync(TransactionTypes obj);
    Task<TransactionTypes> GetTransactionTypeById(string id);
  }
}
