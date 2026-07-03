namespace Tetra.API.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public void AppServiceCollections(IConfiguration configuration)
        {
            services.AddLocalization(options => { options.ResourcesPath = "Resources"; });
            services.AddControllers(options =>
            {
                options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
            }).AddDataAnnotationsLocalization();

            services.AddApplicationServiceCollection(configuration);
            services.AddInfrastructureServiceCollection(configuration);
            services.AddPersistenceServiceCollection(configuration);
            services.AddCorsPolicy();
            services.AddJwtAuthentication();
        }

        private void AddCorsPolicy()
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.WithOrigins(new[]
                        {
                            "http://localhost:5173"
                        })
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });
        }

        private void AddJwtAuthentication()
        {
            services.AddAuthentication(opt =>
                {
                    opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer();

            services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
                .Configure<IAppConfig>((opt, appConfig) =>
                {
                    var tokenOptions = appConfig.GetSection<TokenOptions>();

                    opt.SaveToken = true;
                    opt.RequireHttpsMetadata = false;

                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateAudience = tokenOptions.Validation.ValidateAudience,
                        ValidateIssuer = tokenOptions.Validation.ValidateIssuer,
                        ValidateLifetime = tokenOptions.Validation.ValidateLifetime,
                        ValidateIssuerSigningKey = tokenOptions.Validation.ValidateSigningKey,

                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(tokenOptions.SecurityKey)),

                        ValidIssuer = tokenOptions.Jwt.Issuer,
                        ValidAudience = tokenOptions.Jwt.Audience,

                        LifetimeValidator = (_, expires, _, _) => { return expires > DateTime.UtcNow; }
                    };

                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;

                            if(!string.IsNullOrEmpty(accessToken) &&
                               path.StartsWithSegments("/hubs"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        },
                        OnTokenValidated =
                            async context =>
                            {
                                var sessionId = context.Principal?
                                    .FindFirst("sessionId")?.Value;

                                if(string.IsNullOrWhiteSpace(sessionId))
                                {
                                    context.Fail("Session claim missing");
                                    return;
                                }

                                var sessionService = context.HttpContext
                                    .RequestServices
                                    .GetRequiredService<ISessionService>();

                                var isActive = await sessionService.ExistsActiveAsync(sessionId);

                                if(!isActive)
                                {
                                    context.Fail("Session revoked");
                                    return;
                                }

                                await sessionService.UpdateLastActivityAsync(sessionId);
                            },

                        OnChallenge = context =>
                        {
                            context.HandleResponse();

                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            context.Response.ContentType = "application/json";

                            var body = JsonSerializer.Serialize(new
                            {
                                Success = false,
                                StatusCode = 401,
                                Message = "Authorization is required.",
                                Data = (object?)null,
                                Errors = Array.Empty<string>()
                            });

                            return context.Response.WriteAsync(body);
                        }
                    };
                });
        }
    }
}