# Project Dependencies & Setup

## Environment Setup

### 1. Create the Local Configuration File
Create a new file named `application-local.yml` in `src/main/resources/`. This file will store your sensitive configuration.

> [!CAUTION]
> **Security Warning**
> **NEVER** commit your `application-local.yml` file to version control. It contains secrets like your API keys and database credentials.
>
> We have pre-configured `.gitignore` to exclude this file.

### 2. Configure Variables
Copy the following template into your `src/main/resources/application-local.yml` file and fill in the values:

```yaml
# Local configuration (DO NOT COMMIT THIS FILE)
jwt:
  secret: your_super_secret_jwt_key_base64_encoded

google:
  credentials:
    path: ./credentials.json
  sheet:
    id: your_sheet_id_here

tmdb:
  api:
    key: your_tmdb_read_access_token
```

## Google Sheets

Please see [aux_setup/GOOGLE_SHEETS.md](aux_setup/GOOGLE_SHEETS.md) for detailed step-by-step instructions.

## TMDB Setup
1. Register at [themoviedb.org](https://www.themoviedb.org/documentation/api).
2. Get your API Key (v3) or Read Access Token (v4).
