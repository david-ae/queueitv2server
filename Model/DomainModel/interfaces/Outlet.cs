using queueitv2.Model.DomainModel.valueobjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Model.DomainModel.interfaces
{
    public abstract class Outlet
    {
        public string name { get; set; }
        public AddressVO Address { get; set; }
        public UserVO createdBy { get; set; }
        public DateTime datecreated { get; set; }
    }
}
