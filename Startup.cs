using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using Core.MongoDB.Repository.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity.MongoDB;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using queueitv2.Hubs;
using queueitv2.Infrastructure;
using queueitv2.Infrastructure.Repositories;
using queueitv2.Model;
using queueitv2.Extensions;
using Microsoft.AspNetCore.SpaServices.AngularCli;

namespace queueitv2
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddCors();
      services.AddSignalR();
      services.Configure<Settings>(options =>
      {
        options.ConnectionString = Configuration.GetSection("MongoConnection:ConnectionString").Value;
        options.Database = Configuration.GetSection("MongoConnection:Database").Value;
      });

      services.AddIdentityWithMongoStoresUsingCustomTypes<Users, IdentityRole>(
         Configuration.GetSection("MongoConnection:ConnectionString").Value + "/" +
         Configuration.GetSection("MongoConnection:Database").Value
         );

      services.AddTransient<IMongoContext, QueueITContext>();
      services.AddTransient<QueueITContext>();

      // ===== Add Jwt Authentication ========
      //JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // => remove default claims
      
      JWTTokenConfiguration.AddAuthentication(services, Configuration);
      services.AddTransient<IUnitOfWork, UnitOfWork>();
      services.AddTransient<UnitOfWork>();
      services.AddMvc();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      loggerFactory.AddFile("App_Log/Error_Log.txt");
      app.UseCors(
          options => options.WithOrigins(
            "http://localhost:4000",
            "https://localhost:5001",
            "http://localhost:56242",
            "https://localhost:44328",
            "http://queueit.autoreglive.com")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials()
      );

      //app.UseDefaultFiles();
      //app.UseStaticFiles();
      app.UseAuthentication();
      app.UseMvc(routes =>
      {
        routes.MapRoute(
                name: "default",
                template: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

      });
      app.UseSignalR(routes =>
      {
        routes.MapHub<MessageHub>("/message");
        routes.MapHub<TransactionHub>("/transactions");
      });
    }
  }
}
