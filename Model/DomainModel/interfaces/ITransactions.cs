using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using queueitv2.Model.DomainModel.valueobjects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Model.DomainModel.interfaces
{
    [BsonIgnoreExtraElements]
    public abstract class ITransactions 
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string Id { get; set; }
        public CustomerVO customerName { get; set; }
        public string platenumber { get; set; }
        public decimal amount { get; set; }
        public string transactionType { get; set; }
        public UserVO createdBy { get; set; }

        [BsonIgnoreIfNull]
        [DefaultValue(null)]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime datecreated { get; set; }
    }
}
