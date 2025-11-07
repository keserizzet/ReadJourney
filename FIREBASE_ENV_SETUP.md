# Firebase Environment Variables Nasıl Alınır?

## Adım Adım Rehber

### 1. Firebase Console'a Giriş

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Google hesabınızla giriş yapın

### 2. Proje Oluşturma (Eğer yoksa)

1. **"Add project"** veya **"Create a project"** butonuna tıklayın
2. Proje adını girin (örn: "readjourney")
3. Google Analytics'i isteğe bağlı olarak etkinleştirin
4. Projeyi oluşturun

### 3. Web Uygulaması Ekleme

1. Firebase Console'da projenizi seçin
2. Ana sayfada **"</>" (Web)** ikonuna tıklayın veya **"Add app"** butonuna tıklayıp **"Web"** seçin
3. Uygulama adını girin (örn: "ReadJourney Web")
4. **"Register app"** butonuna tıklayın

### 4. Firebase Config Bilgilerini Kopyalama

Firebase, size bir kod bloğu gösterecek. Bu kod bloğunda `firebaseConfig` objesi içinde tüm bilgiler var:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Alternatif Yol:**
1. Firebase Console ana sayfasında, sol menüden **⚙️ Project Settings** (Proje Ayarları) seçin
2. Aşağı kaydırın, **"Your apps"** bölümünde web uygulamanızı bulun
3. **"Config"** sekmesine tıklayın
4. `firebaseConfig` objesini göreceksiniz

### 5. Environment Variables Haritası

Firebase config bilgilerini `.env` dosyasına şu şekilde dönüştürün:

| Firebase Config | .env Değişkeni | Örnek Değer |
|----------------|----------------|-------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` | `readjourney.firebaseapp.com` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` | `readjourney-12345` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` | `readjourney-12345.appspot.com` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `appId` | `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abcdef123456` |

### 6. .env Dosyası Örneği

Proje kök dizininde `.env` dosyası oluşturun ve şu formatta doldurun:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=readjourney.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=readjourney-12345
VITE_FIREBASE_STORAGE_BUCKET=readjourney-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**ÖNEMLİ:**
- Tırnak işareti (`"`) kullanmayın
- Her satırda bir değişken
- Boşluk veya özel karakter olmadan `=` işaretinden sonra değeri yazın

### 7. Görsel Rehber

```
Firebase Console
└── Project Settings (⚙️)
    └── Your apps
        └── Web app (</>)
            └── Config
                └── firebaseConfig objesi
                    ├── apiKey → VITE_FIREBASE_API_KEY
                    ├── authDomain → VITE_FIREBASE_AUTH_DOMAIN
                    ├── projectId → VITE_FIREBASE_PROJECT_ID
                    ├── storageBucket → VITE_FIREBASE_STORAGE_BUCKET
                    ├── messagingSenderId → VITE_FIREBASE_MESSAGING_SENDER_ID
                    └── appId → VITE_FIREBASE_APP_ID
```

### 8. Kontrol Listesi

- [ ] Firebase Console'da proje oluşturuldu
- [ ] Web uygulaması eklendi
- [ ] `firebaseConfig` objesi kopyalandı
- [ ] `.env` dosyası oluşturuldu
- [ ] Tüm 6 değişken `.env` dosyasına eklendi
- [ ] Development server yeniden başlatıldı (`npm run dev`)

### 9. Sorun Giderme

**Eğer bilgileri göremiyorsanız:**
1. Project Settings > General sekmesinde **"SDK setup and configuration"** bölümünü kontrol edin
2. **"Config"** seçeneğini seçin (SDK yerine)

**Eğer uygulama eklenmediyse:**
1. Ana sayfada **"</>"** ikonuna tıklayın
2. Veya Project Settings > Your apps > Add app > Web

### 10. Güvenlik Notu

- `.env` dosyası `.gitignore`'da olduğu için Git'e commit edilmez
- Bu bilgileri asla public repository'lerde paylaşmayın
- Production ortamında Firebase Console'dan güvenlik kurallarını sıkılaştırın

