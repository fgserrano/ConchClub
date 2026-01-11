# Google Sheets Setup

### 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown at the top and select **New Project**.
3. Name your project (e.g., "ConchClub") and click **Create**.

### 2. Enable the Google Sheets API
1. Select your new project.
2. In the search bar at the top, type "Google Sheets API" and select it.
3. Click **Enable**.

### 3. Create a Service Account
1. In the navigation menu, go to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **Service Account**.
3. Fill in the details:
   - **Service account name**: e.g., "conch-club-bot".
   - **Service account ID**: auto-filled.
   - Click **Create and Continue**.
4. (Optional) Role: You can skip this or choose **Project > Editor** if you want it to have broad access, but strictly speaking, it just needs to exist for now.
5. Click **Done**.
6. You will see your new service account in the list. Copy the **Email** (e.g., `conch-club-bot@project-id.iam.gserviceaccount.com`); you will need this for Step 5.

### 4. Create Credentials (JSON Key)
> [!IMPORTANT]
> **What are these keys for?**
> This JSON file contains the private key and identification that validates your application to Google. It acts like a username and password for your backend to access the spreadsheet.

1. Click on the pencil icon (Edit) or the email address of the service account you just created.
2. Go to the **Keys** tab.
3. Click **Add Key** > **Create new key**.
4. Select **JSON** and click **Create**.
5. A file will automatically download to your computer.
6. **Rename** this file to `credentials.json`.
7. **Move** this file to the root directory of this project (`ConchClub/ConchClub/credentials.json`).

> [!CAUTION]
> **Security Warning**
> Never share this file or commit it to Git. Ensure `credentials.json` is listed in your `.gitignore` file. If this key is exposed, anyone can impersonate your service account.

### 5. Create and Share the Sheet
1. Go to [Google Sheets](https://docs.google.com/spreadsheets) and create a new blank sheet.
2. Name it (e.g., "ConchClub DB").
3. Click the **Share** button (top right).
4. Paste the **Service Account Email** you copied in Step 3.
5. Ensure the permission is set to **Editor**.
6. Uncheck "Notify people" (optional) and click **Share**.

### 6. Get the Spreadsheet ID
1. Look at the URL of your new Google Sheet.
   `https://docs.google.com/spreadsheets/d/1aBcD...XYZ/edit#gid=0`
2. The long string between `/d/` and `/edit` is your **Spreadsheet ID**.
3. Copy this ID and paste it into your `src/main/resources/application-local.yml` file as `google.sheet.id`.
