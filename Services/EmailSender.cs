using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using queueitv2server.Model.DomainModel.valueobjects;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace queueitv2server.Model.DomainModel.interfaces
{
    public class EmailSender
    {

        private IHostingEnvironment _env;
        public EmailSender(IConfiguration configuration, ILoggerFactory log, IHostingEnvironment env)
        {
            Configuration = configuration;
            _log = log.CreateLogger<EmailSender>();
            _env = env;
        }
        public Task SendEmailAsync(string email, string subject, string message)
        {
            return Execute(Configuration["SendGridKey"], subject, message, email);
        }

        public IConfiguration Configuration { get; }
        public ILogger _log { get; }

        public Task Execute(string apiKey, string subject, string message, string email)
        {
            var webRoot = _env.WebRootPath;
            var pathToFile = webRoot
                            + Path.DirectorySeparatorChar.ToString()
                            + "Emails"
                            + Path.DirectorySeparatorChar.ToString()
                            + "EmailTemplate.html";
            var builder = new BodyBuilder();
            using (StreamReader SourceReader = System.IO.File.OpenText(pathToFile))
            {
                builder.HtmlBody = SourceReader.ReadToEnd();
            }

            Email.DefaultRenderer = new RazorRenderer();

            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("apptest@autoreglive.com", "AutoReg Version Application"),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));

            //Disable click tracking.
            // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.TrackingSettings = new TrackingSettings
            {
                ClickTracking = new ClickTracking { Enable = true }
            };

            return client.SendEmailAsync(msg);
        }
    }
}
