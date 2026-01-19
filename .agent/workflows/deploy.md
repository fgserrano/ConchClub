---
description: Build and Deploy to Cloud Run
---

// turbo
1. Build and Push Backend Image
   ```powershell
   docker build -t us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest -f docker/Dockerfile.backend .
   docker push us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest
   ```

2. Deploy Backend Service
   Wait for step 1 to finish, then:
   ```powershell
   gcloud run deploy conchclub-backend `
     --image us-central1-docker.pkg.dev/conchclub/conchclub-repo/backend:latest `
     --region us-central1 `
     --allow-unauthenticated `
     --port 8080 `
     --service-account conchclub-runner@conchclub.iam.gserviceaccount.com `
     --add-cloudsql-instances="conchclub:us-central1:conchclub-db" `
     --set-secrets="SPRING_DATASOURCE_PASSWORD=db-password:latest,JWT_SECRET=jwt-secret:latest,TMDB_API_KEY=tmdb-key:latest,INVITE_CODE=invite-code:latest" `
     --set-env-vars="SPRING_PROFILES_ACTIVE=prod,SPRING_DATASOURCE_URL=jdbc:mysql:///conchclub?unixSocketPath=/cloudsql/conchclub:us-central1:conchclub-db&socketFactory=com.google.cloud.sql.mysql.SocketFactory&cloudSqlInstance=conchclub:us-central1:conchclub-db,SPRING_DATASOURCE_USERNAME=conchclub"
   ```

3. Check that the backend deployment succeeded before proceeding by reading the logs.

4. Update Frontend Environment
   Check the output of the previous command for the backend URL. Update `client/.env.production` if the URL has changed.

// turbo
5. Build and Push Frontend Image
   ```powershell
   docker build -t us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest -f client/Dockerfile.frontend ./client
   docker push us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest
   ```

6. Deploy Frontend Service
   Wait for step 1 to finish, then:
   ```powershell
   gcloud run deploy conchclub-frontend `
     --image us-central1-docker.pkg.dev/conchclub/conchclub-repo/frontend:latest `
     --region us-central1 `
     --allow-unauthenticated `
     --port 80
   ```