# Notion Clone

## Table of Contents

- [About The Project](#about-the-project)
  - [Built with](#built-with)
  - [Hosting](#hosting)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Production](#production)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## About The Project

![first page](/img/first_page.png)

Create and Edit Notes like in Notion!

This project is a clone of the popular note-taking app [Notion](https://www.notion.so/) for educational purposes.
It's might not be ready for production use.

Visit Here: <https://pepponz.codes>

PS. First request after a while might failed because backend spin down due to inactivity. Just refresh the page and it should work.

## Built with

### Frontend

- Next.js
- React
- Tailwind CSS
- TypeScript

### Backend

- Node.js
- Express.js
- Supabase (PostgreSQL) with Prisma
- TypeScript

## Hosting

- [Vercel](https://vercel.com) (Frontend)
- [Render](https://render.com) (Backend)
- [Supabase](https://supabase.com) (Database)

## Getting Started

### Prerequisites

- Install yarn package manager (required node.js)

    ```bash
    npm install -g yarn
    ```

- Postgres Database and Storage (You can use [Supabase](https://supabase.com) for free)

  - Storage must be created with the name `dev` for development and `prod` for production

### Installation

1. Clone the repo

    ```bash
    git clone https://github.com/Puwanut/Collaboration-Note-Platform.git
    ```

2. Change directory to the frontend folder

    ```bash
    cd frontend
    ```

3. Install packages

    ```bash
    yarn install
    ```

4. Create `.env.local` file in the frontend folder and add secrets according to [.env.example](/frontend/.env.example) file. (For now you can leave `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as any string)

    ```bash
    NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
    NEXTAUTH_SECRET=xxx # you can generate one via openssl command `$ openssl rand -base64 32`
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

5. Start development server

    ```bash
    yarn dev
    ```

6. Change directory to the backend folder

    ```bash
    cd ../backend
    ```

7. Install packages

    ```bash
    yarn install
    ```

8. Create `.env` file in the backend folder and add secrets according to [.env.example](/backend/.env.example) file.

    ```bash
    PORT=8000
    DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
    CLIENT_URL=http://localhost:3000 # Frontend URL
    ACCESS_TOKEN_SECRET=xxx # you can generate one via openssl command `$ openssl rand -base64 32`
    SUPABASE_URL=https://xxx.supabase.co
    SUPABASE_API_KEY=xxx
    ```

9. Sync database schema

    ```bash
    yarn prisma migrate dev
    ```

10. Start development server

    ```bash
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

- To Sync database schema in production

    ```bash
    yarn prisma migrate deploy
    ```

- To build the frontend/backend project

    ```bash
    yarn build
    ```

- To start the frontend/backend server

    ```bash
    yarn start
    ```

## Roadmap

- [x] **Slash Commands** (Type `/` to turn or add a block into various types)
- [x] **HTML Support** (Can use HTML tags like `<img>` in the editor)
- [x] **Drag And Drop** (Can drag and drop blocks to reorder them)
- [x] **Rich Text Editing** (Can edit text with various formatting options: **bold**, *italic*, underline)
- [x] **Code Block** (Can add code blocks with syntax highlighting)
- [ ] **Page icon** (Can change your favourite icon to the page)
- [ ] **Workspace** (Working together with other people in a workspace)
- [ ] **Private and Public Notes** (Share notes with other people)
- [ ] **Nested Blocks** (Can add blocks inside other blocks)
- [ ] **Sign in with Google** (Sign in with Google account)
- [ ] **Collaborative Realtime Editing** (Edit notes with other people in real time)

## License

Distributed under the MIT License. See [LICENSE.txt](/LICENSE.txt) for more information.

## Contact

Puwanut Janmee - puwanut.jm@gmail.com

## Acknowledgements

This project can't be done without these resources:

- [Notion](https://www.notion.so/) - The inspiration for this project
- [Notion Data Model](https://www.notion.so/blog/data-model-behind-notion) - The data model behind Notion
- [Notion Cloning Guide](https://medium.com/swlh/how-to-build-a-text-editor-like-notion-c510aedfdfcc) - How to build a text editor like Notion

And others I didn't mention here.
