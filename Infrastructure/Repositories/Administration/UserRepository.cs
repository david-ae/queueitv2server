using queueitv2.Infrastructure.Repositories.Administration.interfaces;
using queueitv2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories.Administration
{
    public class UserRepository: Repository<Users>, IUserRepository
    {
        public UserRepository(QueueITContext context) : base(context)
        {

        }
    }
}
