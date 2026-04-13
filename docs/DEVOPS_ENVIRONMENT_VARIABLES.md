# 🚀 SAIP Frontend - Zmienne środowiskowe dla Jenkins

## 📋 Wymagane zmienne dla każdego środowiska

DevOps **MUSI** ustawić w Jenkins dla każdego środowiska:

### 🔧 Development Environment

```bash
# Jenkins Environment Variables - DEVELOPMENT
NEXT_PUBLIC_SAIP_ENV=development
```

**URL backendu:** `http://gp-saip-portals-website-backend-v3.development.internal.saip.gov.sa`  
**URL frontendu:** `http://gp-saip-portals-website-frontend-v3.development.internal.saip.gov.sa`

---

### 🧪 Test Environment

```bash
# Jenkins Environment Variables - TEST
NEXT_PUBLIC_SAIP_ENV=test
```

**URL backendu:** `http://gp-saip-portals-website-backend-v3.test.internal.saip.gov.sa`  
**URL frontendu:** `http://gp-saip-portals-website-frontend-v3.test.internal.saip.gov.sa`

---

### 🎭 Staging Environment (przyszłość)

```bash
# Jenkins Environment Variables - STAGING
NEXT_PUBLIC_SAIP_ENV=staging
```

**URL backendu:** `http://gp-saip-portals-website-backend-v3.staging.internal.saip.gov.sa`  
**URL frontendu:** `http://gp-saip-portals-website-frontend-v3.staging.internal.saip.gov.sa`

---

### 🏭 Production Environment (przyszłość)

```bash
# Jenkins Environment Variables - PRODUCTION
NEXT_PUBLIC_SAIP_ENV=production
```

**URL backendu:** `http://gp-saip-portals-website-backend-v3.production.internal.saip.gov.sa`  
**URL frontendu:** `http://gp-saip-portals-website-frontend-v3.production.internal.saip.gov.sa`

---

## 🔧 Jak ustawić w Jenkins?

### Opcja A: Pipeline Environment Block

```groovy
pipeline {
    agent any

    environment {
        // 🎯 WYMAGANE - określa środowisko
        NEXT_PUBLIC_SAIP_ENV = 'test'  // lub 'staging', 'production'

        // 📦 BUILD
        NODE_ENV = 'production'
    }

    stages {
        stage('Build Frontend') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }
}
```

### Opcja B: Jenkins Credentials/Parameters

W Jenkins UI → Configure → Build Environment:

1. **Add build parameter:**
   - Type: `Choice Parameter`
   - Name: `SAIP_ENV`
   - Choices:
     ```
     test
     staging
     production
     ```

2. **W Pipeline użyj:**
   ```groovy
   environment {
       NEXT_PUBLIC_SAIP_ENV = "${params.SAIP_ENV}"
   }
   ```

### Opcja C: Multi-Branch Pipeline (zalecane)

Jeśli używacie multi-branch pipeline, możecie automatycznie mapować branch → environment:

```groovy
pipeline {
    agent any

    environment {
        NEXT_PUBLIC_SAIP_ENV = getBranchEnvironment()
    }

    stages { /* ... */ }
}

def getBranchEnvironment() {
    def branch = env.BRANCH_NAME ?: 'development'

    switch(branch) {
        case 'development':
        case 'dev':
            return 'development'
        case 'test':
        case 'testing':
            return 'test'
        case 'staging':
        case 'stage':
            return 'staging'
        case 'production':
        case 'prod':
        case 'main':
        case 'master':
            return 'production'
        default:
            return 'development'
    }
}
```

---

## ✅ Weryfikacja

Po wdrożeniu sprawdź w konsoli przeglądarki (F12):

```javascript
// Powinieneś zobaczyć:
// 🔧 [SAIP Config] Using NEXT_PUBLIC_SAIP_ENV: test → http://gp-saip-portals-website-backend-v3.test.internal.saip.gov.sa
// ✅ [SAIP Config] Environment set by DevOps/Jenkins
```

❌ **Jeśli widzisz:**

```javascript
// ⚠️ [SAIP Config] Fallback used - DevOps should set NEXT_PUBLIC_SAIP_ENV
```

To znaczy że zmienna **NIE JEST USTAWIONA** w Jenkins! 🚨

---

## 🔗 Server-Side Backend URL (WYMAGANE dla file downloads!)

**NOWA ZMIENNA - dodana 14 stycznia 2026**

```bash
# DRUPAL_INTERNAL_URL - URL dla komunikacji server-to-server (API routes)
# NIE używa prefiksu NEXT_PUBLIC_ bo jest TYLKO dla server-side!
DRUPAL_INTERNAL_URL=http://drupal-service  # lub inna nazwa service w Kubernetes
```

**Dlaczego to jest potrzebne?**

Frontend używa **dwóch różnych URL** do backendu:

