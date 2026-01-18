# Deploying ConchClub to Google Cloud Run

This guide will walk you through deploying the ConchClub application (Backend + Frontend) to Google Cloud Run.

## Prerequisites

1.  **Google Cloud Project**: You need a Google Cloud Project with billing enabled.
2.  **gcloud CLI**: Install and authenticate the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
    ```powershell
    gcloud auth login
    gcloud config set project conchclub
    ```
3.  **Docker**: Ensure Docker is running locally to build images.

## 1. Setup Environment Variables & Secrets

### Backend Credentials & Service Account
The backend requires `credentials.json` for Google Sheets API access. Following the principle of least privilege, we will create a dedicated service account for the application.

#### 1. Create a Dedicated Service Account
It is **highly recommended** to create a custom service account rather than using the default one.
```powershell
gcloud iam service-accounts create conchclub-runner `
    --display-name="ConchClub Cloud Run Service Account"
```

#### 2. Secret Manager Setup
1.  **Enable the Secret Manager API**:
    ```powershell
    gcloud services enable secretmanager.googleapis.com
    ```
2.  **Create the secrets**:
    ```powershell
    # Store the credentials file
    gcloud secrets create conchclub-credentials --data-file="credentials.json"

    # Store sensitive application settings
    echo "YOUR_JWT_SECRET" | gcloud secrets create jwt-secret --data-file=-
    echo "YOUR_TMDB_KEY" | gcloud secrets create tmdb-key --data-file=-
    echo "YOUR_SHEET_ID" | gcloud secrets create sheet-id --data-file=-
    echo "conchclub" | gcloud secrets create invite-code --data-file=-
    ```
3.  **Grant Access to the Service Account**:
    You can grant access per secret (more secure) or to the entire project (easier).

    **Option A: Project-wide Access (Recommended for simplicity)**:
    ```powershell
    gcloud projects add-iam-policy-binding conchclub `
        --member="serviceAccount:conchclub-runner@conchclub.iam.gserviceaccount.com" `
        --role="roles/secretmanager.secretAccessor"
    ```

    **Option B: Per-Secret Access (More secure)**:
    ```powershell
    $secrets = "conchclub-credentials", "jwt-secret", "tmdb-key", "sheet-id", "invite-code"
    foreach ($s in $secrets) {
        gcloud secrets add-iam-policy-binding $s `
            --member="serviceAccount:conchclub-runner@conchclub.iam.gserviceaccount.com" `
            --role="roles/secretmanager.secretAccessor"
    }
    ```

#### 3. Verify Permissions
To confirm the service account has the correct access, you can check the IAM policy of the secret:
```powershell
gcloud secrets get-iam-policy conchclub-credentials
```
You should see the `conchclub-runner` service account listed under `roles/secretmanager.secretAccessor`.


## 2. Build and Push Docker Images

We will use Google Artifact Registry to store our Docker images.

1.  **Enable Artifact Registry API**:
    ```powershell
    gcloud services enable artifactregistry.googleapis.com run.googleapis.com
    ```
2.  **Create a Repository**:
    ```powershell
    gcloud artifacts repositories create conchclub-repo --repository-format=docker --location=us-central1 --description="ConchClub Docker Repository"
    ```
3.  **Configure Docker to authenticate**:
    ```powershell
    gcloud auth configure-docker us-central1-docker.pkg.dev
    ```

### Build & Push Backend
> [!IMPORTANT]
> Since we updated `SecurityConfig.java`, you **must** rebuild the backend image before pushing.

```powershell
docker build -t us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest -f Dockerfile.backend .
docker push us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest
```


### Build & Push Frontend
```powershell
docker build -t us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest -f client/Dockerfile.frontend ./client
docker push us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest
```

*(Replace `conchclub` with your actual project ID)*

## 3. Deploy Backend Service

Deploy the backend first so we can get the API URL.

```powershell
gcloud run deploy conchclub-backend `
  --image us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest `
  --region us-central1 `
  --allow-unauthenticated `
  --port 8080 `
  --service-account conchclub-runner@conchclub.iam.gserviceaccount.com `
  --set-secrets "/app/credentials.json=conchclub-credentials:latest,`
JWT_SECRET=jwt-secret:latest,`
GOOGLE_SHEETS_ID=sheet-id:latest,`
TMDB_API_KEY=tmdb-key:latest,`
INVITE_CODE=invite-code:latest" `
  --set-env-vars "SPRING_PROFILES_ACTIVE=prod"
```

*Note: The `--set-secrets` flag can mount a secret as a **file** (if you provide a path like `/app/credentials.json`) or map it to an **environment variable** (if you provide a name like `JWT_SECRET`).*

> [!NOTE]
> **Why do I still need the --set-secrets mapping?**
> Even if the service account has project-wide access, Cloud Run needs to know exactly **which** secret maps to **which** environment variable name inside your container. Without this mapping, your Spring Boot app wouldn't find `JWT_SECRET` in its environment.

### 3.1 Troubleshooting Backend Startup
If the deployment fails with "Container failed to start", it is almost always due to missing environment variables or a crash during Spring Boot initialization.

**Check the logs immediately:**
```powershell
gcloud logs read --service conchclub-backend --limit 50
```
Look for `Caused by:` or any `Exception` in the log output to see exactly why it failed.


**Copy the Backend URL** from the output (e.g., `https://conchclub-backend-xyz.a.run.app`).

## 4. Deploy Frontend Service

You need to tell the frontend where the backend is. Since Vite builds static files, we bake the API URL into the image at build time, OR we can use a runtime configuration.

**Vite Environment Variable Approach (Build Time):**
You must rebuild the frontend image with the backend URL.

1.  **Update `.env` locally or pass ARG**:
    Create/Update `client/.env.production`:
    ```
    VITE_API_URL=https://conchclub-backend-xyz.a.run.app
    ```
    *OR* pass it as a build arg if you modify the Dockerfile to accept it.
    
    *Simplest way for now:*
    Update `client/.env.production` with your new Backend URL.

2.  **Rebuild and Push Frontend**:
    ```powershell
    docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/conchclub-repo/frontend:latest -f client/Dockerfile.frontend ./client
    docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/conchclub-repo/frontend:latest
    ```

3.  **Deploy Frontend**:
    ```powershell
    gcloud run deploy conchclub-frontend `
      --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/conchclub-repo/frontend:latest `
      --region us-central1 `
      --allow-unauthenticated `
      --port 80
    ```

## 5. Verification
1.  Go to the **Frontend URL** provided by Cloud Run.
2.  Navigate the app.
3.  Refresh a page to ensure the Nginx 404 fallback (SPA routing) is working.
