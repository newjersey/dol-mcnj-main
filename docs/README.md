# DOL-MCNJ Documentation

This directory contains all project documentation organized by category.

## 📁 Documentation Structure

```
docs/
├── README.md                    # This file - documentation index
├── security/                    # Security and encryption documentation
│   ├── README.md                        # Security documentation index
│   ├── ENCRYPTION_GUIDE.md              # Encryption implementation overview
│   ├── PII_SAFETY_AWS_GUIDE.md          # AWS PII safety configuration
│   └── KMS_KEY_MANAGEMENT.md            # AWS KMS setup and management
├── deployment/                  # Deployment and operations
│   └── ENCRYPTED_SIGNUP_DEPLOYMENT.md  # Encrypted signup deployment guide
├── database/                    # Database documentation
│   ├── data_model.md                   # Data model documentation
│   ├── db_migration_guide.md           # Database migration procedures
│   └── etpl_table_seed_guide.md        # ETPL table seeding guide
└── project/                     # Project management and governance
    ├── CONTRIBUTORS.md                 # Contributor guidelines
    └── decision_log.md                 # Technical decision log
```

## 🚀 Quick Start Guides

### For New Developers
1. Read [`../README.md`](../README.md) - Main project README
2. Review [`project/CONTRIBUTORS.md`](project/CONTRIBUTORS.md) - Contributor guidelines

### For Security Implementation
1. **Start here**: [`deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md`](deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md) - Complete deployment guide
2. **Reference**: [`security/ENCRYPTION_GUIDE.md`](security/ENCRYPTION_GUIDE.md) - Technical details
3. **AWS Setup**: [`security/KMS_KEY_MANAGEMENT.md`](security/KMS_KEY_MANAGEMENT.md) - KMS configuration

### For Database Operations
1. Review [`database/data_model.md`](database/data_model.md) - Data model overview
2. Follow [`database/db_migration_guide.md`](database/db_migration_guide.md) - Migration procedures
3. Use [`database/etpl_table_seed_guide.md`](database/etpl_table_seed_guide.md) - Data seeding

## 📚 Documentation Categories

### 🔐 Security Documentation
Critical security and encryption implementation guides.

| Document | Purpose | Audience |
|----------|---------|----------|
| [`ENCRYPTION_GUIDE.md`](security/ENCRYPTION_GUIDE.md) | Encryption implementation overview | Developers, Architects |
| [`KMS_KEY_MANAGEMENT.md`](security/KMS_KEY_MANAGEMENT.md) | AWS KMS setup and management | DevOps, Security |
| [`PII_SAFETY_AWS_GUIDE.md`](security/PII_SAFETY_AWS_GUIDE.md) | AWS PII safety configuration | Developers, Security |

### 🚀 Deployment Documentation
Operations and deployment procedures.

| Document | Purpose | Audience |
|----------|---------|----------|
| [`ENCRYPTED_SIGNUP_DEPLOYMENT.md`](deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md) | Encrypted signup deployment guide | DevOps, Developers |

### 🗄️ Database Documentation
Database schema, migrations, and operations.

| Document | Purpose | Audience |
|----------|---------|----------|
| [`data_model.md`](database/data_model.md) | Data model documentation | Developers, Analysts |
| [`db_migration_guide.md`](database/db_migration_guide.md) | Database migration procedures | DevOps, Developers |
| [`etpl_table_seed_guide.md`](database/etpl_table_seed_guide.md) | ETPL table seeding guide | DevOps, Data |

### 📋 Project Documentation
Project management, governance, and meta-documentation.

| Document | Purpose | Audience |
|----------|---------|----------|
| [`CONTRIBUTORS.md`](project/CONTRIBUTORS.md) | Contributor guidelines | Developers |
| [`decision_log.md`](project/decision_log.md) | Technical decision log | Team, Architects |

## 🔍 Finding What You Need

### By Use Case
- **Fresh start encryption (Mailchimp migration)**: Start with `deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md`
- **Step-by-step deployment**: Use `deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md`
- **Working with database**: Check `database/` folder
- **Contributing to project**: Read `project/CONTRIBUTORS.md`
- **Understanding past decisions**: Review `project/decision_log.md`

### By Role
- **Developers**: Focus on `security/ENCRYPTION_GUIDE.md` and `database/` docs
- **DevOps Engineers**: Use `deployment/ENCRYPTED_SIGNUP_DEPLOYMENT.md` and `security/KMS_KEY_MANAGEMENT.md`
- **Security Team**: Review all `security/` documentation
- **Project Managers**: Check `project/` documentation

## 📝 Documentation Standards

### File Naming
- Use SCREAMING_SNAKE_CASE for major guides (e.g., `DEPLOYMENT_CHECKLIST.md`)
- Use snake_case for specific technical docs (e.g., `data_model.md`)
- Include purpose in filename for clarity

### Content Standards
- Include table of contents for long documents
- Use clear headings and section organization
- Provide examples and code snippets where helpful
- Include troubleshooting sections for operational docs
- Cross-reference related documents

### Maintenance
- Review quarterly for accuracy
- Update when implementation changes

## 🔗 Related Files

- [`../README.md`](../README.md) - Main project README
- [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) - Code of conduct
- [`../LICENSE`](../LICENSE) - Project license