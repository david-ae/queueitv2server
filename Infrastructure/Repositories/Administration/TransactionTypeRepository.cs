using MongoDB.Bson;
using MongoDB.Driver;
using queueitv2.Infrastructure.Repositories.Administration.interfaces;
using queueitv2.Model.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration
{
    public class TransactionTypeRepository: Repository<TransactionTypes>, ITransactionTypeRepository
    {
        public TransactionTypeRepository(QueueITContext context) : base(context)
        {

        }

    public async Task<TransactionTypes> GetTransactionTypeById(string id)
    {
      try
      {
        var transactionType = await _context.GetCollection<TransactionTypes>("transactiontypes").FindAsync(t => t.Id == id);
        return await transactionType.FirstOrDefaultAsync();
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public async Task<bool> UpdateTransactionTypeAsync(TransactionTypes item)
        {
            var result = await _context.GetCollection<TransactionTypes>("transactiontypes").ReplaceOneAsync(
                Builders<TransactionTypes>.Filter.Eq(p => p.Id, item.Id),
                item);
            if (result.ModifiedCount > 0)
            {
                return true;
            }
            return false;
        }
    }
}
