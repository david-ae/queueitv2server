using MongoDB.Bson;
using MongoDB.Driver;
using queueitv2.Infrastructure.Repositories.Operations.interfaces;
using queueitv2.Model.DomainModel;
using queueitv2.Model.DomainModel.valueobjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Operations
{
    public class TransactionRepository: Repository<Transactions>, ITransactionRepository
    {

        public TransactionRepository(QueueITContext context) : base(context)
        {

        }

        public async Task<bool> UpdateTransactionAsync(Transactions item)
        {
            var result = await _context.GetCollection<Transactions>("transactions").ReplaceOneAsync(
                Builders<Transactions>.Filter.Eq(transaction => transaction.Id, item.Id),
                item);
            if (result.ModifiedCount > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<List<Transactions>> GetTodaysTransactions()
        {
            var transactions = await _context.GetCollection<Transactions>("transactions")
                .Find(transaction => transaction.datecreated >= DateTime.Now.AddHours(-DateTime.Now.Hour).AddMinutes(-DateTime.Now.Minute)
                .AddSeconds(-DateTime.Now.Second)).ToListAsync();
            return transactions;
        }

        public async Task<List<Transactions>> GetAssignedTransactionsForSeniorTeller(string id)
        {
            var _id = new ObjectId(id);
            var teller = _context.GetCollection<Accounts>("accounts").Find(t => t.Identity == _id).SingleOrDefault();

            if(teller != null)
            {
                var user = new UserVO
                {
                    email = teller.username,
                    firstname = teller.firstname,
                    lastname = teller.lastname,
                    Identity = teller.Identity.ToString(),
                    roles = teller.roles
                };

                var transactions = await _context.GetCollection<Transactions>("transactions")
                .Find(transaction => transaction.treatedBy.Contains(user) &&
                transaction.datecreated >= DateTime.Now.AddHours(-DateTime.Now.Hour)
                .AddMinutes(-DateTime.Now.Minute)
                .AddSeconds(-DateTime.Now.Second)).ToListAsync();
                return transactions;
            }

            return new List<Transactions>();            
        }
    }
}
