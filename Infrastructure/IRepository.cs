using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure
{
    public interface IRepository<T> : IDisposable where T : class
    {
        Task Add(T obj);
        Task<T> GetById(string id);
        Task<IEnumerable<T>> GetAll();
        Task Remove(Guid id);
    }
}
