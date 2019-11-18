using MongoDB.Driver;
using queueitv2.Infrastructure.Repositories.Administration.interfaces;
using queueitv2.Model.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration
{
    public class RoleRepository: Repository<Roles>, IRoleRepository
    {
        public RoleRepository(QueueITContext context): base(context)
        {

        }

    public async Task<Roles> GetRoleById(string id)
    {
      try
      {
        var role = await _context.GetCollection<Roles>("roles").FindAsync(r => r.Id == id);
        return await role.FirstOrDefaultAsync();
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

        public async Task<long> UpdateRoleAsync(Roles item)
        {
            try
            {
                var result = await _context.GetCollection<Roles>("roles").ReplaceOneAsync(
                        Builders<Roles>.Filter.Eq(p => p.Id, item.Id),
                        item);
                return result.ModifiedCount;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
