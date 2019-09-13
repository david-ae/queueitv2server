using MongoDB.Bson;
using MongoDB.Driver;
using queueitv2.Infrastructure.Repositories.Administration.interfaces;
using queueitv2.Model.DomainModel.valueobjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration
{
    public class AccountsRepository: Repository<Accounts>, IAccountRepository
    {
        public AccountsRepository(QueueITContext context) : base(context)
        {

        }

        public async Task<Accounts> GetTellerByObjectId(string id)
        {
            var _id = new ObjectId(id);
            var teller = await _context.GetCollection<Accounts>("accounts")
                .Find(t => t.Identity == _id).SingleOrDefaultAsync();
            if (teller != null)
            {
                return teller;
            }
            return teller;
        }

        public async Task<Accounts> GetTellerByEmail(string email)
        {
            var teller = await _context.GetCollection<Accounts>("accounts")
                .Find(t => t.username == email).SingleOrDefaultAsync();
            if(teller != null)
            {
                return teller;
            }
            return teller;
        }

        public async Task<bool> UpdateAccountAsync(Accounts item)
        {
            var result = await _context.GetCollection<Accounts>("accounts").ReplaceOneAsync(
                Builders<Accounts>.Filter.Eq(p => p.Identity, item.Identity),
                item);
            if (result.ModifiedCount > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<List<Accounts>> GetAllSeniorTellers()
        {
            var seniorTellers = await _context.GetCollection<Accounts>("accounts")
                .Find(t => t.roles.Contains("SENIOR TELLER")).ToListAsync();
            if(seniorTellers != null)
            {
                return seniorTellers;
            }

            return null;
        }

        public async Task<List<Accounts>> GetAllTransactionalTellers()
        {
            var transactionalTellers = await _context.GetCollection<Accounts>("accounts")
                .Find(t => t.roles.Contains("TRANSACTIONAL TELLER")).ToListAsync();
            if (transactionalTellers != null)
            {
                return transactionalTellers;
            }

            return null;
        }
    }
}
