# 🚀 Vocab-Flashcards

**Vocab-Flashcards** is a progressive web-based learning application designed to help users master new vocabulary through interactive methods. It features a full CRUD card management system powered by Firebase and an intelligent quiz mode to test retention effectively.

---

<img src="/src/assets/preview-app.png">

## ✨ Key Features

* **📚 Vocabulary Library**: Seamlessly save, edit, and search for new words in real-time.
* **🚀 Dynamic Quiz Mode**: Test your knowledge with 4 automated question types:
    * *Multiple Choice Definition*: Choose the correct meaning.
    * *Reverse Challenge*: Find the word based on its definition.
    * *True/False Check*: Quickly validate word meanings.
    * *Contextual Fill*: Complete sentences (Cloze deletion) using smart logic.
* **🎙️ Listening Quiz**: Sharpen your ears! The AI reads the word aloud, and you must type it correctly (Maximum 3 listens per word).
* **📊 Performance Analytics**: Track your scores, average response speed, and identify your "Hardest Challenge" to focus on difficult words.
* **🌙 Dark Mode Support**: A modern, responsive interface designed for eye comfort during late-night study sessions.

---

## 🛠️ Tech Stack

* **Frontend**: [React.js](https://reactjs.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animation**: [Framer Motion](https://www.framer.com/motion/)
* **Backend**: [Firebase Firestore](https://firebase.google.com/)
* **Voice**: Web Speech API (Synthesis)

---

## ⚙️ Installation

Follow these steps to run the project locally:

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/username/vocab-flashcards.git](https://github.com/username/vocab-flashcards.git)
    cd vocab-flashcards
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the Application**
    ```bash
    npm start
    ```

---

## 📖 How to Use

1.  **Add Words**: Type a word in the search bar. If it doesn't exist, the **"+ Add New"** button will appear automatically.
2.  **Manage Cards**: Click on any card to edit the definition or example sentence if you need to update information.
3.  **Quiz Modes**:
    * Click **"Start Quiz"** for text-based challenges (Multiple choice & Context).
    * Click **"Voice Quiz"** to practice spelling based on audio cues.
4.  **Review**: Check the results panel at the end of each quiz to see your learning progress and response speed.

---

## 🛡️ Data Security

This application uses environment variables to protect Firebase credentials. Ensure that your `.env` file is listed in `.gitignore` before pushing to any public repository.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ to simplify the language learning journey.