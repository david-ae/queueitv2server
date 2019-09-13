using queueitv2.Model.DomainModel;
using queueitv2.Model.DomainModel.valueobjects;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2.Areas.Operations.Models
{
    public class ApiModels
    {
    }

    public class TransactionApiModel
    {
        public string Id { get; set; }
        public CustomerVO customerName { get; set; }
        public string platenumber { get; set; }
        public decimal amount { get; set; }
        public string transactionType { get; set; }
        public UserVO createdBy { get; set; }
        public DateTime timeSubmitted { get; set; }
        public DateTime? timeIssueFlagged { get; set; }
        public DateTime? timeCompleted { get; set; }
        public DateTime? timeRejected { get; set; }
        public string allocatedTime { get; set; }
        public string flaggedIssueBy { get; set; }
        public string rejectedBy { get; set; }
        public string completedBy { get; set; }
        public string returnedBy { get; set; }
        public string treatedBy { get; set; }
        public string status { get; set; }
        public string outletName { get; set; }

        public TransactionApiModel()
        {

        }
    }

    public class TransactionsUpdateApiModel
    {
        [Required]
        public string Id { get; set; }
        [Required]
        public CustomerVO customerName { get; set; }
        [Required]
        public string platenumber { get; set; }
        [Required]
        public decimal amount { get; set; }
        [Required]
        public string transactionType { get; set; }
        public UserVO createdBy { get; set; }

        public DateTime datecreated { get; set; }

        public DateTime timeSubmitted { get; set; }

        public DateTime? timeCompleted { get; set; }
                
        public DateTime? timeIssueFlagged { get; set; }
                
        public List<DateTime?> timeRejected { get; set; }

        public string allocatedTime { get; set; }

        public List<UserVO> flaggedIssueBy { get; set; }

        public List<UserVO> rejectedBy { get; set; }

        public UserVO completedBy { get; set; }

        public List<UserVO> returnedBy { get; set; }

        public List<UserVO> treatedBy { get; set; }

        public string status { get; set; }

        public string outletName { get; set; }

        public TransactionsUpdateApiModel() : base()
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
