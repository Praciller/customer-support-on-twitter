# 🔍 SonarCloud Setup Guide

This guide provides step-by-step instructions for setting up SonarCloud code quality analysis for your Customer Support AI project.

## 📋 Prerequisites

- GitHub repository with admin access
- SonarCloud account (free for public repositories)
- Working CI/CD pipeline

## 🚀 SonarCloud Setup Steps

### Step 1: Create SonarCloud Account

1. **Visit SonarCloud**: Go to https://sonarcloud.io
2. **Sign Up**: Click "Sign up" and choose "With GitHub"
3. **Authorize**: Grant SonarCloud access to your GitHub account
4. **Import Organization**: Import your GitHub organization/account

### Step 2: Create SonarCloud Project

1. **Add Project**: Click "+" → "Analyze new project"
2. **Select Repository**: Choose `customer-support-on-twitter`
3. **Set Up Project**: 
   - **Project Key**: `Praciller_customer-support-on-twitter`
   - **Display Name**: `Customer Support AI`
   - **Main Branch**: `main`

### Step 3: Generate SONAR_TOKEN

1. **Go to Security**: Account → My Account → Security
2. **Generate Token**:
   - **Name**: `customer-support-on-twitter-ci`
   - **Type**: `Project Analysis Token`
   - **Project**: Select your project
   - **Expiration**: 90 days (or longer)
3. **Copy Token**: Save the generated token securely

### Step 4: Add GitHub Secret

1. **Repository Settings**: Go to your GitHub repository settings
2. **Secrets and Variables**: Navigate to Secrets and variables → Actions
3. **New Repository Secret**:
   - **Name**: `SONAR_TOKEN`
   - **Value**: Paste the token from Step 3
4. **Save Secret**: Click "Add secret"

### Step 5: Create SonarCloud Configuration

Create `sonar-project.properties` in your repository root:

```properties
# SonarCloud Configuration
sonar.projectKey=Praciller_customer-support-on-twitter
sonar.organization=praciller
sonar.projectName=Customer Support AI
sonar.projectVersion=1.0

# Source code location
sonar.sources=backend,frontend/src
sonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/*.test.js,**/*.test.ts

# Language-specific settings
sonar.python.coverage.reportPaths=backend/coverage.xml
sonar.javascript.lcov.reportPaths=frontend/coverage/lcov.info

# Test locations
sonar.tests=backend/tests,frontend/src
sonar.test.inclusions=**/*test*/**,**/*.test.js,**/*.test.ts,**/*.test.py

# Coverage exclusions
sonar.coverage.exclusions=**/*.test.js,**/*.test.ts,**/*.test.py,**/tests/**
```

### Step 6: Enable SonarCloud in Workflow

Uncomment the SonarCloud step in `.github/workflows/code-quality.yml`:

```yaml
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        continue-on-error: true
```

## 🔧 Advanced Configuration

### Quality Gate Setup

1. **Quality Gates**: Go to SonarCloud project → Quality Gates
2. **Create Custom Gate**: 
   - **Coverage**: > 80%
   - **Duplicated Lines**: < 3%
   - **Maintainability Rating**: A
   - **Reliability Rating**: A
   - **Security Rating**: A

### Branch Analysis

1. **Branch Settings**: Project Settings → Branches & Pull Requests
2. **Configure**:
   - **Main Branch**: `main`
   - **Long-lived Branches**: `develop`, `staging`
   - **Pull Request Analysis**: Enabled

### Notifications

1. **Notifications**: Project Settings → Notifications
2. **Configure**:
   - **Quality Gate Status**: Email + GitHub
   - **New Issues**: GitHub comments
   - **Coverage Changes**: Email

## 📊 Monitoring and Reports

### Quality Dashboard

- **Overview**: https://sonarcloud.io/project/overview?id=Praciller_customer-support-on-twitter
- **Issues**: View bugs, vulnerabilities, and code smells
- **Coverage**: Track test coverage trends
- **Duplications**: Monitor code duplication

### GitHub Integration

- **PR Comments**: Automatic quality feedback on pull requests
- **Status Checks**: Quality gate status in PR checks
- **Badges**: Add quality badges to README.md

### Quality Badges

Add to your README.md:

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Praciller_customer-support-on-twitter&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Praciller_customer-support-on-twitter)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Praciller_customer-support-on-twitter&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Praciller_customer-support-on-twitter)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Praciller_customer-support-on-twitter&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Praciller_customer-support-on-twitter)
```

## 🛠️ Troubleshooting

### Common Issues

**1. Authentication Failed**
- **Check**: SONAR_TOKEN secret is correctly set
- **Verify**: Token has project analysis permissions
- **Solution**: Regenerate token if expired

**2. Project Not Found**
- **Check**: Project key matches sonar-project.properties
- **Verify**: Organization name is correct
- **Solution**: Update configuration files

**3. Analysis Fails**
- **Check**: Source paths are correct
- **Verify**: No syntax errors in source code
- **Solution**: Review SonarCloud logs in GitHub Actions

**4. No Coverage Data**
- **Check**: Coverage reports are generated
- **Verify**: Report paths in sonar-project.properties
- **Solution**: Add coverage generation to CI pipeline

## 🎯 Benefits

### Code Quality
- **Automated Analysis**: Every commit and PR analyzed
- **Quality Metrics**: Track technical debt and maintainability
- **Security Scanning**: Identify vulnerabilities early
- **Best Practices**: Enforce coding standards

### Team Productivity
- **Early Detection**: Find issues before code review
- **Consistent Standards**: Automated quality enforcement
- **Learning Tool**: Educational feedback on code quality
- **Progress Tracking**: Monitor quality improvements over time

---

**Need Help?** Check the [main README](README.md) for additional setup instructions and troubleshooting tips.
