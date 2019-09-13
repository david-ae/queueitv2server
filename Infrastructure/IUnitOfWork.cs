using queueitv2.Infrastructure.Repositories.Administration.interfaces;
using queueitv2.Infrastructure.Repositories.Operations.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure
{
    public interface IUnitOfWork : IDisposable
    {
        IRoleRepository Roles { get; }
        IStatusRepository Status { get; }
        ITransactionTypeRepository TransactionTypes { get; }
        ITransactionRepository Transactions { get; }
        Task<bool> Commit();
    }
}
