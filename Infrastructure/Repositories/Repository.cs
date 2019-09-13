using Core.MongoDB.Repository.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using queueitv2.Model;
using queueitv2.Model.DomainModel;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly QueueITContext _context = null;

        protected readonly IMongoCollection<T> DbSet;

        public Repository(QueueITContext context)
        {
            _context = context;
            DbSet = _context.GetCollection<T>(typeof(T).Name);
        }

        public virtual Task Add(T obj)
        {
            return _context.AddCommand(async () => await DbSet.InsertOneAsync(obj));
        }

        public virtual async Task<T> GetById(string id)
        {
            var data = await DbSet.FindAsync(Builders<T>.Filter.Eq("_id", id));
            return data.FirstOrDefault();
        }

        public virtual async Task<IEnumerable<T>> GetAll()
        {
            var all = await DbSet.FindAsync(Builders<T>.Filter.Empty);
            return all.ToList();
        }
        
        public virtual Task Remove(Guid id) => _context.AddCommand(() => DbSet.DeleteOneAsync(Builders<T>.Filter.Eq("_id", id)));
        
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }

    }
}
