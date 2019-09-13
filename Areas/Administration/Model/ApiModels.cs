using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Areas.Administration.Model
{
    public class ApiModels
    {
    }

    public class DateRangeApiModel
    {
        public TDate dateFrom { get; set; }
        public TDate dateTo { get; set; }
    }

    public class ManageRoleApiModel
    {
        public string email { get; set; }
        public string rolename { get; set; }
    }

    public class ManageUserApiModel
    {
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string email { get; set; }
        public string id { get; set; }
    }

    public class ChangePasswordApiModel
    {
        public string email { get; set; }
        public string newPassword { get; set; }
        public string confirmNewPassword { get; set; }
    }

    public class TDate
    {
        public string year { get; set; }
        public string month { get; set; }
        public string day { get; set; }
    }

    public class UserLoginApiModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RoleApiModel
    {
        public string Id { get; set; }
        public string name { get; set; }
    }

    public class StatusApiModel
    {
        public string Id { get; set; }
        public string name { get; set; }
    }

    public class TransactionTypeApiModel
    {
        public string Id { get; set; }
        public string name { get; set; }
    }
}
