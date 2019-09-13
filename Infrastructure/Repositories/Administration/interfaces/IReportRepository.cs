using queueitv2.Areas.Administration.Model;
using queueitv2.Model.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration.interfaces
{
    public interface IReportRepository
    {
        Task<List<Transactions>> GetTransactionsBetweenDates(TDate dateFrom, TDate dateTo);
    }
}
