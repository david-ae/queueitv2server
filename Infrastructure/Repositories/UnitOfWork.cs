using Core.MongoDB.Repository.Interfaces;
using queueitv2.Infrastructure.Repositories.Administration;
using queueitv2.Infrastructure.Repositories.Administration.interfaces;
using queueitv2.Infrastructure.Repositories.Operations;
using queueitv2.Infrastructure.Repositories.Operations.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly QueueITContext _context;

        public IRoleRepository Roles { get; }

        public IStatusRepository Status { get; }

        public ITransactionTypeRepository TransactionTypes { get; }

        public ITransactionRepository Transactions { get; }

        public IAccountRepository Accounts { get; }
        public IReportRepository Reports { get; set; }

        public IUserRepository Users { get; set; }

        public UnitOfWork(QueueITContext context)
        {
            _context = context;
            Roles = new RoleRepository(_context);
            Status = new StatusRepository(_context);
            TransactionTypes = new TransactionTypeRepository(_context);
            Transactions = new TransactionRepository(_context);
            Accounts = new AccountsRepository(_context);
            Reports = new ReportRepository(_context);
            Users = new UserRepository(_context);
        }

        public async Task< bool> Commit()
        {
            return await _context.SaveChanges() > 0;
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
