using queueitv2.Model.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration.interfaces
{
    public interface IRoleRepository: IRepository<Roles>
    {
        Task<long> UpdateRoleAsync(Roles obj);
    Task<Roles> GetRoleById(string id);
    }
}
