![github](https://img.shields.io/badge/GitHub-000000.svg?style=for-the-badge&logo=GitHub&logoColor=white)
![markdown](https://img.shields.io/badge/Markdown-000000.svg?style=for-the-badge&logo=Markdown&logoColor=white)

# WanderTales - Personal Travel Log

WanderTales is a personal travel log designed to help users effortlessly document and store their travel stories. It provides a simple, intuitive platform to capture and organize memories of the places they've visited, creating a digital journey archive.

## Features

- **Easy Travel Logging**: Effortlessly record your travel experiences, including destination details, photos, and personal stories.
- **Memory Organization**: Sort and filter your travel stories by location, date, or category.
- **Photo Uploads**: Upload images to accompany your travel stories.
- **Search Functionality**: Easily find your past travels using search filters.
- **User Authentication**: Secure login and registration system to protect your travel data.

## 🚀 Tech Stack

- **Frontend**: React.js ⚛️ | HTML5 🌐 | CSS3 🎨
- **Backend**: Node.js 💻 | Express.js 🛠️
- **Database**: MongoDB 🍃
- **Authentication**: JWT 🔑

## Getting Started

Follow these steps to set up the project locally:

> [!IMPORTANT]
> <h2>Prerequisites</h2>
> <p>Make sure you have the following installed:</p>
> <ul>
>   <li>Node.js (v14 or higher)</li>
>   <li>MongoDB</li>
>   <li>Git</li>
> </ul>

### Clone the Repository

```bash
git clone https://github.com/hritesh-saha/WanderTales.git
cd WanderTales
```
### Install Dependencies

1. Install backend dependencies:

    ```bash
    cd backend
    npm install
    ```

2. Install frontend dependencies:

    ```bash
    cd travel-story
    npm install
    ```

### Setup Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```env
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_jwt_secret
PORT=5000
```

### Run the Project

1. Start the backend:

    ```bash
    cd backend
    npm start
    ```

2. Start the frontend:

    ```bash
    cd frontend
    npm run dev
    ```

The app should now be running on [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:5000](http://localhost:5000) for the backend.

<p align="center"><a href="https://github.com/hritesh-saha/WanderTales/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=BSD-3-Clause&logoColor=d9e0ee&colorA=363a4f&colorB=b7bdf8"/></a></p>
