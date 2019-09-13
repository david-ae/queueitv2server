using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Areas.Administration.Model
{
    public class ViewModels
    {
    }

    public class UserRoleViewModel
    {
        public string UserId { get; set; }
        public string RoleId { get; set; }
    }

    public class RegisterViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
    }
}
