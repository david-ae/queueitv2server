using Core.MongoDB.Repository.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using queueitv2.Model;
using queueitv2.Model.DomainModel;
using queueitv2.Model.DomainModel.valueobjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Infrastructure
{
    public class QueueITContext : IMongoContext
    {
        public IMongoDatabase Database { get; set; }

        public IMongoClient Client { get; set; }

        private readonly List<Func<Task>> _commands;

        public QueueITContext(IOptions<Settings> settings)
        {
            var Client = new MongoClient(settings.Value.ConnectionString);
            if(Client != null)
            {
                Database = Client.GetDatabase(settings.Value.Database);
            }

            _commands = new List<Func<Task>>();

            RegisterConventions();
        }

        private void RegisterConventions()
        {
            var pack = new ConventionPack
            {
                new IgnoreExtraElementsConvention(true),
                new IgnoreIfDefaultConvention(true)
            };
            ConventionRegistry.Register("My Solution Conventions", pack, t => true);
        }

        public async Task<int> SaveChanges()
        {
            var commandCount = _commands.Count;
            foreach (var command in _commands)
            {
                await command();
            }

            _commands.Clear();
            return commandCount;
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            var collectionName = name.ToLower();
            return Database.GetCollection<T>(collectionName);
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }

        public Task AddCommand(Func<Task> func)
        {
            _commands.Add(func);
            return Task.CompletedTask;
        }        
    }
}
