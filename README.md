# 🤖 Mahesh's AI Agent

A modern React + TypeScript chatbot powered by the Groq API, featuring real-time conversations with persistent chat history.

## ✨ Features

- 💬 Real-time chat interface with Groq API integration
- 💾 Persistent chat history using localStorage
- 🎨 Beautiful Tailwind CSS styling with gradient backgrounds
- ⚡ Fast responses using Llama 3.1 8B model
- 📱 Responsive design for all devices
- 🔄 Smooth loading states with visual feedback

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **API**: Groq (Llama 3.1 8B)
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Groq API key (get one at [console.groq.com](https://console.groq.com))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the `aiagent/` directory:
```bash
VITE_GROQ_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
cd aiagent
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
ai-agent/
├── package.json          # Root dependencies
├── tsconfig.json         # Root TypeScript config
├── .gitignore           # Git ignore rules
├── aiagent/
│   ├── src/
│   │   ├── App.tsx      # Main chat component
│   │   ├── main.tsx     # Entry point
│   │   ├── App.css      # Styles
│   │   └── index.css    # Global styles
│   ├── vite.config.ts   # Vite configuration
│   ├── tsconfig.*.json  # TypeScript configs
│   ├── index.html       # HTML template
│   └── package.json     # App-specific dependencies
└── README.md            # This file
```

## 🔐 Security

⚠️ **Important**: Never commit your `.env.local` file or API keys to version control. The `.gitignore` is configured to prevent this.

## 📝 Environment Variables

- `VITE_GROQ_API_KEY`: Your Groq API key (required for chat functionality)

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by [Groq API](https://console.groq.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
