using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Model.DomainModel.valueobjects
{
    public class UserVO
    { 
        [BsonElement("id")]
        public dynamic Identity { get; set; }
        public List<string> roles { get; set; }        
        public string lastname { get; set; }
        public string firstname { get; set; }
        public string email { get; set; }
        public string userType { get; set; }
        public bool isActive { get; set; }
        public string legacyId { get; set; }

        public UserVO()
        {
            roles = new List<string>();
        }
    }
}