1. **Client-side** (przeglądarka użytkownika):
   - Używa `NEXT_PUBLIC_SAIP_ENV` → external URL
   - Np: `http://gp-saip-portals-website-backend-v3.development.internal.saip.gov.sa`

2. **Server-side** (Next.js API routes - np. file proxy):
   - Używa `DRUPAL_INTERNAL_URL` → internal service name
   - Np: `http://drupal-service` lub `http://backend-pod:80`

**Jak ustawić dla każdego środowiska:**

```groovy
// W Jenkinsfile
environment {
    NEXT_PUBLIC_SAIP_ENV = 'development'  // dla browser
    DRUPAL_INTERNAL_URL = 'http://gp-saip-portals-website-backend-v3-drupal'  // dla server-side
}
```

**⚠️ Bez `DRUPAL_INTERNAL_URL` nie będą działać:**
- ❌ Pobieranie plików (download proxy)
- ❌ View/Preview dokumentów PDF
- ❌ File uploads przez webforms

**Jak znaleźć właściwy service name?**

Zapytaj DevOps o:
1. Nazwę Kubernetes Service dla backend Drupal
2. Lub internal URL dostępny z poziomu frontend podu
3. Lub użyj `kubectl get services` aby zobaczyć listę

---

## 🔍 Debugging - opcjonalne zmienne

Jeśli trzeba zdiagnozować problemy:

```bash
# Debug mode (więcej logów w konsoli)
NEXT_PUBLIC_DEBUG_MODE=true

# Manualny override URL backendu (tylko do testów!)
NEXT_PUBLIC_DRUPAL_API_URL=http://custom-backend-url.com
```

**⚠️ NIE używać override'u w produkcji!** Zawsze używaj `NEXT_PUBLIC_SAIP_ENV`.

---

## 📦 Zmienne Build-Time vs Runtime

**WAŻNE:** Zmienne `NEXT_PUBLIC_*` są **"wklejane" podczas buildu**!

```bash
# ✅ DOBRZE - zmienna jest ustawiona PRZED buildem
NEXT_PUBLIC_SAIP_ENV=test npm run build

# ❌ ŹLE - zmienna po buildzie NIE ZADZIAŁA
npm run build
NEXT_PUBLIC_SAIP_ENV=test npm start
```

**W Jenkins upewnij się że:**

1. Zmienne są w bloku `environment {}` (przed `npm run build`)
2. LUB są exportowane przed buildem: `export NEXT_PUBLIC_SAIP_ENV=test`

---

## 🧪 Testowanie lokalnie

```bash
# Symuluj test environment
NEXT_PUBLIC_SAIP_ENV=test npm run build
npm start

# Symuluj staging environment
NEXT_PUBLIC_SAIP_ENV=staging npm run build
npm start

# Symuluj production environment
NEXT_PUBLIC_SAIP_ENV=production npm run build
npm start
```

---

## 🎯 Podsumowanie dla DevOps

**DO ZROBIENIA DLA KAŻDEGO ŚRODOWISKA:**

### Development Environment:

1. ✅ Otwórz Jenkins job dla `website-frontend-v3` na DEVELOPMENT
2. ✅ Dodaj zmienną środowiskową: `NEXT_PUBLIC_SAIP_ENV=development`
3. ✅ Upewnij się że zmienna jest ustawiona PRZED `npm run build`
4. ✅ Zrób deployment
5. ✅ Frontend połączy się z: `http://gp-saip-portals-website-backend-v3.development.internal.saip.gov.sa`

### Test Environment:

1. ✅ Otwórz Jenkins job dla `website-frontend-v3` na TEST
2. ✅ Dodaj zmienną środowiskową: `NEXT_PUBLIC_SAIP_ENV=test`
3. ✅ Upewnij się że zmienna jest ustawiona PRZED `npm run build`
4. ✅ Zrób deployment
5. ✅ Frontend połączy się z: `http://gp-saip-portals-website-backend-v3.test.internal.saip.gov.sa`

### Staging/Production (później):

- Gdy będziecie wdrażać staging: dodać `NEXT_PUBLIC_SAIP_ENV=staging`
- Gdy będziecie wdrażać production: dodać `NEXT_PUBLIC_SAIP_ENV=production`

**⚠️ WAŻNE:** Każde środowisko MUSI mieć ustawioną zmienną `NEXT_PUBLIC_SAIP_ENV`!
Bez tej zmiennej frontend domyślnie łączy się z TEST backendem.

---

## 📞 Kontakt

Jeśli są jakieś problemy z konfiguracją - zespół frontend pomoże!

**Kluczowe:**

- `NEXT_PUBLIC_SAIP_ENV` musi być ustawione **build-time** (przed `npm run build`)
- Wartości: `test`, `staging`, `production` (lowercase!)
- Frontend automatycznie wybierze odpowiedni backend URL
