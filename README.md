# 🐚 Conch Club

Conch Club is a specialized web application designed to manage and facilitate a movie club. It streamlines the process of movie submissions, themed seasons, and the random selection of movies for weekly screenings.

## 🚀 Key Features

- **Season Management**: Admins can create and manage themed seasons.
- **Movie Submissions**: Users can search for and submit movies via integration with The Movie Database (TMDB).
- **Automated Winner Reveal**: Randomly select and reveal movies for sessions.
- **Security**: Robust authentication and role-based access control (Admin/Member).

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: H2 (In-memory for development)
- **Security**: Spring Security + JJWT
- **Integrations**: TMDB API

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

    tmdb:
      api:
        key: your_tmdb_read_access_token
    ```

2.  **TMDB Setup**:
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