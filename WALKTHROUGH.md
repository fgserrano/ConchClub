# ConchClub Verification Walkthrough

## 1. Environment Setup
Before starting, ensure your `src/main/resources/application-local.yml` file contains the necessary keys which can be retrieved with instructions found in `DEPENDENCIES.md`.

## 2. Starting the Backend (Spring Boot)
The project has been migrated to Gradle.

1.  Open a terminal in the project root (`ConchClub/`).
2.  Run the application:
    ```powershell
    ./gradlew bootRun
    ```
    *Note: Verify that it starts on port 8080.*

## 3. Starting the Frontend (React + Vite)
1.  Open a new terminal.
2.  Navigate to the client directory:
    ```powershell
    cd client
    ```
3.  Install dependencies (if you haven't recently):
    ```powershell
    npm install
    ```
4.  Start the dev server:
    ```powershell
    npm run dev
    ```
5.  Open `http://localhost:5173` in your browser.

## 4. Verification Steps

### Step 1: User Registration
1.  Navigate to `http://localhost:5173/register`.
2.  Create a user (e.g., username `testuser`, password `password`, invite code `ANY`).
3.  You will be redirected to Login. Log in with your new credentials.
4.  You should see the "No Active Season" screen initially.

### Step 2: Admin Rights (Critical)
To test the Admin Panel (`/admin`), use the pre-configured admin user:
1.  Log out if you are currently logged in.
2.  Log in with:
    *   Username: `admin`
    *   Password: `password`
3.  This user is automatically created with the `ADMIN` role by `data.sql`.
4.  Navigate to the Admin Panel.

### Step 3: Create a Season (Admin)
1.  Navigate to the Admin Panel (via UI link if present, or `/admin`).
2.  Enter a Season Name (e.g., "Season 1: Sci-Fi") and click **Create**.
3.  Verify the success message.

### Step 4: Submit a Movie (Member)
1.  Go to the Dashboard (`/`).
2.  You should now see the active season.
3.  Search for a movie (e.g., "Inception").
4.  Click to submit.
5.  Verify your "My Submission" card appears.

### Step 5: The Reveal
1.  Return to the Admin Panel (`/admin`).
2.  Click **REVEAL WINNER**.
3.  Go back to the Dashboard (`/`).
4.  Verify the "Official Selection" / Winner card is displayed prominently.
5.  **Google Sheets Verification**: Check your linked Google Sheet. A new row should appear with the winner's details.

## Troubleshooting
*   **Gradle Build Fails**: Ensure you are using Java 17+. Run `java -version` to check.
*   **"No Active Season"**: Ensure you created a season *after* starting the backend (H2 is in-memory and resets on restart).
*   **Login Fails**: Check Browser Console for CORS errors. Ensure backend is running on port 8080.
