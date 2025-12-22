# I Call On 🎮

A real-time multiplayer word game where players compete to come up with words starting with a specific letter across different categories.

## 🎯 Game Overview

Players race against the clock to provide answers for four categories (Name, Animal, Place, Thing) that start with a randomly selected letter. The host reviews and validates answers, awarding points for correct submissions. The player with the most points at the end wins!

## ✨ Features

- 🎮 **Real-time Multiplayer** - Play with friends in real-time using Supabase real-time subscriptions
- ⏱️ **Timed Rounds** - Configurable countdown timer for each round
- 📊 **Live Leaderboard** - Track scores and rankings in real-time
- 🎨 **Modern UI** - Beautiful, responsive design with glassmorphism effects
- 💾 **Auto-save** - Answers are automatically saved as you type
- 🏆 **Final Results** - Comprehensive leaderboard with round-by-round breakdown
- 📱 **Mobile Responsive** - Fully optimized for mobile and desktop

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Real-time**: Supabase Realtime
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevAdedeji/ICallOn
   cd ICallOn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_connection_string
   ```

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:4040) in your browser

## 🎮 How to Play

### For Hosts:
1. Create a new game room
2. Share the room code with players
3. Wait for players to join in the lobby
4. Start the game when ready
5. Select a letter for each round
6. Review and validate player answers after each round
7. View final results and leaderboard

### For Players:
1. Join a game using the room code
2. Wait in the lobby for the host to start
3. When the round starts, quickly fill in answers for:
   - **Name** (person's name)
   - **Animal** (animal name)
   - **Place** (location/place name)
   - **Thing** (object/thing name)
4. Submit before time runs out!
5. Wait for the host to review answers
6. Check the final leaderboard

## 📁 Project Structure

```
i-call-on/
├── src/
│   ├── actions/          # Server actions
│   │   ├── answers.ts
│   │   ├── leaderboard.ts
│   │   ├── players.ts
│   │   ├── rooms.ts
│   │   ├── rounds.ts
│   │   └── users.ts
│   ├── components/       # React components
│   │   ├── game/        # Game-specific components
│   │   └── ui/          # Reusable UI components
│   ├── db/              # Database schema and config
│   │   └── schema.ts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   │   ├── supabase/    # Supabase client setup
│   │   └── utils.ts
│   └── app/             # Next.js app router pages
├── public/              # Static assets
└── package.json
```

## 🗄️ Database Schema

### Main Tables:
- **users** - Registered users
- **rooms** - Game rooms/sessions
- **players** - Players in each room (including guests)
- **rounds** - Individual game rounds
- **answers** - Player submissions for each round

## 🚀 Features in Detail

### Real-time Updates
- Player joins/leaves are broadcast instantly
- Timer synchronizes across all clients
- Answer submissions update in real-time
- Round status changes propagate immediately

### Auto-save Functionality
- Answers are debounced and saved every second
- Progress is preserved even on page refresh
- No data loss during network interruptions

### Scoring System
- 10 points per validated answer
- Host reviews and marks answers as valid/invalid
- Final leaderboard aggregates all round scores
- Tie-handling for equal scores

## 🐛 Known Issues
- Timer synchronization may drift slightly over long periods
- Connection recovery after network interruption requires manual refresh

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
