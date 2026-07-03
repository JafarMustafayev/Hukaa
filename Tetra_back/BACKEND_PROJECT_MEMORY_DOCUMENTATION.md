# TETRA SOCIAL APPLICATION - BACKEND TEXNİKİ DOKUMENTASİYASI

Yaradılma Tarixi: 03.07.2026
Müəllif: Mustafayev Jafar
Layihə Runtime: .NET 10.0 (C#)
Memarlıq: Layered Clean Architecture (Laylı Təmiz Arxitektura)

Bu sənəd Tetra layihəsinin backend hissəsinin tam arxitekturasını, verilənlər bazası
strukturunu, təhlükəsizlik və autentifikasiya axınını, bütün API endpoint-lərini,
mövcud servis və repozitorilərini gələcəkdə rahat xatırlamaq və idarə etmək üçün
çox detallı şəkildə izah edir.

---

MÜNDƏRİCAT:

1. [Layihənin ümumi xülasəsi](#1-layi̇həni̇n-ümumi̇-xülasəsi̇)
2. [Texnologiyalar və kitabxanalar](#2-texnologi̇yalar-və-ki̇tabxanalar)
3. [Qovluq və fayl strukturu](#3-qovluq-və-fayl-strukturu)
4. [Arxitektura](#4-arxi̇tektura)
5. [Database və modellər](#5-database-və-modellər)
6. [Authentication və Authorization axını](#6-authentication-və-authorization)
7. [Bütün API Endpoint-ləri (Cədvəl və Detallı İzah)](#7-bütün-endpoint-lər)
8. [Servislər (Service Layer)](#8-servi̇slər-service-layer)
9. [Repozitorilər (Data Access Layer)](#9-repozi̇tori̇lər-data-access-layer)
10. [DTO, Request və Response modelləri](#10-dto-request-və-response-modelləri̇)
11. [Validasiya və Xətaların İdarə Olunması (Error Handling)](#11-vali̇dasi̇ya-və-xətalarin-i̇darə-olunmasi)
12. [Konfiqurasiya (appsettings.json)](#12-configuration-konfi̇qurasi̇ya)
13. [Xarici İnteqrasiyalar (External Integrations)](#13-external-integrations-xari̇ci̇-i̇nteqrasi̇yalar)
14. [Background Jobs / Scheduled Tasks](#14-background-jobs--scheduled-tasks)
15. [Fayl yüklənməsi və Statik fayllar](#15-fayl-yüklənməsi̇-və-stati̇k-fayllar-file-upload)
16. [Təhlükəsizlik qeydləri](#16-təhlükəsi̇zli̇k-qeydləri̇)
17. [Ən son yazılan və yarımçıq qalan hissələr](#17-ən-son-yazilan-və-yarimçiq-qalan-hi̇ssələr)
18. [Backend-in frontend-lə əlaqəsi](#18-backend-i̇n-frontend-lə-əlaqəsi̇)
19. [İşəsalma və Setup Təlimatları (Run & Setup)](#19-i̇şəsalma-və-setup-təli̇matlari-run--setup)
20. [Problemli və Diqqət Edilməli Hissələr](#20-problemli̇-və-di̇qqət-edi̇lməli̇-hi̇ssələr)
21. [Nəticə (Backend Memory Summary)](#21-nəti̇cə-backend-memory-summary)

---

## 1. LAYİHƏNİN ÜMUMİ XÜLASƏSİ

- Backend nə üçündür?
  Backend hissəsi, "Tetra" adlı sosial şəbəkə tətbiqinin bütün mərkəzi biznes
  məntiqlərini, istifadəçi autentifikasiyasını (qeydiyyat, giriş, iki-faktorlu
  təhlükəsizlik, sessiyaların idarə edilməsi), istifadəçi tənzimləmələri və profil
  məlumatlarının saxlanılmasını təmin edən təhlükəsiz REST API-dır. Layihə
  istifadəçi təhlükəsizliyini və sessiyaların izlənilməsini ön planda tutur.
- Backend frontendlə necə əlaqə qurur?
  Backend frontendlə tamamilə JSON formatında RESTful API vasitəsilə əlaqə qurur.
  CORS siyasəti xüsusi olaraq local mühitdə http://localhost:5173 (Vite + React)
  ünvanına icazə verir. API-dan qayıdan bütün cavablar standart bir obyekt
  formatındadır (ResponseDto):
  ```json
  {
    "Success": true/false,
    "StatusCode": 200/400/401/404/500,
    "Message": "Uğurlu və ya xəta mesajı",
    "Data": { ... }, // API tərəfindən qaytarılan əsas məlumatlar
    "Errors": [ "Xəta detalları..." ]
  }
  ```
  Autentifikasiya üçün HTTP sorğularının "Authorization" başlığında (Header)
  `Bearer <JWT_TOKEN>` formasında JWT istifadə olunur.

---

## 2. TEXNOLOGİYALAR VƏ KİTABXANALAR

Layihədə istifadə edilən əsas texnologiyalar və paketlər aşağıdakılardır:

- Framework və Runtime: .NET 10.0
- ASP.NET Core Identity: İstifadəçi qeydiyyatı, giriş, şifrə hash-lənməsi və
  şifrə sıfırlama kimi fundamental funksiyalar üçün istifadə edilir.
- Entity Framework Core (EF Core) & SQL Server: Database ORM aləti olaraq
  istifadə olunur. SQL Server verilənlər bazası ilə əlaqə qurur.
  - Microsoft.EntityFrameworkCore.SqlServer (v10.0.5)
  - Microsoft.EntityFrameworkCore.Design (v10.0.5)
- Microsoft.AspNetCore.Authentication.JwtBearer (v10.0.6): JWT (JSON Web Token)
  ilə gələn istifadəçi tokenlərinin doğrulanması və qorunan endpoint-lərin
  mühafizəsi üçün.
- Microsoft.AspNetCore.OpenApi (v10.0.5): API-nin OpenAPI formatında
  sənədləşdirilməsi üçün.
- StackExchange.Redis (v3.0.47-preview): Redis üzrədə caching, iki-faktorlu
  autentifikasiya cəhdlərinin limitlənməsi və 2FA giriş challenge-lərinin
  saxlanılması üçün mühüm rola malikdir.
- Otp.NET (v1.4.1): İki-faktorlu autentifikasiya (TOTP) zamanı Google Authenticator
  kimi proqramlar tərəfindən yaradılan 6 rəqəmli birdəfəlik kodların backend
  tərəfdən yoxlanılması üçün.
- AutoMapper (v16.1.1): Entity sinifləri ilə DTO sinifləri arasında avtomatik
  məlumat köçürülməsi (mapping) proseslərini sadələşdirmək üçün.
- FluentValidation (v11.3.1 və v12.1.1): Request modellərinin biznes
  qaydalarına və uzunluq/tələb limitlərinə uyğun olub-olmadığını yoxlamaq üçün.
  ASP.NET Core modeli ilə avtomatik inteqrasiya edilib (AutoValidation).

## 3. QOVLUQ VƏ FAYL STRUKTURU

Layihə Clean Architecture prinsiplərinə uyğun olaraq 5 fərqli layihəyə (qovluğa)
bölünüb:

- Tetra.API (Presentation Layer)
  - Controller-lər, Middleware-lər və tətbiqin başlanğıc konfiqurasiyaları buradadır.
  - Əsas qovluqlar:
    - Controllers/: API-nin bütün xarici giriş nöqtələri.
    - Extensions/: Servislərin DI container-ə yığılması (ServiceCollectionExtensions.cs)
      və HTTP pipeline sazlamaları (ApplicationBuilderExtensions.cs).
    - Middlewares/: Exception-ları qlobal tutan ExceptionHandlingMiddleware.cs.
  - Əsas fayllar: Program.cs, appsettings.json, appsettings.Development.json,
    appsettings.Production.json.

- Tetra.Application (Core / Application Layer)
  - Biznes məntiqinin interfeysləri, DTO-lar, mapping profilləri və validatorlar buradadır.
  - Əsas qovluqlar:
    - Abstractions/: Repository və Service interfeysləri.
    - DTOs/: Request və Response modelləri (Account, Auth, Profile, Wrappers qovluqları).
    - Mappings/: AutoMapper profilləri (UserProfile, Session və Auth üçün).
    - Validators/: FluentValidation qaydaları.
    - Options/: appsettings.json-dan oxunan konfiqurasiya sinifləri (Identity, Token, Mail və s.).
    - Exceptions/: Biznes xətaları üçün xüsusi exception sinifləri (AppException.cs və s.).
    - Resources/: Çoxdillilik üçün `.resx` resurs faylları.

- Tetra.Domain (Core / Domain Layer)
  - Heç bir digər laydan asılı olmayan, layihənin nüvəsini təşkil edən hissədir.
  - Əsas qovluqlar:
    - Entities/: Verilənlər bazası cədvəllərinin əsas C# modelləri:
      `User`
      `Role`
      `UserProfile`
      `UserPreferences`
      `UserPrivacySettings`
      `UserNotificationSettings`
      `AuthSession`
      `RefreshToken`
      `VerificationToken`
      `TwoFactorRecoveryCode`

    - Enums/: Sistem daxili enumlar:
      `Gender`
      `LastSeenVisibility`
      `MessagePermission`
      `NotificationType`
      `Theme`
      `TwoFactorProvider`
      `UserStatus`
      `VerificationTokenPurpose`
      `VerificationTokenRevocationReason`

    - Consts/: Dil və Rol konstantları.

- Tetra.Infrastructure (External Services Layer)
  - Application layında təyin edilmiş xidmət interfeyslərinin real implementasiyaları.
  - Əsas qovluqlar:
    - Services/:
      `AuthService`
      `SessionService`
      `ProfileService`
      `TwoFactorService`
      `MailSender`
      `MailService`
      `ClientUrlService`

    - Common/:
      `ClientIpResolver`
      `JwtClaimsReader`
      `LocalizationService`
      `RedisCacheService`
      `TokenHasher`
      `UserAgentParser`

- Tetra.Persistence (Data Access Layer)
  - Verilənlər bazası əlaqəsi, repozitorilər və miqrasiyalar buradadır.
  - Əsas qovluqlar:
    - Context/: AppDbContext.cs (Entity Framework DbContext sinfi).
    - Configurations/: Cədvəllərin Fluent API qaydaları və Fluent əlaqələri.
    - Repositories/: Generic Read/Write repozitorilərin real implementasiyaları.
    - Migrations/: Verilənlər bazası sxeminin dəyişiklik tarixçəsi.
    - Seed/: RoleSeed.cs (Sistem rollarını ilkin olaraq bazaya yazan skript).

- Proqramın Pipeline və Konfiqurasiyaları (Program.cs):
  - builder.Services.AppServiceCollections(builder.Configuration) vasitəsilə
    bütün layların servis qeydiyyatları aparılır.
  - App local mühitdə işə düşərkən if(app.Environment.IsDevelopment()) daxilində
    RoleSeed.SeedAsync metodu çağırılaraq "User", "Admin" və "Moderator" rolları
    bazaya əlavə edilir.
  - app.UseMiddleware<ExceptionHandlingMiddleware>() ən yuxarıda duraraq
    bütün HTTP xətalarını qlobal formatda tutur.

## 4. ARXİTEKTURA

Layihə "Laylı Təmiz Arxitektura" (Clean Architecture) prinsiplərinə əsaslanır.
Biznes məntiqi layihənin mərkəzindədir və xarici kitabxanalardan asılı deyil.

- Hər bir layın rolu:
  - Controller: Sorğunu qəbul edir, Validator-lar vasitəsilə doğruluğunu yoxlayır,
    biznes servisini çağırır və standart ResponseDto qaytarır.
  - Service: Biznes məntiqini icra edir. Məsələn, istifadəçi qeydiyyatı zamanı
    şifrənin yoxlanılması, verification token yaradılması və email göndərilməsi
    prosesini koordinasiya edir.
  - Repository: Yalnız verilənlər bazasına sorğu göndərmək və məlumatı gətirməklə
    məşğuldur. Biznes qaydalarından xəbərsizdir.
  - DTO: Client (frontend) ilə backend arasında daşınan məlumat strukturudur.
  - Entity: Bazadakı cədvəllərin birbaşa qarşılığıdır.
  - Mapper: Request modelini Entity-yə və ya Entity-ni Response DTO modelinə
    çevirir.
  - Validator: Daxil olan parametr formatlarını (məs. şifrə uzunluğu, email formatı)
    yoxlayır.

- Dependency Injection (DI) necə qurulub?
  - Xidmətlər "Scoped" və ya "Singleton" ömür müddəti ilə DI konteynerinə əlavə olunur.
  - Repozitorilər (Read və Write olaraq ayrılıb) hər entity üçün ayrı interface
    olaraq Scoped qeydiyyatdan keçib.
  - Verilənlər bazası əməliyyatlarının tranzaksion bütövlüyü IUnitOfWork interfeysi
    və UnitOfWork implementasiyası ilə təmin edilir.

- Request Flow (Sorğu Axını):
  İstifadəçi Sorğusu -> Controller -> Service -> Repository -> EF Core -> SQL Server Database
  Sorğu geri qayıdanda:
  SQL Server -> Repository (Entity formatında) -> Service (AutoMapper ilə DTO-ya çevrilir)
  -> Controller -> Client (Standart JSON ResponseDto formatında).

## 5. DATABASE VƏ MODELLƏR

- Database Texnologiyası: SQL Server (Verilənlər bazası) və Redis (Müvəqqəti
  məlumatlar, setup və giriş cəhd limitləri üçün cache).
- DbContext: AppDbContext.cs sinfi IdentityDbContext<User, Role, string> sinfindən
  törəyir. `UserPreferences` DbSet kimi explicitly qeyd edilib, digər modellər isə
  `ApplyConfigurationsFromAssembly` metodu ilə avtomatik konfiqurasiya edilir və
  bazaya yansıyır.

- Entity modelləri və əlaqələri:
  1. User (AspNetUsers cədvəli)
     - ASP.NET Core Identity istifadəçisini təmsil edir.
     - Əlaqələr:
       - UserProfile ilə 1-to-1 əlaqə (Cascade)
       - UserPreferences ilə 1-to-1 əlaqə (Cascade)
       - UserPrivacySettings ilə 1-to-1 əlaqə (Cascade)
       - UserNotificationSettings ilə 1-to-Many əlaqə (Cascade)
       - AuthSession ilə 1-to-Many əlaqə (Cascade)
       - VerificationToken ilə 1-to-Many əlaqə (Cascade)
       - TwoFactorRecoveryCode ilə 1-to-Many əlaqə (Cascade)

  2. UserProfile (UserProfiles cədvəli)
     - İstifadəçinin fərdi məlumatlarını (FirstName, LastName, Birthday, Gender,
       ProfileImageUrl, CoverImageUrl, Bio, Website) saxlayır.
     - Əlaqə: User ilə 1-to-1 (UserId xarici açarı ilə).

  3. UserPreferences (UserPreferences cədvəli)
     - Sistem üstünlüklərini (AccentHue, Theme, Language) saxlayır.
     - Əlaqə: User ilə 1-to-1. Default olaraq Language = "en", Theme = "System",
       AccentHue = 200.

  4. UserPrivacySettings (UserPrivacySettings cədvəli)
     - Məxfilik tənzimləmələri (MessagePermission, ReadReceiptEnabled,
       InvisibleBrowsingEnabled, ActivityStatusEnabled, LastSeenVisibility).
     - Əlaqə: User ilə 1-to-1.

  5. UserNotificationSettings (UserNotificationSettings cədvəli)
     - Hər bir bildiriş növü üçün (NotificationType) email və push bildirişlərinin
       aktivliyini saxlayır.
     - Əlaqə: User ilə 1-to-Many. (UserId, Type) cütlüyü unikaldır.

  6. AuthSession (AuthSessions cədvəli)
     - İstifadəçinin aktiv giriş sessiyalarını izləyir. Cihaz tipi, IP-si, OS,
       Browser və son aktivlik tarixini saxlayır.
     - Əlaqə: User ilə 1-to-Many. RefreshToken-lərlə 1-to-Many.

  7. RefreshToken (RefreshTokens cədvəli)
     - JWT-ni yeniləmək üçün istifadə olunan tokenlər. TokenHash, ExpiresAt,
       IsUsed, IsRevoked kimi sahələri var.
     - Əlaqə: AuthSession ilə Many-to-1.

  8. VerificationToken (VerificationTokens cədvəli)
     - Email təsdiqi, şifrə sıfırlama kimi əməliyyatlar üçün birdəfəlik tokenlər.
     - Əlaqə: User ilə 1-to-Many.

  9. TwoFactorRecoveryCode (TwoFactorRecoveryCodes cədvəli)
     - 2FA aktiv edildikdə generasiya edilən 10 ədəd ehtiyat bərpa kodudur.
     - Əlaqə: User ilə 1-to-Many.

- Migration və Verilənlər Bazası Sxemi:
  Bazadakı əsas cədvəllər ASP.NET Identity standart cədvəlləri ilə başlayır və
  miqrasiyalar vasitəsilə genişləndirilib. Sxemdə `VerificationTokens`, `AuthSessions`
  və `RefreshTokens` cədvəllərində unikal index-lər və xarici açarlar (FK) qurulub.
  Sistem rolları ("Admin", "User", "Moderator") ilkin olaraq verilənlər bazasına
  avtomatik yüklənir (Seed Data).

## 6. AUTHENTICATION VƏ AUTHORIZATION

- Qeydiyyat və Giriş (Login/Register) axını:
  - Qeydiyyatdan sonra əgər email təsdiqi tələb olunursa (`RequireConfirmedEmail = true`),
    istifadəçi statusu `PendingVerification` olur və mailinə link göndərilir.
  - Giriş zamanı şifrə yoxlanılır. Əgər 2FA aktivdirsə, sistem istifadəçiyə token
    vermir, əvəzində 2FA Challenge yaradır və Redis-də `2fa:login:challenge:{challengeId}`
    altında saxlayır (15 dəqiqəlik). Frontend bu `ChallengeId`-ni alaraq 2FA
    ekranına yönləndirir.
  - Kod və ya bərpa kodu təsdiqlənəndən sonra sessiya yaradılır və istifadəçiyə
    Access/Refresh tokenləri qaytarılır.

- JWT Yaradılması və Təsdiqlənməsi:
  - Access Token 3 saatlıq yaradılır (appsettings.Development.json daxilində).
    İçərisində istifadəçinin ID-si (`sub`), Sessiya ID (`sessionId`), JTI və rolları
    saxlanılır.
  - Hər API sorğusunda token yoxlanılarkən `OnTokenValidated` hadisəsi işə düşür:
    Sessiya ID vasitəsilə `AuthSessions` cədvəlindən sessiyanın hələ də aktiv olub-olmadığı
    yoxlanılır. Əgər sessiya ləğv edilibsə (Revoked), sorğu 401 qaytarır.
  - Sessiya aktivdirsə, istifadəçinin `LastActivityAt` sahəsi cari zamanla yenilənir.

- Refresh Token Axını:
  - Refresh Token 7 günlük yaradılır. Rotation siyasəti aktivdir (`RotateOnUse: true`).
    Hər refresh sorğusunda köhnə token işlənmiş (`IsUsed = true`) olaraq işarələnir
    və yerinə yeni Refresh Token yaradılır.
  - Əgər artıq istifadə olunmuş köhnə token yenidən istifadə edilməyə cəhd olunarsa,
    sistem reuse aşkarlayır (`RevokeOnReuse`).

## 7. BÜTÜN ENDPOINT-LƏR

Aşağıdakı cədvəldə backend daxilindəki bütün endpoint-lər ümumiləşdirilmişdir:

| HTTP Method | Route                              | Controller/Action                   | Auth? | Toxunduğu Entity-lər            | Status      |
| ----------- | ---------------------------------- | ----------------------------------- | ----- | ------------------------------- | ----------- |
| GET         | api/account/me                     | Account.GetMe                       | Bəli  | User, Profile, Preferences      | Hazırdır    |
| GET         | api/account/check-email            | Account.CheckEmail                  | Xeyr  | User                            | Hazırdır    |
| GET         | api/account/check-username         | Account.CheckUsername               | Xeyr  | User                            | Hazırdır    |
| PATCH       | api/account/username               | Account.ChangeUsername              | Bəli  | User                            | Hazırdır    |
| PATCH       | api/account/emailAddress           | Account.ChangeEmailAddress          | Bəli  | User, VerificationToken         | Hazırdır    |
| POST        | api/auth/register                  | Auth.Register                       | Xeyr  | User, Profile, Settings         | Hazırdır    |
| POST        | api/auth/login                     | Auth.Login                          | Xeyr  | User, AuthSession, RefreshToken | Hazırdır    |
| POST        | api/auth/refresh-token             | Auth.RefreshToken                   | Xeyr  | RefreshToken, AuthSession       | Hazırdır    |
| POST        | api/auth/logout                    | Auth.Logout                         | Bəli  | AuthSession, RefreshToken       | Hazırdır    |
| POST        | api/auth/login/2fa                 | Auth.LoginWithTwoFactor             | Xeyr  | User, AuthSession, RefreshToken | Hazırdır    |
| POST        | api/auth/login/recovery            | Auth.LoginWithRecoveryCode          | Xeyr  | User, RecoveryCode, Session     | Hazırdır    |
| POST        | api/auth/emailverification/confirm | EmailVerification.ConfirmationEmail | Xeyr  | User, VerificationToken         | Hazırdır    |
| POST        | api/auth/emailverification/resend  | EmailVerification.ConfirmationEmail | Xeyr  | User, VerificationToken         | Hazırdır    |
| POST        | api/auth/password/forgot-password  | Password.ForgotPassword             | Xeyr  | User, VerificationToken         | Hazırdır    |
| POST        | api/auth/password/reset-password   | Password.ResetPassword              | Xeyr  | User, VerificationToken         | Hazırdır    |
| POST        | api/auth/password/change-password  | Password.ChangePassword             | Bəli  | User                            | Hazırdır    |
| GET         | api/auth/session                   | Session.GetMyActiveSessions         | Bəli  | AuthSession                     | Hazırdır    |
| DELETE      | api/auth/session/{sessionId}       | Session.DeleteSession               | Bəli  | AuthSession, RefreshToken       | Hazırdır    |
| POST        | api/auth/session/revoke-others     | Session.RevokeOthers                | Bəli  | AuthSession, RefreshToken       | Hazırdır    |
| GET         | api/settings/profile               | Settings.GetProfileData             | Bəli  | UserProfile                     | Hazırdır    |
| PATCH       | api/settings/profile               | Settings.UpdateProfileAsync         | Bəli  | UserProfile                     | Yarımçıq \* |
| GET         | api/auth/2fa/status                | TwoFactorAuth.GetTwoFactorStatus    | Bəli  | User, TwoFactorRecoveryCode     | Hazırdır    |
| POST        | api/auth/2fa/setup                 | TwoFactorAuth.SetupAuthenticator    | Bəli  | User                            | Hazırdır    |
| POST        | api/auth/2fa/enable                | TwoFactorAuth.VerifyAndEnable       | Bəli  | User, TwoFactorRecoveryCode     | Hazırdır    |
| POST        | api/auth/2fa/regenerate            | TwoFactorAuth.GenerateRecoveryCodes | Bəli  | User, TwoFactorRecoveryCode     | Hazırdır    |
| POST        | api/auth/2fa/disable               | TwoFactorAuth.DisableAuthenticator  | Bəli  | User, TwoFactorRecoveryCode     | Hazırdır    |

- Qeyd (Yarımçıq \*): settings/profile endpoint-ində profil şəkli və üzlük şəkli
  yükləmək üçün C# kodunda IFormFile qəbul edilir, lakin faylın saxlanılması və
  URL-in yazılması hissəsi hələ yazılmayıb (TODO olaraq qalıb).

- Endpoint-lərin detallı izahı:
  - Account.GetMe: Cari giriş etmiş istifadəçinin baza profili və sistem
    üstünlüklərini (dil, tema, rəng tonu) gətirir. Frontend tətbiq açılarkən
    istifadəçi kontekstini doldurmaq üçün istifadə edir.
  - Account.ChangeEmailAddress: Hazırda bu endpoint parolu təsdiqlədikdən sonra
    yeni emaili qəbul edir və hər hansı email təsdiqi göndərmədən birbaşa
    istifadəçinin email ünvanını yeniləyir. Təhlükəsizlik baxımından buraya
    gələcəkdə iki addımlı təsdiq əlavə edilməsi tövsiyə olunur.
  - Auth.Login: Email/Username və Şifrə yoxlanılır. Əgər uğurludursa və 2FA
    aktiv deyilsə, tokenlər yaradılır. 2FA aktivdirsə, `RequiresTwoFactor = true`
    və müvəqqəti `ChallengeId` qaytarılır.
  - Session.DeleteSession: İstifadəçi aktiv sessiyalar siyahısından hər hansı
    cihazı sistemdən çıxarmaq istədikdə işləyir. Cari aktiv sessiyanı ləğv
    etməyə icazə vermir (onun üçün logout endpointi çağırılmalıdır).

## 8. SERVİSLƏR (SERVICE LAYER)

Biznes məntiqi tamamilə Application və Infrastructure laylarında cəmlənib:

- AccountService
  - Cari istifadəçi məlumatlarını gətirir (`GetCurrentUserAsync`), email və
    istifadəçi adının unikal olub-olmadığını yoxlayır (`CheckEmailAvailabilityAsync`,
    `CheckUsernameAvailabilityAsync`). Username və email dəyişmə əməliyyatlarını icra edir.
    Toxunduğu entity: User.

- PasswordManagementService
  - Şifrəmi unutdum prosesini idarə edir (`ForgotPasswordAsync` - şifrə sıfırlama
    tokeni yaradır və mail atır), şifrə sıfırlayır (`ResetPasswordAsync` - tokeni
    yoxlayıb yeni şifrəni təyin edir) və şifrə dəyişir (`ChangePasswordAsync`).
    Toxunduğu entity: User, VerificationToken.

- AuthService
  - Sistemə qeydiyyat (`RegisterAsync` - istifadəçini yaradır, standart rolları və
    profil, üstünlük cədvəllərini doldurur), sistemə giriş (`LoginAsync`),
    token yeniləmə (`RefreshTokenAsync`), 2FA ilə giriş (`LoginWithTwoFactorAsync`)
    və bərpa kodu ilə giriş əməliyyatlarını icra edir.

- SessionService
  - Sessiya yaradılması (`CreateSessionAsync`), sessiyaların ləğvi, limitlərin
    yoxlanılması biznes məntiqini saxlayır. Giriş edən cihazın User-Agent-ini
    oxuyaraq analiz edir və cihaz haqqında məlumatı JSON formatında saxlayır.

- TwoFactorService
  - TOTP iki-faktorlu qorunma statusunu gətirir. Setup prosesində Redis üzərində
    müvəqqəti açarlar saxlayır. Təsdiqləndikdən sonra 10 ədəd bərpa kodu yaradır
    və hər birini şifrələnmiş şəkildə bazaya yazır. OTP cəhdlərini limitləmək üçün
    cəhd sayını Redis-də saxlayır və çox sayda uğursuz cəhddə müvəqqəti bloklayır.

- VerificationTokenService
  - Email təsdiqi və şifrə yeniləmə kimi proseslər üçün kriptoqrafik olaraq
    təhlükəsiz, təsadüfi birdəfəlik tokenlər yaradır. Tokenlərin hash-lərini
    verilənlər bazasında saxlayır, müddəti bitdikdə və ya yenisi göndərildikdə
    köhnələri avtomatik ləğv (Supersede) edir.

- MailService & MailSender
  - SmtpOptions parametrləri ilə SMTP vasitəsilə HTML formatında təsdiq və
    şifrə sıfırlama maillərini göndərir.

## 9. REPOZİTORİLƏR (DATA ACCESS LAYER)

Sistemdə Generic Repository pattern tətbiq olunub. Oxuma və Yazma repozitoriləri
təhlükəsizlik və performans məqsədilə ayrılıb (ReadRepository və WriteRepository):

- Base Repozitorilər:
  - IReadRepository<T> & ReadRepository<T>: Bazadan yalnız məlumat oxumaq üçündür.
    Default olaraq sorğuları sürətləndirmək üçün `.AsNoTracking()` istifadə edir.
    Ehtiyac olduqda xarici əlaqələri gətirmək üçün `includes` qəbul edir.
  - IWriteRepository<T> & WriteRepository<T>: Bazaya yazmaq, yeniləmək və silmək
    əməliyyatlarını icra edir.

- Hər bir entity üçün xüsusi Repozitorilər:
  Məsələn, `IVerificationTokenReadRepository` / `VerificationTokenReadRepository`
  Generic metodlardan əlavə özünəməxsus `GetByHashAndPurposeAsync` və
  `GetActiveTokenAsync` metodlarını təqdim edir. Bütün digər verilənlər bazası
  cədvəlləri (Sessions, RefreshTokens, UserProfiles və s.) eyni qayda ilə
  təcrid edilib.

## 10. DTO, REQUEST VƏ RESPONSE MODELLƏRİ

API-nin qəbul etdiyi və qaytardığı bütün məlumatlar ciddi şəkildə DTO sinifləri
vasitəsilə idarə olunur. Əsas DTO-lar:

- CurrentUserDto: İstifadəçinin əsas profili, avatarı, dili, teması və admin
  olub-olmaması məlumatını saxlayır.
- LoginResponseDto: Giriş uğurlu olduqda tokenləri və ya 2FA tələb olunursa
  challenge məlumatını ötürür.
- UpdateUserProfileRequestDto: İstifadəçinin profilini yeniləmək üçün göndərdiyi
  məlumat. Buraya fəaliyyət şəkli olaraq `IFormFile` (ProfileImage, CoverImage)
  daxildir.
- DTO ilə Entity fərqi: DTO-lar verilənlər bazası əlaqələrini və şifrə kimi
  həssas məlumatları özündə saxlamır, yalnız frontendin ehtiyac duyduğu məlumat
  strukturlarını daşıyır.

## 11. VALİDASİYA VƏ XƏTALARIN İDARƏ OLUNMASI

- Validasiya harada və necə edilir?
  Validasiya FluentValidation kitabxanası vasitəsilə həyata keçirilir. Hər bir
  request üçün Validator sinfi təyin edilib. Validatorlar validasiya limitlərini
  (məsələn, şifrə uzunluğu, adın boş olmaması) birbaşa `appsettings.json`-da
  müəyyən edilmiş `ValidationOptions` bölməsindən oxuyur. Bu da kod dəyişdirilmədən
  validasiya limitlərini dəyişməyə imkan verir.
  Əgər daxil olan sorğu validasiyadan keçməsə, API avtomatik olaraq 400 Bad Request
  və xəta siyahısını ResponseDto formatında qaytarır.

- Global Exception Handler:
  `ExceptionHandlingMiddleware.cs` tətbiqdə baş verən hər bir xətanı (Exception)
  tutur.
  - Əgər xəta biznes məntiqi tərəfindən atılan xüsusi `AppException`-dırsa
    (məsələn: `NotFoundException`, `ConflictException`, `TooManyRequestsException`),
    onun status kodunu (404, 409, 429) və biznes mesajını götürərək cavab olaraq qaytarır.
  - Əgər gözlənilməz bir xəta baş veribsə, sistem bunu 500 Internal Server Error
    olaraq qəbul edir və istifadəçiyə detallı daxili xətanı göstərmədən qlobal
    mesaj qaytarır.

## 12. CONFIGURATION (KONFİQURASİYA)

Bütün sistem konfiqurasiyaları appsettings.json və onun mühit fayllarında
(Development, Production) saxlanılır:

- Connection Strings:
  - `DatabaseOptions:SqlServerConnectionString`: SQL Server-ə qoşulma linki.
  - `DatabaseOptions:RedisConnectionString`: Redis cache server qoşulma linki.
- JWT Config (`TokenOptions`):
  - `SecurityKey`: JWT tokenlərini imzalamaq üçün istifadə olunan gizli açar.
  - `Jwt:Issuer`: Tokeni verən tərəf (TetraApi).
  - `Jwt:Audience`: Tokeni istifadə edən tərəf (TetraClient).
  - Token Ömürləri (`Lifetime`): AccessToken (3 saat), RefreshToken (7 gün),
    EmailConfirmationToken (1 saat) və s.
- SMTP Config (`SmtpOptions`):
  - SMTP server parametrləri (Host, Port, Username, Password, UseSsl) - e-maillərin
    göndərilməsi üçün.
- Client Config (`ClientOptions`):
  - Frontend-in əsas ünvanı (`BaseUrl`) və email/parol təsdiq səhifələrinin yolları
    (Paths) - e-maillərdə gedən linklərin düzgün qurulması üçün.

## 13. EXTERNAL INTEGRATIONS (XARİCİ İNTEQRASİYALAR)

- SMTP Mail İnteqrasiyası:
  Sistem default olaraq mail göndərmək üçün SmtpClient istifadə edir. Local mühitdə
  maillərin test edilməsi üçün "MailTrap" (sandbox.smtp.mailtrap.io) xidməti
  quraşdırılıb. `ForgotPassword` və `Register` axınları mail göndərir.

## 14. BACKGROUND JOBS / SCHEDULED TASKS

- Hal-hazırda layihədə heç bir background job mexanizmi (Hangfire, Quartz, HostedService)
  yoxdur. Gələcəkdə maillərin növbəli şəkildə göndərilməsi üçün RabbitMQ və ya
  HostedService əlavə edilməsi planlaşdırılır (TODO şərhlərində qeyd olunub).

## 15. FAYL YÜKLƏNMƏSİ VƏ STATİK FAYLLAR (FILE UPLOAD)

- Sistemdə hazırda fiziki olaraq diskə fayl yükləmə və ya Cloud storage-ə
  (S3, Azure Blob) yükləmə funksionallığı yazılmayıb.
- `SettingsController.PATCH("profile")` endpoint-i `ProfileImage` və `CoverImage`
  olaraq `IFormFile` qəbul edir, lakin `ProfileService` daxilində bu faylları
  qeyd etmək üçün heç bir kod yazılmayıb. Burası növbəti mərhələdə yazılacaq
  yarımçıq hissələrdən biridir.

## 16. TƏHLÜKƏSİZLİK QEYDLƏRİ

- Token ilə qorunan endpoint-lər: `[Authorize]` attributu olan bütün endpoint-lər.
  Həmçinin JWT validation zamanı sessiya doğrulaması (`ISessionService.ExistsActiveAsync`)
  istifadə olunduğu üçün, oğurlanmış tokenlər asanlıqla admin tərəfindən və ya
  istifadəçi digər sessiyaları ləğv etdikdə deaktiv edilir.
- Public endpoint-lər: Giriş, Qeydiyyat, Şifrə sıfırlama, Email təsdiqləmə,
  istifadəçi adı/email mövcudluq yoxlamaları.
- Şifrə Həşlənməsi: ASP.NET Core Identity standart olaraq şifrələri PBKDF2 ilə
  təhlükəsiz şəkildə hash-ləyərək saxlayır.
- Potensial Təhlükəsizlik Riskləri:
  - Şifrə dəyişmə və email dəyişmə zamanı istifadəçinin cari şifrəsi yoxlanılır,
    lakin email dəyişdirildikdən sonra yeni emailə heç bir təsdiq linki göndərilmədən
    birbaşa təsdiq edilmiş hesab olunur. Bu gələcəkdə təhlükə yarada bilər.
  - Secret key konfiqurasiyaları local Development mühiti üçün appsettings-də
    açıq yazılıb, lakin Production mühiti üçün maskalanıb (`****`). Production
    mühitində bunların Environment Variables (və ya Azure Key Vault) vasitəsilə
    ötürülməsi mütləqdir.

## 17. ƏN SON YAZILAN VƏ YARIMÇIQ QALAN HİSSƏLƏR

- Ən son yazılan hissələr (Git Commit Analizi):
  - Son dəyişikliklərdə Profil məlumatlarının gətirilməsi və yenilənməsi axını
    təkmilləşdirilib (`ProfileService.cs`, `UserProfileMappingProfile.cs`).
  - Həmçinin bir-birinə bağlı olan `UserPreferences`, `UserProfile`,
    `UserPrivacySettings` modelləri üçün miqrasiyalar yazılıb və bazadakı
    köhnə `RelationshipStatus` enum tipli lazımsız sütunlar təmizlənib.
  - Sessiya və Account controller-lərindəki qorunan endpoint-lərə təhlükəsizlik
    üçün `[Authorize]` attributu əlavə edilib.

- Yarımçıq qalan və TODO hissələr:
  1. `ProfileService.cs` (Sətir 25): Profil və üzlük şəkillərinin yüklənərək
     URL olaraq yaddaşa yazılması məntiqi yazılmalıdır.
  2. `AuthTokenService.cs` (Sətir 121): Sessiya ləğv edildikdə və ya token
     yeniləndikdə köhnə Refresh Token-in Redis blacklist-inə əlavə olunması lazımdır.
  3. `EmailVerificationService.cs` (Sətir 52) və `AuthService.cs` (Sətir 66):
     Email təsdiq və şifrə sıfırlama maillərinin birbaşa sinxron SMTP vasitəsilə
     göndərilməsi əvəzinə, Message Queue (RabbitMQ) vasitəsilə asinxron növbəyə
     atılması təmin olunmalıdır.

## 18. BACKEND-İN FRONTEND-LƏ ƏLAQƏSİ

Frontend layihəsi (React + Tailwind CSS) bu API-dan aşağıdakı funksiyalar üçün istifadə edir:

- İki-faktorlu autentifikasiya ekranları (`api/auth/2fa/*` endpointləri ilə).
- İstifadəçi parametrləri səhifəsi (`api/settings/profile` və `api/account/*` vasitəsilə).
- Giriş, qeydiyyat, şifrə sıfırlama və aktiv cihazları/sessiyaları idarəetmə paneli.
  Sistemdə `services.AddOpenApi()` yazılsa da, proqramda Swagger UI və ya OpenAPI-ni
  paylaşmaq üçün endpoint render-i (MapOpenApi) quraşdırılmayıb. Bu səbəbdən
  frontend developers API-nı birbaşa test edə bilmirlər.

## 19. İŞƏSALMA VƏ SETUP TƏLİMATLARI (RUN & SETUP)

- Tələblər:
  - .NET 10.0 SDK
  - Local MS SQL Server (SQLEXPRESS)
  - Local Redis Server (port 6379)
  - SMTP Test aləti (məsələn MailTrap hesabı)

- Addım-addım Setup:
  1. Layihənin qovluğuna daxil olun.
  2. `appsettings.Development.json` faylındakı `SqlServerConnectionString` və
     `RedisConnectionString` hissələrinin local serverinizlə uyğunluğunu yoxlayın.
  3. Database-i yaratmaq və miqrasiyaları tətbiq etmək üçün Terminalda
     `Tetra.Persistence` layihəsinin yerləşdiyi yerdən və ya layihənin kök qovluğundan
     aşağıdakı əmri icra edin:
     dotnet ef database update --project Tetra.Persistence --startup-project Tetra.API
  4. Layihəni işə salın:
     dotnet run --project Tetra.API
  5. API standart olaraq HTTPS profili ilə işə düşəcək və sorğuları qəbul edəcək.

## 20. PROBLEMLİ VƏ DİQQƏT EDİLMƏLİ HİSSƏLƏR

- Şəkillərin yüklənməməsi:
  İstifadəçi profilini yeniləyəndə göndərilən şəkillər itir, çünki backend-də
  faylı yadda saxlayan heç bir xidmət yoxdur.
- Redis Blacklisting çatışmazlığı:
  Ləğv edilən Refresh Token-lər hələ də Redis blacklist-ə yazılmır, sadəcə SQL-də
  Statusu yenilənir. Bu da yüksək yük altında bazaya lazımsız müraciətləri artırır.

## 21. NƏTİCƏ (BACKEND MEMORY SUMMARY)

- Əsas Məqsəd: Sosial şəbəkə tətbiqi üçün təhlükəsiz, sessiya idarəçiliyinə malik
  və 2FA dəstəkləyən istifadəçi idarəetmə API-ı.
- Əsas Entity-lər: User, UserProfile, AuthSession, RefreshToken, VerificationToken.
- Əsas Metodlar: AuthService.LoginAsync (Giriş & 2FA challenge), SessionService.CreateSessionAsync
  (Sessiyanın analizi və qeydiyyatı), TwoFactorService.VerifyTotpCode (OTP doğrulama).
- Gələcəkdə işə davam etmək üçün ilk baxılmalı fayllar:
  [ProfileService.cs](file:///C:\Users\JafarMustafayev\Desktop\TetraSocialApp\Tetra_back\Tetra.Infrastructure\Services\Profile\ProfileService.cs) (Şəkil yükləmə hissəsini tamamlamaq üçün).
  [Program.cs](file:///c:/Users/JafarMustafayev/Desktop/TetraSocialApp/Tetra_back/Tetra.API/Program.cs) (MapOpenApi əlavə etmək üçün).
  [AuthTokenService.cs](file:///c:/Users/JafarMustafayev/Desktop/TetraSocialApp/Tetra_back/Tetra.Infrastructure/Services/Auth/AuthTokenService.cs) (Redis blacklist TODO-sunu tamamlamaq üçün).
