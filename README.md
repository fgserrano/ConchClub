# 🐚 Conch Club

Conch Club is a specialized web application designed to manage and facilitate a movie club. It streamlines the process of movie submissions, themed seasons, and the random selection of movies for weekly screenings.

## 🚀 Key Features

- **Season Management**: Admins can create and manage themed seasons.
- **Movie Submissions**: Users can search for and submit movies via integration with The Movie Database (TMDB).
- **Automated Winner Reveal**: Randomly select and reveal movies for sessions.
- **Google Sheets Integration**: Automatically syncs winner data to a shared Google Sheet for tracking.
- **Security**: Robust authentication and role-based access control (Admin/Member).

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: H2 (In-memory for development)
- **Security**: Spring Security + JJWT
- **Integrations**: Google Sheets API, TMDB API

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4, Framer Motion (Animations)
- **State Management**: React Hooks
- **Icons**: Lucide React

## 🏁 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js (Latest LTS recommended)
- TMDB API Key
- Google Cloud Credentials (for Sheets integration)

### Backend Setup

1.  **Configure Environment**: 
    Create a new file named `application-local.yml` in `src/main/resources/`. This file stores sensitive configuration and is excluded from version control.

    Copy the following template and fill in your values:

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

2.  **Google API Credentials**:
    Create a `credentials.json` file in the project root. For detailed instructions on generating this file and setting up the Google Sheets integration, see the **[Google Sheets Setup Guide](aux_setup/GOOGLE_SHEETS.md)**.

3.  **TMDB Setup**:
    - Register at [themoviedb.org](https://www.themoviedb.org/documentation/api).
    - Get your API Key (v3) or Read Access Token (v4) and add it to `application-local.yml`.

4.  **Run Application**:
    ```bash
    ./gradlew bootRun
    ```


### Frontend Setup
1.  **Navigate to Client**:
    ```bash
    cd client
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## ⚖️ Credits
This product uses the TMDB API but is not endorsed or certified by TMDB.