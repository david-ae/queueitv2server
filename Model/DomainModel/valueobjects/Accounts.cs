using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Model.DomainModel.valueobjects
{
    public class Accounts
    {
        [BsonElement("_id")]
        public ObjectId Identity { get; set; }
        public string password { get; set; }
        public string username { get; set; }
        public string lastname { get; set; }
        public string firstname { get; set; }
        public List<string> roles { get; set; }

        public Accounts()
        {
            roles = new List<string>();
        }
    }
}
