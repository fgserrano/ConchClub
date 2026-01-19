# Deploying ConchClub to Google Cloud Run

This guide will walk you through deploying the ConchClub application (Backend + Frontend) to Google Cloud Run, using **Cloud SQL (PostgreSQL)**.

## Prerequisites

1.  **Google Cloud Project**: You need a Google Cloud Project with billing enabled.
2.  **gcloud CLI**: Install and authenticate the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
    ```powershell
    gcloud auth login
    gcloud config set project conchclub
    ```
3.  **Docker**: Ensure Docker is running locally to build images.

## 1. Cloud SQL Setup

Since we moved to PostgreSQL, we need a managed database instance.

### 1.1 Create the Instance
```powershell
# Create a MySQL 8.0 instance
gcloud sql instances create conchclub-db `
    --database-version=MYSQL_8_0 `
    --cpu=1 `
    --memory=3840MB `
    --region=us-central1
```

### 1.2 Create Database & User
```powershell
# Create the database
gcloud sql databases create conchclub --instance=conchclub-db

# Create the user (replace PASSWORD with a strong password)
gcloud sql users create conchclub --host=% --instance=conchclub-db --password="YOUR_DB_PASSWORD"
```


### 1.3 Get Connection Name
You will need this string later (Format: `PROJECT_ID:REGION:INSTANCE_ID`).
```powershell
gcloud sql instances describe conchclub-db --format='value(connectionName)'
```

---

## 2. Setup Environment Variables & Secrets

### 2.1 Service Account
Create a dedicated service account for the application.
```powershell
gcloud iam service-accounts create conchclub-runner `
    --display-name="ConchClub Cloud Run Service Account"
```

### 2.2 Grant Permissions
The service account needs to access **Secret Manager** and **Cloud SQL**.
```powershell
# Grant Secret Access
gcloud projects add-iam-policy-binding conchclub `
    --member="serviceAccount:conchclub-runner@conchclub.iam.gserviceaccount.com" `
    --role="roles/secretmanager.secretAccessor"

# Grant Cloud SQL Client Access
gcloud projects add-iam-policy-binding conchclub `
    --member="serviceAccount:conchclub-runner@conchclub.iam.gserviceaccount.com" `
    --role="roles/cloudsql.client"
```

### 2.3 Secret Manager Setup
Store sensitive values in Secret Manager.

1.  **Enable API**:
    ```powershell
    gcloud services enable secretmanager.googleapis.com
    ```
2.  **Create Secrets**:
    ```powershell
    # Database Password (The one you set in Step 1.2)
    echo "YOUR_DB_PASSWORD" | gcloud secrets create db-password --data-file=-

    # Other App Secrets
    echo "YOUR_JWT_SECRET" | gcloud secrets create jwt-secret --data-file=-
    echo "YOUR_TMDB_KEY" | gcloud secrets create tmdb-key --data-file=-
    echo "conchclub" | gcloud secrets create invite-code --data-file=-
    ```

---

## 3. Build and Push Docker Images

1.  **Enable Artifact Registry API**:
    ```powershell
    gcloud services enable artifactregistry.googleapis.com run.googleapis.com
    ```
2.  **Create Repository**:
    ```powershell
    gcloud artifacts repositories create conchclub-repo --repository-format=docker --location=us-central1 --description="ConchClub Docker Repository"
    ```
3.  **Configure Docker**:
    ```powershell
    gcloud auth configure-docker us-central1-docker.pkg.dev
    ```

### Build & Push Backend
```powershell
docker build -t us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest -f docker/Dockerfile.backend .
docker push us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest
```

### Build & Push Frontend
```powershell
docker build -t us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest -f docker/Dockerfile.frontend ./client
docker push us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest
```

*(Replace `conchclub` with your actual project ID)*

---

## 4. Deploy Backend Service

We need to tell Cloud Run to connect to Cloud SQL. This is done via `--add-cloudsql-instances` and passing the DB configuration variables.

> [!IMPORTANT]
> Replace `INSTANCE_CONNECTION_NAME` with the value from Step 1.3 (e.g., `conchclub:us-central1:conchclub-db`).

```powershell
gcloud run deploy conchclub-backend `
  --image us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest `
  --region us-central1 `
  --allow-unauthenticated `
  --port 8080 `
  --service-account conchclub-runner@conchclub.iam.gserviceaccount.com `
  --add-cloudsql-instances="conchclub:us-central1:conchclub-db" `
  --set-secrets="SPRING_DATASOURCE_PASSWORD=db-password:latest,`
JWT_SECRET=jwt-secret:latest,`
TMDB_API_KEY=tmdb-key:latest,`
INVITE_CODE=invite-code:latest" `
  --set-env-vars="SPRING_PROFILES_ACTIVE=prod,`
SPRING_DATASOURCE_URL=jdbc:mysql:///conchclub?unixSocketPath=/cloudsql/conchclub:us-central1:conchclub-db&socketFactory=com.google.cloud.sql.mysql.SocketFactory&cloudSqlInstance=conchclub:us-central1:conchclub-db,`
SPRING_DATASOURCE_USERNAME=conchclub"
```

*Note: For MySQL on Cloud Run, we use the `jdbc:mysql:///DB_NAME` format with `unixSocketPath` pointing to the `/cloudsql/INSTANCE_CONNECTION_NAME` socket.*

---

## 5. Deploy Frontend Service

1.  **Update `client/.env.production`** with your new Backend URL (obtained from the backend deployment output).
    ```
    VITE_API_URL=https://conchclub-backend-xyz.a.run.app
    ```
2.  **Rebuild and Push Frontend**:
    ```powershell
    docker build -t us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest -f client/Dockerfile.frontend ./client
    docker push us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest
    ```
3.  **Deploy Frontend**:
    ```powershell
    gcloud run deploy conchclub-frontend `
      --image us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest `
      --region us-central1 `
      --allow-unauthenticated `
      --port 80
    ```

---

## 6. Automating with Cloud Build

If you are using the `cloudbuild.yaml` file, you need to update it to include the Cloud SQL parameters.

**Update your `cloudbuild.yaml` deployment step:**

```yaml
  # 4. Deploy Backend to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'conchclub-backend'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/conchclub-repo/backend:latest'
      - '--region=us-central1'
      - '--add-cloudsql-instances=YOUR_INSTANCE_CONNECTION_NAME'  # <--- UPDATE THIS
      - '--service-account=conchclub-runner@$PROJECT_ID.iam.gserviceaccount.com'
      - '--set-secrets=SPRING_DATASOURCE_PASSWORD=db-password:latest,JWT_SECRET=jwt-secret:latest,TMDB_API_KEY=tmdb-key:latest,INVITE_CODE=invite-code:latest'
      - '--set-env-vars=SPRING_PROFILES_ACTIVE=prod,SPRING_DATASOURCE_URL=jdbc:postgresql:///conchclub?host=/cloudsql/YOUR_INSTANCE_CONNECTION_NAME,SPRING_DATASOURCE_USERNAME=conchclub'
```
*(Ideally, use substitutions like `_DB_INSTANCE` in Cloud Build trigger settings to avoid hardcoding the instance name).*
