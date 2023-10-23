# Recall-a-palooza

**Version:** 0.0.0

**Type:** Module

Recall-a-palooza is a web application built using React that helps you create and review flashcards for spaced repetition learning. It provides features for creating decks of flashcards, conducting training sessions, and reviewing your progress.


## Screenshots

Recall-a-palooza offers an intuitive interface for creating and reviewing flashcards. Here's a sneak peek:

### Deck Creation
Easily create new decks and add flashcards to them. Each flashcard consists of a question and its corresponding answer.

![Deck Creation](path-to-your-image/deck-creation.png)

### Training Sessions
Select a deck and start a training session. Review each flashcard and rate your performance. The app uses spaced repetition to enhance your learning efficiency.

![Training Session](path-to-your-image/training-session.png)

### Training Reports
After completing a training session, access detailed reports showcasing your performance metrics, including response times and correctness.

![Training Report](path-to-your-image/training-report.png)


## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Features](#features)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with Recall-a-palooza, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd recall-a-palooza
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to access the application.

## Usage

Recall-a-palooza provides the following functionality:

### 1. Create a Deck

- Visit the "Create a Deck" page.
- Add flashcards to your deck by providing questions and answers.
- Save your deck for future training sessions.

### 2. Training Sessions

- Start a training session by selecting a deck.
- Review flashcards in your deck, and rate your performance for each card (easy, medium, or hard).
- Recall-a-palooza uses spaced repetition to schedule card reviews.

### 3. Training Reports

- View training reports for your completed training sessions.
- See statistics on your performance, including response times and correctness.

## Features

- Create and manage flashcard decks.
- Conduct spaced repetition training sessions.
- Track and analyze your training progress with reports.

## Docker Deployment

To deploy Recall-a-palooza using Docker Compose, use the following `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    image: ghcr.io/henrikroschmann/recall-a-palooza:latest
    command: npm run preview --prefix /app/frontend
    ports:
      - "8081:8081"
    depends_on:
      - backend

  backend:
    image: ghcr.io/henrikroschmann/recall-a-palooza:latest
    environment:
      MONGO_URI: "mongodb://mongo:27017/palooza"
    ports:
      - "3066:3066"
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - /store/docker-configs/palooza:/data/db

volumes:
  mongodata:
```

Once you have the `docker-compose.yml` in place, run:

```bash
docker-compose up
```

This will start Recall-a-palooza's frontend, backend, and a MongoDB instance.

## Contributing

Contributions are welcome! If you'd like to contribute to Recall-a-palooza, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test thoroughly.
4. Commit your changes with clear and concise commit messages.
5. Push your branch to your fork.
6. Submit a pull request to the main repository.

Please ensure that your code follows the project's coding standards and conventions.

## License

This project is licensed under the [MIT License](LICENSE).
