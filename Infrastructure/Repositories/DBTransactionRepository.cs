using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using queueitv2.Model;
using queueitv2.Model.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories
{
    public class DBTransactionRepository
    {
        private readonly DbContext _context = null;

        public DBTransactionRepository(IOptions<Settings> settings)
        {
            _context = new DbContext(settings);
        }

        public async Task<string> GetAllTransactions()
        {
            var transactions = await _context.Transactions.Find(_ => true).ToListAsync();
            var jsonTrans = transactions.ToJson();
            return jsonTrans;
            
        }
    }
}
