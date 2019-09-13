using queueitv2.Model.DomainModel.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Model.DomainModel
{
    public class OutletImp : Outlet
    {
        public List<string> tellers { get; set; }

        public OutletImp(): base()
        {
            tellers = new List<string>();
        }
    }
}
