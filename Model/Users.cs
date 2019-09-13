
using Microsoft.AspNetCore.Identity.MongoDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Model
{
    public class Users : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserType { get; set; }
        public string legacyId { get; set; }
        public bool isActive { get; set; }
        public DateTime UpdatedOn { get; set; }
        public DateTime Datecreated { get; set; }
    }
}
