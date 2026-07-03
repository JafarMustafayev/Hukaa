# TETRA SOCIAL APP - FRONTEND TEXNİKİ DOKUMENTASİYASI (MEMORY DOC)

Tarix: 03 İyul 2026
Müəllif: Mustafayev Jafar
Layihə yığını (Stack): React + Vite (JS) + Tailwind CSS v4

Bu sənəd layihənin frontend hissəsinin tam strukturunu, endpointlərini, mock data
quruluşunu, reallaşdırılmış və dummy funksiyalarını izah edir. Məqsəd, layihəyə
uzun müddət sonra qayıtdıqda mövcud vəziyyəti tez bir zamanda xatırlamaqdır.

---

MÜNDƏRİCAT:

1. [Layihənin ümumi xülasəsi](#1-layi̇həni̇n-ümumi̇-xülasəsi̇)
2. [Texnologiyalar və kitabxanalar](#2-texnologi̇yalar-və-ki̇tabxanalar)
3. [Folder və fayl strukturu](#3-folder-və-fayl-strukturu)
4. [Routing və səhifələr](#4-routing-və-səhi̇fələr)
5. [Feature-lər (Funksionallıqlar)](#5-feature-lər-funksi̇onalliqlar)
6. [Backend əlaqəsi](#6-backend-əlaqəsi̇)
7. [Mock data və dummy hissələr](#7-mock-data-və-dummy-hi̇ssələr)
8. [Authentication (Frontend tərəfdə)](#8-authentication-frontend-tərəfdə)
9. [State Management](#9-state-management)
10. [Reusable Components](#10-reusable-components-əsas-yeni̇dən-i̇sti̇fadə-olunan-komponentlər)
11. [Forms və Validation](#11-forms-və-validation)
12. [UI və Styling](#12-ui-və-styling)
13. [Assets](#13-assets)
14. [Environment və Config](#14-environment-və-config)
15. [Error Handling və Loading States](#15-error-handling-və-loading-states)
16. [Tests](#16-tests)
17. [Build və Run Instruction (İşə salma və qurma)](#17-build-və-run-instruction-i̇şə-salma-və-qurma)
18. [Backend ilə uyğunluğun yoxlanması](#18-backend-i̇lə-uyğunluq-yoxlanmasi)
19. [Ən son yazılan və yarımçıq qalan hissələr](#19-ən-son-yazilan-və-yarimçiq-qalan-hi̇ssələr)
20. [Problemli və diqqət edilməli hissələr](#20-problemli̇-və-di̇qqət-edi̇lməli̇-hi̇ssələr)
21. [Nəticə (Frontend Memory Summary)](#21-nəti̇cə-frontend-memory-summary)

---

## 1. LAYİHƏNİN ÜMUMİ XÜLASƏSİ

- Frontend nə üçündür?
  Tetra Social App - istifadəçilərin bir-biri ilə qarşılıqlı əlaqədə ola bildiyi,
  postlar paylaşdığı, mesajlaşdığı və təhlükəsizlik parametrlərini tənzimlədiyi
  müasir sosial şəbəkə platformasıdır. Mövcud ön hissə (front) bu sistemin istifadəçi
  interfeysini və müvafiq biznes məntiqlərini idarə edir.

- İstifadəçi üçün əsas funksiyalar:
  - Qeydiyyat (Register) və Giriş (Login)
  - İki-faktorlu identifikasiya (2FA - Authenticator app və Recovery Codes ilə)
  - Şifrəmi unutdum / Şifrə sıfırlama və Email təsdiqləmə
  - Profil idarəetməsi (Avatar və Cover şəkli kəsmə (crop)/yükləmə, Bio limitləri)
  - İstifadəçi axtarışı və izləmə (Follow/Unfollow)
  - Post paylaşma (Markdown, kod blokları rəngləndiricisi, multi-image və video)
  - Bookmarks və Sevimli postlar (Likes), qovluqlar yaratma
  - Mesajlaşma (Mock UI / Dummy söhbətlər)
  - Aktiv seansların idarə edilməsi və digər cihazlardan çıxışın verilməsi
  - Thema (Dark/Light/System) və Accent Color (rəng çaları) fərdiləşdirilməsi
  - Developer alətləri (API Tester və WebSocket Tester daxili panelləri)

- Hansı səhifələr və modullar var?
  Layihə Feed, Axtarış, Bildirişlər, Əlfəcinlər, Mesajlar, Profil və Parametrlər
  kimi modullardan ibarətdir. Həmçinin inkişaf etdirmə (dev) zamanı API sorğularını
  və WebSocket qoşulmalarını sınaqdan keçirmək üçün daxili test səhifələri mövcuddur.

- Backend ilə əlaqə:
  Tətbiq native "fetch" API üzərində qurulmuş xüsusi "fetchClient" (src/api/client.js)
  köməyi ilə .env faylında göstərilən API ünvanına sorğular göndərir.
  Sessiyaların təhlükəsizliyi Access Token (Bearer) və Refresh Token ilə qorunur.

---

## 2. TEXNOLOGİYALAR VƏ KİTABXANALAR

package.json faylının analizinə əsasən istifadə olunan əsas kitabxanalar:

- React (v19.2.4) & React-DOM: Tətbiqin əsas strukturunu və komponent arxitekturasını qurur.
- Vite (v8.0.4) & @types/react: Sürətli inkişaf mühiti (dev server) və optimallaşdırılmış build təmin edir.
- react-router-dom (v7.14.0): Layihə daxili səhifələrin routingini (yönləndirilməsini) və layout-ları idarə edir.
- tailwindcss (v4.2.2) & @tailwindcss/vite (^4.2.2): Müasir, sürətli və responsive dizayn üçün Tailwind-in ən son versiyası tətbiq olunub.
- remixicon (v4.9.1) & lucide-react (v1.8.0): Tətbiq daxili zəngin ikon dəstəyini təmin edir.
- react-hot-toast (v2.6.0): Uğurlu/xətalı əməliyyatların istifadəçiyə toast popup bildirişləri ilə ötürülməsi.
- react-datepicker (v9.1.0): Qeydiyyat zamanı doğum tarixinin rahat seçilməsi üçün təqvim komponenti.
- react-easy-crop (v5.5.7): Profil və cover şəkillərinin yüklənməzdən öncə dairəvi və ya düzbucaqlı formada kəsilməsi (crop).
- dayjs (v1.11.21): Tarix formatlaması və "X müddət əvvəl" hesablamaları üçün.
- qrcode.react (v4.2.0): İki-faktorlu identifikasiyanın (2FA) quraşdırılması zamanı Authenticator app üçün QR kod yaradılması.
- react-countdown (v2.3.6): 2FA login zamanı challenge-in bitmə vaxtını göstərən taymer.
- react-markdown (v10.1.0) & remark-gfm (v4.0.1): Postlar içində Markdown və GitHub-style cədvəl formatlarının dəstəklənməsi.
- react-syntax-highlighter (v16.1.1): Paylaşılan kod bloklarının proqramlaşdırma dillərinə görə rəngləndirilməsi (highlighting).

---

## 3. FOLDER VƏ FAYL STRUKTURU

Layihənin "src" qovluğu flat və anlaşılan şəkildə strukturlaşdırılmışdır:

- src/api/: Bütün şəbəkə sorğularının və konfiqurasiyaların mərkəzidir.
  - client.js: Token yeniləmə (refresh), 401 interceptor və mərkəzi fetch wrapper.
  - apiConfig.js: API Base URL və Loqo təyini.
  - \*.api.js: Müxtəlif modullar üçün endpoint çağırış funksiyaları (auth, account, settings, post, search, bookmark, notification).
- src/assets/: Statik şəkillər və SVG fayllar (loqolar).
- src/components/: Yenidən istifadə edilə bilən UI və biznes komponentləri.
  - ui/: Tabs, UserListItem, ImageModal kimi təməl elementlər.
  - skeletons/: Yüklənmə zamanı göstərilən struktur karkasları.
  - feed/, auth/, settings/, messages/, websocket/, apiTester/, widgets/: Hər modula məxsus alt-komponentlər.
- src/context/: Qlobal state idarəçiləri.
  - AuthContext.jsx: İstifadəçi məlumatı, Giriş/Çıxış vəziyyəti və dinamik accent rəng çaları.
  - ThemeContext.jsx: Dark/Light/System rejimləri.
- src/data/: Konfiqurasiya dataları (məs: settingsData.js - parametrlər ağacı).
- src/hooks/: Custom hook-lar (məs: useApiTester.js, useWebSocketTester.js).
- src/layouts/: Route-ları saran layout-lar.
  - MainLayout.jsx: Giriş etmiş istifadəçilər üçün (Navbar, sağ sidebar, responsive grid).
  - AuthLayout.jsx: Qonaq istifadəçilər üçün (Login/Register əhatəsi).
- src/pages/: Route komponentləri. Home, Profile, Bookmarks, Notifications, Search, Messages, Settings və s.
- src/utils/: Köməkçi fayllar. validation.js, cropImage.js, dateFormatter.js və testlər üçün mockData.js.
- src/index.css: Qlobal üslublar, Tailwind v4 importu və dinamik HSL rəng təyini.
- src/App.jsx: Routing konfiqurasiyası, Toaster və Context providerlərinin birləşməsi.
- src/main.jsx: React DOM-un işə salınma nöqtəsi.

---

## 4. ROUTING VƏ SƏHİFƏLƏR

Aşağıdakı cədvəldə tətbiqdəki bütün marşrutlar (routes) təsvir edilmişdir:

| Path                  | Səhifə Komponenti         | Növü    | Layout     | Açıqlama                                             | API / Mock status         |
| --------------------- | ------------------------- | ------- | ---------- | ---------------------------------------------------- | ------------------------- |
| /feed                 | Home.jsx                  | Private | MainLayout | Əsas ana səhifə (Post axını)                         | Mock API (getAllPosts)    |
| /search               | Search.jsx                | Private | MainLayout | İstifadəçi və Post axtarış paneli                    | Mock API (search.api)     |
| /notifications        | Notifications.jsx         | Private | MainLayout | Bildirişlər siyahısı (tab filtrli)                   | Mock API (notification)   |
| /bookmarks            | Bookmarks.jsx             | Private | MainLayout | Əlfəcinlər və bəyənilən postlar                      | Mock API (bookmark.api)   |
| /messages             | Messages.jsx              | Private | MainLayout | Çat və mesajlaşma ekranı                             | Tam Mock (Daxili data)    |
| /settings/\*          | Settings.jsx              | Private | MainLayout | Nizamlamalar (Hesab, Təhlükəsizlik, Profil, Görünüş) | Real API və placeholders  |
| /ApiTester/\*         | ApiTester.jsx             | Private | MainLayout | REST API test mühiti (developer aləti)               | Real API calls            |
| /WebSocketTester/\*   | WebsocketTester.jsx       | Private | MainLayout | WebSocket qoşulma test mühiti (developer aləti)      | Real WS connection        |
| /:username/followers  | Follow.jsx                | Private | MainLayout | İstifadəçinin izləyicilər siyahısı                   | Mock API (account.api)    |
| /:username/following  | Follow.jsx                | Private | MainLayout | İstifadəçinin izlədiyi şəxslər siyahısı              | Mock API (account.api)    |
| /:username            | Profile.jsx               | Private | MainLayout | İstifadəçi profili (Postlar və Arxiv)                | Mock API (Profile, Posts) |
| /post/:id             | PostDetail.jsx            | Private | MainLayout | Postun detallı görünüşü                              | Mock API (post.api)       |
| /auth/login           | Login.jsx                 | Public  | AuthLayout | Giriş səhifəsi                                       | Real API                  |
| /auth/register        | Register.jsx              | Public  | AuthLayout | Qeydiyyat səhifəsi (5 addımlı wizard)                | Real API                  |
| /auth/forgot-password | ForgotPassword.jsx        | Public  | AuthLayout | Şifrə bərpa linki istəmə səhifəsi                    | Real API                  |
| /auth/reset-password  | ResetPassword.jsx         | Public  | AuthLayout | Yeni şifrə təyin etmə səhifəsi                       | Real API                  |
| /auth/confirm-email   | EmailConfirmation.jsx     | Public  | AuthLayout | E-poçt təsdiqləmə səhifəsi                           | Real API                  |
| /auth/2fa             | TwoFactorVerification.jsx | Public  | AuthLayout | 2FA kod və ya Recovery code yoxlanışı                | Real API                  |
| /                     | (Redirect)                | -       | -          | Birbaşa /feed ünvanına yönləndirir                   | -                         |

---

## 5. FEATURE-LƏR (FUNKSİONALLIQLAR)

- Authentication & Authorization (Real API):
  - İstifadəçi email/şifrə ilə daxil olur. Əgər 2FA aktivdirsə, dərhal giriş verilmir;
    keçici challenge token ilə /auth/2fa səhifəsinə yönləndirilir.
  - Uğurlu girişdə Access Token və Refresh Token localStorage-da saxlanılır.
  - Qeydiyyat 5 mərhələdən ibarətdir: 1) Ad/Soyad, 2) Doğum Tarixi (16 yaş limiti), 3) İstifadəçi adı (avtomatik mövcudluq yoxlanışı), 4) Email (mövcudluq yoxlanışı), 5) Şifrə.

- Profile Management (Real API - Settings daxilində):
  - Ad, Soyad, Bio, Vebsayt, Doğum Tarixi, Cinsiyyət dəyişiklikləri.
  - Avatar və Cover (Banner) şəkillərinin yüklənməsi. Şəkil yüklənərkən
    istifadəçiyə kəsmə (crop) modalı açılır və base64 formatına salınaraq FormData ilə
    API-yə göndərilir.
  - Bio hissəsində 500 simvol limiti və dinamik sayğac mövcuddur.

- Password & Email settings (Real API):
  - Şifrə dəyişmə paneli (Cari şifrə + Yeni şifrə).
  - İstifadəçi adı və email ünvanının dəyişdirilməsi. Yeni istifadəçi adı və e-poçt
    seçilərkən debounce ilə fon rejimində mövcudluq yoxlaması həyata keçirilir.

- Active Sessions (Real API):
  - İstifadəçinin daxil olduğu bütün aktiv cihazlar və brauzer seansları siyahılanır.
  - Cari cihaz "Active Now" kimi göstərilir. İstenilən digər seansı məsafədən
    bağlamaq (revoke) və ya cari cihaz istisna olmaqla bütün digər sessiyaları
    bütövlükdə ləğv etmək mümkündür.

- Two-Factor Authentication (Real API):
  - İstifadəçi 2FA aktivləşdirmək istədikdə şifrəsini daxil edir.
  - Sistem ona QR kod və gizli açar (shared key) göstərir. Google Authenticator
    kimi tətbiqlərdən alınan 6 rəqəmli doğrulama kodu daxil edilərək 2FA aktivləşdirilir.
  - Aktivləşdikdə istifadəçiyə birdəfəlik Recovery kodları verilir.
  - İstənilən vaxt bərpa kodlarını yenidən generasiya etmək və ya 2FA-nı söndürmək olar.

- Appearance (Görünüş - Local State):
  - Sistem thema-sı (Light/Dark/System) dəyişimi.
  - Dinamik Accent Color. Spektr üzərində 0-360 dərəcəlik hue dəyəri seçilərək
    bütün tətbiqin rəng sxemi dərhal yenilənir. CSS dəyişənləri üzərindən işləyir.

- Post Feed & Archive (Mock API / Mock Data):
  - Postların göstərilməsi, bəyənilməsi, repost edilməsi.
  - Multi-image (qalereya tipli, tam ekran baxış, böyütmə/kiçiltmə funksiyası ilə)
    və video paylaşımların vizuallaşdırılması.
  - Şəxsi profil daxilində "Archive" bölməsi vasitəsilə arxivləşdirilmiş
    postların lazy-load üsulu ilə yüklənməsi.

- Bookmarks & Folders (Mock API / Mock Data):
  - İstifadəçilər postları əlfəcin edə bilər.
  - Əlfəcinləri qruplaşdırmaq üçün qovluqlar (folders) yaradıla, adı dəyişdirilə
    və silinə bilər.

- Notifications (Mock API / Mock Data):
  - "All", "Mentions", "Comments", "Likes", "Follows", "System" tipli bildirişlər.
  - Hamısını oxunmuş etmək və ya tək-tək oxunmuş etmək düymələri.

- Messages (Dummy Data):
  - Çat ekranı tamamilə statik mock məlumatlarla işləyir. Söhbəti arxivləşdirmək,
    səssizə almaq (mute) və silmək funksiyalarının imitasiyası var.

---

## 6. BACKEND ƏLAQƏSİ

### Mərkəzi API sorğu modulu "src/api/client.js" daxilində yerləşir.

- Base URL: .env faylındakı `VITE_API_BASE_URL` dəyişənindən gəlir.
- Interceptor / Token Refresh Flow:
  1. Hər sorğuya "Authorization: Bearer <token>" başlığı (header) avtomatik əlavə olunur.
  2. Əgər serverdən 401 (Unauthorized) status kodu qayıtsa və endpoint ictimai (public) deyilsə:
     - Əgər artıq başqa bir sorğu tərəfindən Refresh prosesi başladılıbsa, cari sorğu növbəyə (RefreshQueue) daxil olaraq yeni tokenin alınmasını gözləyir.
     - Əgər heç kim refresh etmirsə, client `/api/auth/refresh-token` endpointinə POST sorğusu göndərir.
     - Token uğurla yenilənərsə, növbədəki bütün gözləyən sorğular yeni tokenlə təkrar icra olunur.
     - Refresh uğursuz olarsa və ya refresh token tapılmazsa, istifadəçinin local sessiyası təmizlənir və o, avtomatik `/auth/login` səhifəsinə yönləndirilir.

API Servislərinin siyahısı və strukturları:

### Fayl: account.api.js

- checkUsername(username)
  `GET /api/account/check-username?username=...` (Public)
- checkEmail(email)
  `GET /api/account/check-email?email=...` (Public)
- getMe()
  `GET /api/account/me` (Private)
- updateUsername(username)  
   `PATCH /api/account/username` (Private)

  ```json

  Request body:
   {
     "username": "string"
   }
  ```

- updateEmailAddress(email, password)
  `PATCH /api/account/emailAddress` (Private)

  Request body:

  ```json
  {
    "Email": "string",
    "Password": "string"
  }
  ```

- getUserProfile(username) -> MOCK (Gələcəkdə Profile API ilə qoşulmalıdır)
- getUserFollowers(username) -> MOCK
- getUserFollowing(username) -> MOCK
- followUser(username) -> MOCK
- unfollowUser(username) -> MOCK

### Fayl: auth.api.js

- register(userData)
  `POST /api/auth/register` (Public)
  Request body:
  ```json
  {
    "UserName": "string",
    "Email": "string",
    "Password": "string",
    "DateOfBirth": "string",
    "FirstName": "string",
    "LastName": "string"
  }
  ```
- login(credentials) `
`POST /api/auth/login` (Public)
  Request body:

  ```json
  {
    "EmailOrUsername": "string",
    "Password": "string"
  }
  ```

- verifyTwoFactorLogin(ChallengeId, code)
  `POST /api/Auth/login/2fa` (Public)
  Request body:

  ```json
  {
    "ChallengeId": "string",
    "Code": "string"
  }
  ```

- loginWithRecoveryCode(ChallengeId, recoveryCode)
  `POST /api/Auth/login/recovery` (Public)
  Request body:

  ```json
  {
    "ChallengeId": "string",
    "RecoveryCode": "string"
  }
  ```

- logout()
  `POST /api/auth/logout` (Private)
- forgotPassword
  `POST /api/auth/Password/forgot-password` (Public)
  Request body:

  ```json
  {
    "Email": "string"
  }
  ```

- resetPassword
  `POST /api/auth/Password/reset-password` (Public) |
  Request body:

  ```json
  {
     "Email":"string",
     "Token":"string",
     "NewPassword":"string" }
  }
  ```

- changePassword
  `POST /api/auth/Password/change-password` (Private)
  Request body:

  ```json
  {
    "CurrentPassword": "string",
    "NewPassword": "string"
  }
  ```

- confirmEmail
  `POST /api/auth/EmailVerification/confirm` (Public)
  Request body:

  ```json
  {
    "UserId": "string",
    "Token": "string"
  }
  ```

- resendConfirmationEmail(userId)
  `POST /api/auth/EmailVerification/resend` (Public)
  Request body:

  ```json
  {
    "UserId": "string"
  }
  ```

- getSessions()
  `GET /api/auth/session` (Private)
- revokeSession(sessionId)
  `DELETE /api/auth/session/{sessionId}` (Private)
- revokeOtherSessions()
  `POST /api/auth/session/revoke-others` (Private)
- getTwoFactorStatus()
  `GET /api/auth/2fa/status` (Private)
- setupTwoFactor(password)
  `POST /api/auth/2fa/setup` (Private)
  Request body:

  ```json
  {
    "Password": "string"
  }
  ```

- enableTwoFactor(code)
  `POST /api/auth/2fa/enable` (Private)
  Request body:

  ```json
  {
    "Code": "string"
  }
  ```

- regenerateTwoFactorRecoveryCodes(password)
  `POST /api/auth/2fa/regenerate` (Private)
  Request body:
  ```json
  {
    "Password": "string"
  }
  ```
- disableTwoFactor(password, code)
  `POST /api/auth/2fa/disable`(Private)  
  Request body:

  ```json
  {
    "Password": "string",
    "Code": "string"
  }
  ```

### Fayl: settings.api.js

- getSettingsProfile()
  `GET /api/settings/profile` (Private)
- updateSettingsProfile(formData)
  `PATCH /api/settings/profile` (Private - Multipart/Form-Data formatında)

---

## 7. MOCK DATA VƏ DUMMY HİSSƏLƏR

Aşağıdakı modullar və funksiyalar real backend tətbiqi ilə əlaqələndirilməyib:

- İstifadə olunan Mock faylı: `src/utils/mockData.js`
- Mock datadan istifadə edən feature-lər:
- Post Feed (Home.jsx və PostDetail.jsx): Bütün postlar mockData-dakı `mockPosts` və `mockUserPosts` massivindən oxunur. Realda postları idarə etmək üçün `api/post.api.js` daxilindəki funksiyalar birbaşa real API ilə əvəzlənməlidir.
- Bookmarks (Bookmarks.jsx): `mockBookmarks`, `mockFolders` və `mockLikedPosts` istifadə edilir. Realda `/api/bookmark` endpoints qrupu tələb olunur.
- Notifications (Notifications.jsx): `mockNotifications` massivini filterləyərək yükləyir. Gələcəkdə real bildiriş API-si qoşulmalıdır.
- Search (Search.jsx): `mockSearchUsers` və `mockSearchPosts` istifadə olunur. Gələcəkdə real axtarış motoru/backend axtarış API-si bağlanmalıdır.
- Followers/Following (Follow.jsx): `mockFollowersList`, `mockFollowingList` və profile izləmə əməliyyatları tamamilə mock-dur. Gələcəkdə izləmə əlaqələri üçün backend-də cədvəl və API yaradılmalıdır.
- Söhbətlər/Mesajlar (Messages.jsx): `mockConversations` və `mockMessages` birbaşa səhifə daxilində saxlanılır. Mesajların göndərilməsi yalnız local state-i yeniləyir. Realda bu hissə real-time mesajlaşma üçün SignalR və ya WebSocket serveri ilə, eləcə də söhbət tarixçəsi API-si ilə əvəz olunmalıdır.

---

## 8. AUTHENTICATION FRONTEND TƏRƏFDƏ

- Giriş/Qeydiyyat axını:
- Giriş əsnasında gələn cavab normalized olunur. Əgər `requiresTwoFactor` `true`
  gələrsə, istifadəçi `challengeId` ilə `/auth/2fa` marşrutuna yönləndirilir.
- Əgər normal girişdirsə, `tokenlər` local yaddaşa yazılır və `fetchUser`
  funksiyası çağırılaraq cari istifadəçi obyekti `AuthContext`-ə yüklənir.
- `Token` Saxlanılması:
- Access Token: `localStorage.getItem('token')`
- Refresh Token: `localStorage.getItem('refreshToken')`
- Protected Routes:
- `MainLayout` komponenti hər render zamanı token-in mövcudluğunu yoxlayır. Əgər
  token yoxdursa, istifadəçini `replace` edərək `/auth/login` səhifəsinə atır.
- `AuthLayout` əksinə işləyir; əgər istifadəçi artıq giriş edibsə, onun
  yenidən login/register səhifələrinə girməsinə mane olur və birbaşa `/feed`-ə atır.

---

## 9. STATE MANAGEMENT

Tətbiqdə qlobal dövlətin (global state) idarə olunması üçün heç bir kənar kitabxana
(Redux, Zustand və s.) istifadə olunmayıb. Bunun əvəzinə:

- React Context API istifadə olunur:
- `AuthContext`: Giriş etmiş istifadəçinin məlumatı (`user`), yüklənmə statusu
  (`isLoadingUser`), profil yeniləmələri (`updateCurrentUser`) və çıxış
  məntiqlərini (`logout`) qlobal olaraq paylayır.
- `ThemeContext`: Tətbiqin qaranlıq rejim (Dark Mode) vəziyyətini idarə edir.
- Local State (`useState`): Komponent səviyyəli bütün form, axtarış və render
  vəziyyətləri bu hook ilə idarə olunur.
- Server State / Caching: React Query istifadə olunmadığı üçün API-dən gələn
  cavablar birbaşa yerli komponent state-lərində saxlanılır. Notifications və
  Search səhifələrində eyni tab-a təkrar keçid etdikdə lazımsız API sorğularının
  qarşısını almaq üçün local caching mexanizmləri (sadə state obyektləri şəklində)
  yazılmışdır.

---

## 10. REUSABLE COMPONENTS (ƏSAS YENİDƏN İSTİFADƏ OLUNAN KOMPONENTLƏR)

- Tabs.jsx (`src/components/ui/Tabs.jsx`)
  - Təyinatı: Səhifələrdəki tab keçidlərini (məsələn, "New", "Following" və s.) idarə edir.
  - Props: `tabs` (massiv), `activeTab` (string), `onChange` (funksiya).
- UserListItem.jsx (`src/components/ui/UserListItem.jsx`)
  - Təyinatı: Axtarış və ya izləyici siyahılarında istifadəçi kartını göstərir.
  - Props: `user` (obyekt), `currentUser` (obyekt), `onToggleFollow` (funksiya).
- ImageModal.jsx (`src/components/ui/ImageModal.jsx`)
  - Təyinatı: Postdakı şəkillərə və ya videolara kliklədikdə açılan böyük media baxış modalı.
  - Props: `media` (massiv), `initialIndex` (number), `isOpen` (boolean), `onClose` (funksiya).
- SettingsInput.jsx (`src/components/settings/SettingsInput.jsx`)
  - Təyinatı: Parametrlər bölməsindəki vahid stilə malik input sahələri.
  - Props: `label`, `value`, `onChange`, `type`, `placeholder` və s.
- SettingsButton.jsx (`src/components/settings/SettingsButton.jsx`)
  - Təyinatı: Parametrlər bölməsindəki vahid stilə malik düymələr.
  - Props: `children`, `variant` ("primary" | "outline" | "danger"), `disabled` və s.
- Skeletons (`src/components/skeletons/`):
  - Tətbiqdə demək olar ki, hər yüklənən modul üçün skelet loading komponenti var.
    Məsələn: `PostSkeleton`, `ProfileHeaderSkeleton`, `EditProfileSkeleton`, `ActiveSessionsSkeleton`.

---

## 11. FORMS VƏ VALIDATION

AI davranış qaydalarında "Use react-hook-form for forms" tələbi olmasına rəğmən,
mövcud layihədə bütün formalar ənənəvi React state (`useState`) ilə idarə olunur.

- Qeydiyyat Forması (`Register.jsx`):
- Addım-addım validation həyata keçirilir.
- Doğum tarixi 16 addımdan kiçik olmamaq şərtilə `src/utils/validation.js` daxilindəki `isAtLeast16` funksiyası ilə yoxlanılır.
- E-poçt formatı regex vasitəsilə `validateEmail` ilə yoxlanılır.
- Profil Redaktə Forması (`EditProfileForm.jsx`):
- Ad və Soyad boş buraxıla bilməz (boş buraxıldıqda Toast xətası verilir).
- Şifrə dəyişmə zamanı cari şifrə və təkrar şifrə bərabərliyi yoxlanılır.
- Hata və Müvəffəqiyyət Mesajları:
- Bütün əməliyyatların nəticələri `react-hot-toast` vasitəsilə istifadəçiyə bildirilir.

---

## 12. UI VƏ STYLING

- Tailwind CSS v4:
  Tətbiq Tailwind-in ən son versiyası ilə yazılıb. Köhnə util sinifləri CSS-ə
  keçirilməyib, Tailwind sinifləri inline olaraq istifadə olunur (məsələn,
  flex, grid, rounded-xl, dark:bg-[#09090b] və s.).
- Thema (Dark Mode):
  Görünüş parametrlərindən thema "dark" seçildikdə, html elementinə ".dark" sinfi
  əlavə olunur və Tailwind-in `dark:` variantları vasitəsilə qaranlıq rejim aktivləşir.
- Dinamik Rəng Sistemi (Accent Color):
  HSL rəng modelinə əsaslanır. `:root` daxilində `--accent-hue` dəyişəni saxlanılır.
  İstifadəçi bu dəyəri (məs: 200) dəyişdikdə, `--color-main` və onun hover/optional
  variantları avtomatik yenidən hesablanır. Bu da səhifəni yeniləmədən rəngləri dəyişməyə
  imkan verir.

---

## 13. ASSETS

Statik fayllar və loqolar `src/assets` qovluğunda toplanıb:

- `src/assets/images/icon.svg`: Tetra-nın əsas tünd rejim loqosu.
- `src/assets/images/icon_light.svg`: Tetra-nın işıqlı rejim loqosu.
  Hər iki loqo brauzer thema-sına (dark/light) əsasən `Navbar` daxilində dinamik olaraq yüklənir.

---

## 14. ENVIRONMENT VƏ CONFIG

- `.env` faylı mühit dəyişənlərini saxlayır:
  `VITE_API_BASE_URL=http://localhost:5294`
- `src/api/apiConfig.js` faylı bu dəyişəni oxuyur və bütün API sorğularının
  göndəriləcəyi təməl URL ünvanını (`API_BASE_URL`) müəyyən edir.

---

## 15. ERROR HANDLING VƏ LOADING STATES

- API Xətaları:
  Mərkəzi `client.js` daxilindəki `parseResponse` funksiyası serverdən gələn
  cavabın JSON formatında olub-olmadığını və `Success` bayrağını yoxlayır. Əgər
  uğursuzluq olarsa, serverin göndərdiyi `Message` dəyəri oxunur və `toast.error(message)`
  ilə ekrana çıxarılır.
- Yüklənmə vəziyyətləri (Loading states):
  Bütün asinxron interfeys elementləri üçün loading skeletləri quraşdırılmışdır.
  Şəbəkə sorğusu gedərkən istifadəçi məzmunun boş karkasını (skeleton) görür.

---

## 16. TESTS

- Layihə daxilində hər hansı bir unit, inteqrasiya və ya UI test kitabxanası
  (Vitest, Jest, React Testing Library) TAPILMADI.
- Gələcəkdə əlavə edilməsi tövsiyə olunan test sahələri:
- Mərkəzi `fetchClient` token yeniləmə və növbə axını testi.
- Giriş/Qeydiyyat formalarının addım-addım validation testləri.

---

## 17. BUILD VƏ RUN INSTRUCTION (İŞƏ SALMA VƏ QURMA)

- Paket meneceri: `npm` (package-lock.json mövcuddur)
- Əsas scriptlər (package.json daxilində):
- Layihəni lokalda işə salmaq üçün: `npm run dev` (Vite dev serverini 5173 portunda açır)
- Production build hazırlamaq üçün: `npm run build` (Dist qovluğu yaradır)
- Lint yoxlanışı üçün: `npm run lint` (ESLint konfiqurasiyası ilə yoxlayır)

---

## 18. BACKEND İLƏ UYĞUNLUQ YOXLANMASI

Tətbiqin yerləşdiyi qovluqda "Tetra_back" adlı .NET API həlli də analiz edilmişdir.
Analiz nəticəsində əldə olunan uyğunluq cədvəli:

| Frontend Sorğusu          | HTTP Metodu | Frontend API URL                    | Backend Controller Endpoint           | Method Uyğunluğu | Status / Qeyd                     |
| ------------------------- | ----------- | ----------------------------------- | ------------------------------------- | ---------------- | --------------------------------- |
| auth.api.js / register    | POST        | /api/auth/register                  | AuthController / Register             | Uyğundur         | Tam uyğundur.                     |
| auth.api.js / login       | POST        | /api/auth/login                     | AuthController / Login                | Uyğundur         | Tam uyğundur.                     |
| auth.api.js / logout      | POST        | /api/auth/logout                    | AuthController / Logout               | Uyğundur         | Tam uyğundur (Authorize).         |
| auth.api.js / verify2FA   | POST        | /api/Auth/login/2fa                 | AuthController / LoginWithTwoFactor   | Uyğundur         | Tam uyğundur.                     |
| auth.api.js / recovery    | POST        | /api/Auth/login/recovery            | AuthController / LoginWithRecoveryCod | Uyğundur         | Tam uyğundur.                     |
| auth.api.js / confirmEma. | POST        | /api/auth/EmailVerification/confirm | EmailVerificationController / Confirm | Uyğundur         | Bədəndə userId və token gözləyir. |
| auth.api.js / resendEma.  | POST        | /api/auth/EmailVerification/resend  | EmailVerificationController / Resend  | Uyğundur         | Bədəndə userId gözləyir.          |
| auth.api.js / getSessions | GET         | /api/auth/session                   | SessionController / GetMyActiveSess.  | Uyğundur         | Tam uyğundur (Authorize).         |
| auth.api.js / revokeSess. | DELETE      | /api/auth/session/{id}              | SessionController / DeleteSession     | Uyğundur         | Tam uyğundur (Authorize).         |
| auth.api.js / revokeOthe. | POST        | /api/auth/session/revoke-others     | SessionController / RevokeOthers      | Uyğundur         | Tam uyğundur (Authorize).         |
| auth.api.js / 2faStatus   | GET         | /api/auth/2fa/status                | TwoFactorAuthController / GetStatus.  | Uyğundur         | Tam uyğundur (Authorize).         |
| auth.api.js / 2faSetup    | POST        | /api/auth/2fa/setup                 | TwoFactorAuthController / SetupAuth.  | Uyğundur         | Bədəndə şifrə gözləyir.           |
| auth.api.js / 2faEnable   | POST        | /api/auth/2fa/enable                | TwoFactorAuthController / VerifyAnd.  | Uyğundur         | Bədəndə Code gözləyir.            |
| auth.api.js / 2faRegen.   | POST        | /api/auth/2fa/regenerate            | TwoFactorAuthController / Generate..  | Uyğundur         | Bədəndə şifrə gözləyir.           |
| auth.api.js / 2faDisable  | POST        | /api/auth/2fa/disable               | TwoFactorAuthController / Disable..   | Uyğundur         | Bədəndə şifrə və code gözləyir.   |
| account.api / checkUser.  | GET         | /api/account/check-username         | AccountController / CheckUsername     | Uyğundur         | Query-dən username gözləyir.      |
| account.api / checkEmail  | GET         | /api/account/check-email            | AccountController / CheckEmail        | Uyğundur         | Query-dən email gözləyir.         |
| account.api / getMe       | GET         | /api/account/me                     | AccountController / GetMe             | Uyğundur         | Tam uyğundur (Authorize).         |
| account.api / updateUser. | PATCH       | /api/account/username               | AccountController / ChangeUsername    | Uyğundur         | Bədəndə username gözləyir.        |
| account.api / updateEmail | PATCH       | /api/account/emailAddress           | AccountController / ChangeEmail       | Uyğundur         | Bədəndə Email, Password gözləyir. |
| settings.api / getProfile | GET         | /api/settings/profile               | SettingsController / GetProfileData   | Uyğundur         | Tam uyğundur (Authorize).         |
| settings.api / updateProf | PATCH       | /api/settings/profile               | SettingsController / UpdateProfileAs. | Uyğundur         | Form-dan şəkil və mətn gözləyir.  |
| post.api / \*             | -           | YOXDUR (Tam Mock)                   | Backend-də post nəzarətçisi yoxdur.   | Uyğunsuzluq var  | Tamamilə mock data ilə işləyir.   |
| bookmark.api / \*         | -           | YOXDUR (Tam Mock)                   | Backend-də bookmark nəzarətçisi yox.  | Uyğunsuzluq var  | Tamamilə mock data ilə işləyir.   |
| notification.api / \*     | -           | YOXDUR (Tam Mock)                   | Backend-də notification nəz. yoxdur.  | Uyğunsuzluq var  | Tamamilə mock data ilə işləyir.   |
| search.api / \*           | -           | YOXDUR (Tam Mock)                   | Backend-də axtarış nəzarətçisi yoxdur | Uyğunsuzluq var  | Tamamilə mock data ilə işləyir.   |

---

## 19. ƏN SON YAZILAN VƏ YARIMÇIQ QALAN HİSSƏLƏR

- Git Tarixçəsi (Git History) analizi:
  Ən son commit ("feat(profile): improve profile update and retrieval flow")
  istifadəçi profili üzərində işlərin aparıldığını göstərir. Bu commit-lə:
- Qeydiyyat doğum tarixi formatı ISO 8601 uyğunluğuna gətirilib (`YYYY-MM-DD`).
- `EditProfileForm.jsx` faylı refaktor edilib, şəkil kəsmə, profil yükləmə
  və məlumat yeniləmə asanlaşdırılıb.
- Bio hissəsinə 500 simvol limiti və sayğac əlavə edilib.
- Formada dəyişiklik edilməyənə qədər "Save" düyməsinin kliklənməsi bloklanıb.

- Yarımçıq və şübhəli kod hissələri:
- `Navbar.jsx` daxilində 37-ci sətirdə `console.log(logo)` unudulub.
- `Navbar.jsx` daxilində 70-ci sətirdə `setUser(JSON.parse(storedUser))` çağırılır.
  Lakin `setUser` funksiyası useAuth() daxilindən çıxarılmayıb (destructure edilməyib).
  Bu, gələcəkdə local yaddaşa `user` yazılarsa dərhal ReferenceError xətası verəcəkdir.
- Qeydiyyatda 2-ci addımda `react-datepicker` işləyir, lakin 2FA, Active Sessions,
  və Edit Profile formalarında tarixlər standart html `<input type="date">`
  elementi ilə göstərilir. Bu da vizual fərqliliyə səbəb olur.

---

## 20. PROBLEMLİ VƏ DİQQƏT EDİLMƏLİ HİSSƏLƏR

1. `Navbar.jsx` daxilindəki `setUser` ReferenceError potensial xətası (yuxarıda göstərildiyi kimi).
2. Təkrar komponentlər və Placeholder hissələr:

- `SettingsContent.jsx` daxilində `messages`, `privacy/visibility`,
  `privacy/blocked-accounts`, `notifications/browser-notifications`,
  `notifications/notification-preferences`, və `deleted` nizamlamaları üçün siniflər və formalar
  yoxdur. Sadəcə "tezliklə olacaq" və ya "forma hazırlanmayıb" placeholder-ləri qaytarır.

3. API Cavab uyğunsuzluqları üçün yazılmış mürəkkəb parserlər:

- Backend API cavabları gah Success (PascalCase), gah da success (camelCase) olaraq
  qaytarır. Bunun qarşısını almaq üçün frontend-də demək olar hər API çağırışından sonra
  `const success = res.Success ?? res.success` kimi yoxlamalar yazılıb. Eyni hal
  tokenlərin oxunması zamanı da baş verir (Tokens, tokens, accessToken, AccessToken və s.).

4. Paket uyğunsuzluğu:

- AI davranış qaydalarında "Use react-hook-form for forms" deyilməsinə rəğmən
  heç bir yerdə bu kitabxana yoxdur və formalar manual useState ilə idarə edilir.

5. Real backend bağlantısı gözləyən əsas hissələr:

- Postlar, Şərhlər, Bəyənmələr, Arxivlər, Əlfəcinlər və Qovluqları, Bildirişlər,
  Axtarış və Mesajlaşma sistemi. Bu modullar hazırda yalnız statik mockData.js-dən
  oxunur və heç bir backend əlaqəsi yoxdur.

---

## 21. NƏTİCƏ (FRONTEND MEMORY SUMMARY)

- Frontend-in əsas məqsədi: Sosial şəbəkə platformasının müasir interfeysini
  və istifadəçi hesab/təhlükəsizlik parametrlərinin idarə edilməsini təmin etmək.
- Əsas səhifələr: /feed (Ana Səhifə), /settings (Parametrlər), /:username (Profil).
- Backend-ə bağlı reallaşdırılmış modullar:
- Giriş, Qeydiyyat, Email təsdiqləmə, Şifrə sıfırlama və dəyişmə.
- İki-faktorlu təhlükəsizlik (2FA) idarəedilməsi.
- Aktiv sessiyaların siyahılanması və silinməsi.
- Hesab detallarının (ad, soyad, bio, vebsayt, doğum tarixi, cinsiyyət) və
  profil/cover şəkillərinin yüklənməsi.
- Mock data ilə işləyən modullar:
- Postlar, Arxivlər, Bəyənmələr, İzləyicilər, Əlfəcin qovluqları, Axtarış,
  Bildirişlər və Mesajlaşma.
- Gələcəkdə işə davam etmək üçün ilk baxılmalı və redaktə edilməli fayllar:
- `src/components/layout/Navbar/Navbar.jsx` (dead-code/bug təmizlənməsi üçün)
- `src/api/post.api.js` (post sistemini real backend-ə qoşmaq üçün)
- `src/api/bookmark.api.js` (əlfəcin qovluqlarını real API-yə qoşmaq üçün)
- `src/pages/Messages.jsx` (statik söhbətləri WebSocket/SignalR ilə əvəzləmək üçün)
