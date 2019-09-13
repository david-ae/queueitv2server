using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Model
{
    public class QueueITRole : IdentityRole
    {
        public List<string> urls { get; set; }

        public QueueITRole()
        {
            urls = new List<string>();
        }
    }
}
