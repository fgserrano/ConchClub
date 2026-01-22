# Deploying ConchClub to Google Cloud Run

This guide will walk you through deploying the ConchClub application (Backend + Frontend) to Google Cloud Run, using **MongoDB Atlas**.

## Prerequisites

1.  **Google Cloud Project**: You need a Google Cloud Project with billing enabled.
2.  **gcloud CLI**: Install and authenticate the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
    ```powershell
    gcloud auth login
    gcloud config set project conchclub
    ```
3.  **Docker**: Ensure Docker is running locally to build images.
4.  **MongoDB Atlas Account**: You need an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## 1. MongoDB Atlas Setup

### 1.1 Create the Cluster
1.  Log in to MongoDB Atlas and create a new project.
2.  Create a **Cluster** (M0 Free Tier is sufficient for development, M10+ for production).
3.  Choose **Google Cloud** as the provider and **Iowa (us-central1)** as the region (to match Cloud Run).

### 1.2 Network Access
To allow Cloud Run to connect:
1.  Go to **Network Access** in the Atlas sidebar.
2.  Add IP Address: `0.0.0.0/0` (Allow Access from Anywhere).
    *   *Note: For production, consider using VPC Peering for better security, but `0.0.0.0/0` is the standard way for Cloud Run without detailed VPC configuration.*

### 1.3 Create Database User
1.  Go to **Database Access**.
2.  Add a new database user.
3.  Authentication Method: **Password**.
4.  Username: `conchclub` (or your choice).
5.  Password: Generate a secure password and **save it**.
6.  Database User Privileges: `Read and write to any database` (or specifically for `conchclub` database).

### 1.4 Get Connection String
1.  Go to **Database** > **Connect**.
2.  Choose **Drivers**.
3.  Select **Java** as the driver.
4.  Copy the connection string. It will look like:
    `mongodb+srv://conchclub:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

---

## 2. Setup (Secrets)

### 2.1 Service Account
Create a dedicated service account for the application (if not already created).
```powershell
gcloud iam service-accounts create conchclub-runner `
    --display-name="ConchClub Cloud Run Service Account"
```

### 2.2 Grant Permissions
The service account needs to access **Secret Manager**.
```powershell
gcloud projects add-iam-policy-binding conchclub `
    --member="serviceAccount:conchclub-runner@conchclub.iam.gserviceaccount.com" `
    --role="roles/secretmanager.secretAccessor"
```

### 2.3 Secret Manager Setup
Store sensitive values in Secret Manager.

1.  **Enable API**:
    ```powershell
    gcloud services enable secretmanager.googleapis.com
    ```
2.  **Create Secrets**:
    ```powershell
    # MongoDB URI (Replace with your actual string, inserting the password)
    echo "mongodb+srv://conchclub:YOUR_PASSWORD@cluster0.abcde.mongodb.net/conchclub?retryWrites=true&w=majority" | gcloud secrets create mongodb-uri --data-file=-

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

---

## 4. Deploy Backend Service

Deploy the backend, injecting the MongoDB URI from Secret Manager.

```powershell
gcloud run deploy conchclub-backend `
  --image us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest `
  --region us-central1 `
  --allow-unauthenticated `
  --port 8080 `
  --service-account conchclub-runner@conchclub.iam.gserviceaccount.com `
  --set-secrets="SPRING_DATA_MONGODB_URI=mongodb-uri:latest,`
JWT_SECRET=jwt-secret:latest,`
TMDB_API_KEY=tmdb-key:latest,`
INVITE_CODE=invite-code:latest" `
  --set-env-vars="SPRING_PROFILES_ACTIVE=prod"
```

---

## 5. Deploy Frontend Service

    Deploy Frontend
    
    ```powershell
    gcloud run deploy conchclub-frontend `
      --image us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest `
      --region us-central1 `
      --allow-unauthenticated `
      --port 80
    ```
