using MongoDB.Bson;
using MongoDB.Driver;
using queueitv2.Areas.Administration.Model;
using queueitv2.Infrastructure.Repositories.Administration.interfaces;
using queueitv2.Model.DomainModel;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration
{
    public class ReportRepository : Repository<Transactions>, IReportRepository
    {
        public ReportRepository(QueueITContext context) : base(context)
        {

        }
        public async Task<List<Transactions>> GetTransactionsBetweenDates(TDate dateFrom, TDate dateTo)
        {
            try
            {
                var dateTimeDateFrom = DateTime.Parse(dateFrom.year + "-" + dateFrom.month + "-" + dateFrom.day);
                var dateTimeDateTo = DateTime.Parse(dateTo.year + "-" + dateTo.month + "-" + dateTo.day);

                if (dateFrom == dateTo)
                {
                    var sameDayTransactions = await GetTransactionsOnADay(dateTimeDateFrom);

                    return sameDayTransactions;
                }

                var transactions = await GetTransactionsBetweenDatesNormal(dateTimeDateFrom, dateTimeDateTo);

                return transactions;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<List<Transactions>> GetTransactionsBetweenDatesNormal(DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                var transactions = await _context.GetCollection<Transactions>("transactions")
                    .Find(Builders<Transactions>.Filter.And(
                        Builders<Transactions>.Filter.Gte<DateTime>(t => t.datecreated, dateFrom),
                        Builders<Transactions>.Filter.Lte<DateTime>(t => t.datecreated, dateTo)))
                        .ToListAsync();

                return transactions;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<List<Transactions>> GetTransactionsOnADay(DateTime date)
        {
            try
            {                
                var sameDayTransactions = await _context.GetCollection<Transactions>("transactions")
                .Find(Builders<Transactions>.Filter.Eq(t => t.datecreated, date))
                    .ToListAsync();

                return sameDayTransactions;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
