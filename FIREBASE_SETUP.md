# Firebase Kurulum Rehberi

## Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. "Add app" butonuna tıklayın ve "Web" (</>) seçin
4. Uygulama adını girin ve "Register app" butonuna tıklayın

## Firebase Yapılandırması

### 1. Authentication Kurulumu
- Firebase Console'da **Authentication** sekmesine gidin
- "Get started" butonuna tıklayın
- **Sign-in method** sekmesine gidin
- **Email/Password** metodunu etkinleştirin

### 2. Firestore Database Kurulumu
- Firebase Console'da **Firestore Database** sekmesine gidin
- "Create database" butonuna tıklayın
- **Test mode** seçeneğini seçin (geliştirme için)
- Region seçin ve "Enable" butonuna tıklayın

### 3. Environment Variables (.env)

Proje kök dizininde `.env` dosyası oluşturun ve Firebase yapılandırma bilgilerini ekleyin:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Not:** Firebase Console'daki proje ayarlarından bu bilgileri kopyalayabilirsiniz.

### 4. Firestore Security Rules

Firestore Database > Rules sekmesinde şu kuralları ekleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // This rule allows anyone with your Firestore database reference to view, edit,
    // and delete all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Firestore database will be denied until you Update
    // your rules
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 2);
    }
  }
}
```

**ÖNEMLİ:** Bu kurallar 2025 Aralık 2'ye kadar geçerlidir. Production için daha güvenli kurallar kullanın!

## Test Kullanıcıları

Firebase Authentication ile test için:

1. **Register** sayfasından yeni kullanıcı oluşturabilirsiniz
2. Firebase Console > Authentication > Users sekmesinden kullanıcıları görebilirsiniz
3. Test için örnek kullanıcı:
   - Email: `test@example.com`
   - Password: `test1234` (minimum 7 karakter)

## Mevcut Durum

- ✅ Firebase SDK yüklendi
- ✅ Firebase config dosyası hazırlandı
- ✅ Authentication servisi oluşturuldu
- ✅ Register ve Login sayfaları Firebase kullanıyor
- ⚠️ `.env` dosyasını oluşturup Firebase bilgilerini eklemeniz gerekiyor

## Sorun Giderme

1. **"Firebase: Error (auth/invalid-api-key)"** 
   - `.env` dosyasının doğru yapılandırıldığından emin olun
   - Uygulamayı yeniden başlatın (`npm run dev`)

2. **"Firebase: Error (auth/user-not-found)"**
   - Kullanıcı kayıtlı değil, önce Register sayfasından kayıt olun

3. **Environment variables yüklenmiyor**
   - Dosya adının `.env` olduğundan emin olun (`.env.local` değil)
   - Development server'ı yeniden başlatın

