# API Endpoint Düzeltme Notları

## Mevcut Sorunlar

1. **Books Endpoint 404 Hatası**
   - `/books` endpoint'i bulunamıyor (404)
   - `/books/recommended` endpoint'i "recommended is not valid id" hatası veriyor
   - Backend API dokümantasyonunda doğru endpoint yapısını kontrol etmek gerekiyor

2. **Login 409 Conflict**
   - Email backend'de var ama password farklı
   - Kullanıcı backend API'de farklı password ile kayıtlı

## Çözüm Adımları

### 1. Backend API Dokümantasyonunu Kontrol Edin

Swagger UI'da (`https://readjourney.b.goit.study/api-docs/`) books endpoint'lerini bulun:
- Books listesi için endpoint nedir?
- Recommended books için endpoint nedir?
- Library books için endpoint nedir?

### 2. Olası Endpoint Yapıları

Şu endpoint'ler denendi:
- ❌ `/books/recommended` - "recommended is not valid id" hatası
- ❌ `/books` - 404 Not Found
- ❌ `/recommended` - 404 Not Found

**Olası Doğru Endpoint'ler:**
- `/books` (farklı query parametreleri ile)
- `/recommended` (farklı yapı)
- `/api/recommended`
- Veya tamamen farklı bir yapı

### 3. Swagger'da Kontrol Edilecekler

1. Books endpoint'lerini bulun
2. Request formatını kontrol edin (query params, body, etc.)
3. Response formatını kontrol edin
4. Authentication gereksinimlerini kontrol edin

### 4. Geçici Çözüm

Kod şu anda birden fazla endpoint'i deniyor. Swagger'dan doğru endpoint'i bulduktan sonra `src/services/api.ts` dosyasındaki `booksAPI.getRecommended` fonksiyonunu güncelleyin.

## Hızlı Test

Backend API dokümantasyonunda (Swagger UI) şu endpoint'leri arayın:
- GET endpoint for books/recommended
- Query parameters: page, limit, title, author
- Response structure

Endpoint bulunduktan sonra `src/services/api.ts` dosyasını güncelleyin.

