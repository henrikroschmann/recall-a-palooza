# Recall-a-palooza

**Version:** 0.0.1

**Type:** Module

Recall-a-palooza is a web application built using React that helps you create and review flashcards for spaced repetition learning. It provides features for creating decks of flashcards, conducting training sessions, and reviewing your progress.

## Table of Contents

- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [Usage](#usage)
- [Features](#features)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [What's next](#what-is-next)
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

## Screenshots

Recall-a-palooza offers an intuitive interface for creating and reviewing flashcards. Here's a sneak peek:

### Deck Creation

Easily create new decks and add flashcards to them. Each flashcard consists of a question and its corresponding answer

![Deck Creation](https://github.com/henrikroschmann/recall-a-palooza/assets/17333/4dfc6678-708d-4fb0-a69c-dd4105e2edf5)

![Muti Answer](https://github.com/henrikroschmann/recall-a-palooza/assets/17333/2c492a4f-8adb-40c2-8682-11ea83654165)

![Flipcards and removal ](https://github.com/henrikroschmann/recall-a-palooza/assets/17333/512bba3a-c692-423d-b9ee-aa1727066728)

### Training Sessions

Select a deck and start a training session. Review each flashcard and rate your performance. The app uses spaced repetition to enhance your learning efficiency.

![Training Session](https://github.com/henrikroschmann/recall-a-palooza/assets/17333/03901f98-e9a1-4287-bc41-5655dde032e5)
![Training Session2](https://github.com/henrikroschmann/recall-a-palooza/assets/17333/384a6606-50c6-4a04-901e-0b368e2ff007)

### Training Reports

After completing a training session, access detailed reports showcasing your performance metrics, including response times and correctness.

![Training Report](https://github.com/henrikroschmann/recall-a-palooza/assets/17333/dcd4fe1d-a7c1-45d4-985e-a7e55d72f8e6)

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
version: "3.8"

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

## What is next

### Present Features:

1. **Session List**: A view to see a list of training sessions.
2. **Training Report**: After each session, a detailed report of the performance.
3. **Training Session**: The main session where users study and answer questions.
4. **Deck Retrieval and Update**: Fetching a deck by its ID and updating it based on user feedback.
5. **Session Creation**: Storing the data of each session.
6. **Interval-based Card Retrieval**: Cards are retrieved for study based on their last reviewed date and their interval.
7. **Card Types**: Different flashcard types including multiple-choice, single answer, and flip cards.
8. **User Feedback**: After answering a card, the user can rate it as easy, medium, or hard to adjust its review interval.
9. **Local Storage**: Storing some session data in local storage.

### Potential Additions or Improvements:

1. **Review Algorithm**: Consider implementing a more sophisticated algorithm like the SuperMemo SM2 algorithm or Anki's algorithm. The interval modification in the current implementation is quite simplistic.
2. **Deck Creation and Management**: Allow users to create, edit, or delete decks and cards within those decks.

3. **User Authentication**: Implement user sign-up, login, and authentication to make it a multi-user platform.

4. **Statistics and Progress**: Graphs or charts to visualize progress over time, including metrics like average correct answers, review intervals, etc.

5. **Tags and Categories**: For better organization of decks and cards.

6. **Reminders**: Push notifications or email reminders for users to review their cards.

7. **Mobile App**: If it's a web application, consider creating a mobile version or even a native app for iOS and Android.

8. **Leitner System**: Integrate a box-based system where cards move between different boxes based on the user's performance.

9. **Media Integration**: Allow users to include images, audio clips, or even short videos in their flashcards.

10. **Search Functionality**: Allow users to search through their decks and cards.

11. **Keyboard Shortcuts**: For power users to navigate through cards and answer options without using the mouse.

12. **Feedback and Reporting**: Allow users to report issues with cards or give feedback.

13. **Offline Mode**: Especially if it's a mobile app, allow users to review cards offline.

14. **Night Mode**: A darker theme for studying in low-light conditions.

15. **Import/Export Functionality**: Allow users to import decks from other platforms or export their decks to share with others.

## License

This project is licensed under the [MIT License](LICENSE).
