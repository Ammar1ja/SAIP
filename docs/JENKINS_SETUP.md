# SAIP Jenkins CI/CD Environment Setup

This document explains how to configure Jenkins for automatic environment detection based on git branches.

## Jenkins Environment Variables

Our branch detection system automatically detects the following Jenkins environment variables:

### Primary Jenkins Variables:

- `BRANCH_NAME` - Modern Jenkins Pipeline variable
- `GIT_BRANCH` - Traditional Jenkins Git plugin variable

### Example Jenkins Pipeline Configuration:

```groovy
pipeline {
    agent any

    environment {
        // SAIP Environment Detection
        NEXT_PUBLIC_SAIP_ENV = "${env.BRANCH_NAME}"
        NODE_ENV = "${getBuildEnvironment()}"

        // Optional: Override with explicit environment
        // NEXT_PUBLIC_SAIP_ENV = 'production'
    }

    stages {
        stage('Environment Detection') {
            steps {
                script {
                    echo "🌍 SAIP Environment Detection:"
                    echo "   Branch: ${env.BRANCH_NAME}"
                    echo "   Git Branch: ${env.GIT_BRANCH}"
                    echo "   Target Environment: ${getBuildEnvironment()}"
                }

                // Generate environment configuration
                sh 'npm run env:detect'
                sh 'npm run env:generate'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def environment = getBuildEnvironment()
                    echo "🚀 Deploying to ${environment} environment"

                    // Deploy based on detected environment
                    switch(environment) {
                        case 'development':
                            sh 'echo "Deploying to development servers"'
                            break
                        case 'test':
                            sh 'echo "Deploying to test servers"'
                            break
                        case 'staging':
                            sh 'echo "Deploying to staging servers"'
                            break
                        case 'production':
                            sh 'echo "Deploying to production servers"'
                            break
                    }
                }
            }
        }
    }
}

// Helper function to determine build environment
def getBuildEnvironment() {
    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'development'

    // Clean branch name (remove origin/ prefix)
    branch = branch.replaceAll(/^origin\//, '')

    // Map branches to environments
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

## Multi-Branch Pipeline Configuration

For multi-branch pipelines, Jenkins automatically sets `BRANCH_NAME`:

```groovy
pipeline {
    agent any

    stages {
        stage('Auto Environment Detection') {
            steps {
                script {
                    // Environment is automatically detected from BRANCH_NAME
                    def detectedEnv = sh(
                        script: 'node scripts/branch-env-detector.js status',
                        returnStdout: true
                    ).trim()

                    echo "🎯 Detected Environment: ${detectedEnv}"
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                sh 'npm run env:generate'  // Auto-generates .env based on branch
                sh 'npm run build'

                // Deployment happens with correct environment automatically
            }
        }
    }
}
```

## Environment Variable Priority

The system checks environment variables in this order:

1. **Manual Override** (Highest Priority)

   ```groovy
   environment {
       NEXT_PUBLIC_DRUPAL_API_URL = 'http://custom-drupal-server.com'
   }
   ```

2. **Explicit Environment**

   ```groovy
   environment {
       NEXT_PUBLIC_SAIP_ENV = 'production'
   }
   ```

3. **Jenkins Auto-Detection** (Default)
   - `BRANCH_NAME` (Modern Jenkins)
   - `GIT_BRANCH` (Legacy Jenkins)

## Branch to Environment Mapping

| Branch Name                            | Target Environment | SAIP Server                                                           |
| -------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| `development`, `dev`                   | development        | `gp-saip-portals-website-backend-v3.development.internal.saip.gov.sa` |
| `test`, `testing`                      | test               | `gp-saip-portals-website-backend-v3.test.internal.saip.gov.sa`        |
| `staging`, `stage`                     | staging            | `gp-saip-portals-website-backend-v3.staging.internal.saip.gov.sa`     |
| `production`, `prod`, `main`, `master` | production         | `gp-saip-portals-website-backend-v3.production.internal.saip.gov.sa`  |

## Testing Jenkins Setup

You can test the environment detection locally by simulating Jenkins environment variables:

```bash
# Simulate Jenkins development branch
export BRANCH_NAME=development
npm run env:detect

# Simulate Jenkins test branch
export BRANCH_NAME=test
npm run env:detect

# Simulate Jenkins production branch
export BRANCH_NAME=production
npm run env:detect
```

## Troubleshooting

### Issue: Branch not detected in Jenkins

**Solution:** Check if `BRANCH_NAME` or `GIT_BRANCH` is set in Jenkins job configuration.

### Issue: Wrong environment detected

**Solution:** Use explicit environment variable:

```groovy
environment {
    NEXT_PUBLIC_SAIP_ENV = 'production'
}
```

### Issue: Git command fails in Jenkins

**Solution:** Our system automatically falls back to environment variables when git commands fail.

## SAIP-Specific Notes

- All Saudi SAIP servers use the pattern: `gp-saip-portals-website-backend-v3.{environment}.internal.saip.gov.sa`
- VPN connection required for Saudi government infrastructure
- Debug mode automatically disabled in production
- Fallback to `dummyCms` data if Drupal servers unreachable
