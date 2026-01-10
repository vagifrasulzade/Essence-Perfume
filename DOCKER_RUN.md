# 🚀 Docker ilə Proyekti İşə Salma

## Tələblər

- Docker Desktop yüklənmiş olmalıdır
- Docker Compose yüklənmiş olmalıdır (Docker Desktop ilə birlikdə gəlir)

## 📦 Proyekti İşə Salma

### 1. Bütün Container-ləri Build və Run et:

```bash
docker-compose up --build
```

### 2. Arxa planda işlətmək üçün:

```bash
docker-compose up -d --build
```

### 3. Logları izləmək:

```bash
docker-compose logs -f
```

## 🔗 Əlçatan URL-lər

- **Frontend (Next.js)**: http://localhost:3000
- **Backend (ASP.NET Core API)**: http://localhost:5000
- **Database (MSSQL)**: localhost:1433
  - Username: `sa`
  - Password: `Salam123!@`

## 🛠️ Faydalı Komandalar

### Container-ləri dayandırmaq:

```bash
docker-compose down
```

### Container-ləri dayandırıb volume-ları silmək (database reset):

```bash
docker-compose down -v
```

### Yalnız backend-i yenidən build etmək:

```bash
docker-compose up -d --build backend
```

### Yalnız frontend-i yenidən build etmək:

```bash
docker-compose up -d --build frontend
```

### Container-lərin statusuna baxmaq:

```bash
docker-compose ps
```

### Spesifik container-in log-larına baxmaq:

```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Container-ə daxil olmaq (debugging üçün):

```bash
# Backend container-ə daxil olmaq
docker exec -it perfume-backend /bin/bash

# Frontend container-ə daxil olmaq
docker exec -it perfume-frontend /bin/sh

# Database container-ə daxil olmaq
docker exec -it perfume-sql /bin/bash
```

## 🔧 Troubleshooting

### Database qoşulmur?

Database-in tam işə düşməsi bir az vaxt ala bilər. Backend-in loglarını yoxlayın:

```bash
docker-compose logs backend
```

### Port artıq istifadə olunur?

Əgər 3000, 5000 və ya 1433 portları məşğuldursa, docker-compose.yml faylında portları dəyişdirin:

```yaml
ports:
  - "3001:3000" # Yeni port:Container portu
```

### Cache problemləri?

Tamamilə təmiz build üçün:

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 📝 Qeydlər

- İlk dəfə işə saldıqda, backend avtomatik olaraq database-i migrate edəcək və seed data əlavə edəcək
- Frontend və Backend ayrı container-lərdə işləyir və öz aralarında Docker network vasitəsilə əlaqə saxlayırlar
- Database məlumatları `mssql_data` volume-unda saxlanılır və container silinsə belə qalır
