using queueitv2.Infrastructure.Repositories.Administration.interfaces;
using queueitv2.Model.DomainModel;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration
{
    public class StatusRepository : Repository<Status>, IStatusRepository
    {
        public StatusRepository(QueueITContext context) : base(context)
        {

        }

        public async Task<bool> UpdateStatusAsync(Status item)
        {
            var result = await _context.GetCollection<Status>("status").ReplaceOneAsync(
                Builders<Status>.Filter.Eq(p => p.Id, item.Id),
                item);
            if(result.ModifiedCount > 0)
            {
                return true;
            }
            return false;
        }
    }
}
