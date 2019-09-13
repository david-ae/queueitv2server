using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using queueitv2.Model.DomainModel.interfaces;
using queueitv2.Model.DomainModel.valueobjects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Model.DomainModel
{
    [BsonIgnoreExtraElements]
    public class Transactions : ITransactions
    {
        [BsonIgnoreIfNull]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime timeSubmitted { get; set; }

        [BsonIgnoreIfNull]
        [DefaultValue(null)]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime? timeCompleted { get; set; }

        [BsonIgnoreIfNull]
        [DefaultValue(null)]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime? timeIssueFlagged { get; set; }

        [BsonIgnoreIfNull]
        [DefaultValue(null)]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        [BsonRepresentation(BsonType.DateTime)]
        public List<DateTime?> timeRejected { get; set; }

        public string allocatedTime { get; set; }

        [BsonIgnoreIfNull]
        [DefaultValue(null)]
        public List<UserVO> flaggedIssueBy { get; set; }

        [BsonIgnoreIfNull]
        [DefaultValue(null)]
        public List<UserVO> rejectedBy { get; set; }

        [BsonIgnore]
        [DefaultValue(null)]
        public UserVO completedBy { get; set; }

        [BsonIgnoreIfNull]
        [DefaultValue(null)]
        public List<UserVO> returnedBy { get; set; }

        [BsonIgnoreIfNull]
        [DefaultValue(null)]
        public List<UserVO> treatedBy { get; set; }

        public string status { get; set; }
        
        [BsonIgnoreIfNull]
        [DefaultValue(null)]
        public string outletName { get; set; }

        public Transactions(): base()
        {
            timeRejected = new List<DateTime?>();
            flaggedIssueBy = new List<UserVO>();
            rejectedBy = new List<UserVO>();
            treatedBy = new List<UserVO>();
            returnedBy = new List<UserVO>();
            //completedBy = new List<UserVO>();
        }
    }
}
