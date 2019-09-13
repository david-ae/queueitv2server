using queueitv2.Model.DomainModel.valueobjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration.interfaces
{
    public interface IAccountRepository : IRepository<Accounts>
    {
        Task<bool> UpdateAccountAsync(Accounts obj);
        Task<Accounts> GetTellerByEmail(string email);
        Task<Accounts> GetTellerByObjectId(string id);
        Task<List<Accounts>> GetAllSeniorTellers();
        Task<List<Accounts>> GetAllTransactionalTellers();
    }
}
