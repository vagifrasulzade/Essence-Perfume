# Docker Hub Setup for GitHub Actions

## 1. Docker Hub Token Yarat

1. [Docker Hub](https://hub.docker.com)-a daxil ol
2. Account Settings → Security
3. "New Access Token" düyməsinə klik et
4. Token adı ver (məsələn: `github-actions`)
5. Token-i kopyala (yalnız bir dəfə göstəriləcək!)

## 2. GitHub Secrets Əlavə Et

1. GitHub repository-nə get
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** düyməsinə bas

### Lazım olan Secrets:

#### DOCKERHUB_USERNAME
- **Name**: `DOCKERHUB_USERNAME`
- **Value**: Docker Hub istifadəçi adın (məsələn: `narmin06`)

#### DOCKERHUB_TOKEN
- **Name**: `DOCKERHUB_TOKEN`
- **Value**: Docker Hub-dan aldığın token

## 3. Workflow İşə Düşəcək

Hər dəfə `main` branch-a push edəndə:
- ✅ Backend image build olunub Docker Hub-a push olunacaq
- ✅ Frontend image build olunub Docker Hub-a push olunacaq

## Image-lər:

```bash
# Backend
docker pull DOCKERHUB_USERNAME/perfume-backend:latest

# Frontend
docker pull DOCKERHUB_USERNAME/perfume-frontend:latest
```

## docker-compose.yml-də İstifadə:

```yaml
services:
  backend:
    image: DOCKERHUB_USERNAME/perfume-backend:latest
    # və ya build:
    # build:
    #   context: ./back-end/Server
    #   dockerfile: Dockerfile
```

## Workflow Status

Workflow-un vəziyyətini GitHub repository-də **Actions** tab-da görə bilərsən.

