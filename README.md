# News Aggregator

A modern news aggregator application that pulls articles from multiple sources and displays them in a clean, easy-to-read format.

## Features

- **Multi-source News Aggregation**: Fetches news from NewsAPI, The Guardian, and The New York Times
- **Article Search and Filtering**: Search for articles by keyword and filter by date, category, and source
- **Personalized News Feed**: Customize your news feed by selecting preferred sources and categories
- **Mobile-responsive Design**: Optimized for viewing on all device sizes

## Tech Stack

- **Frontend**: Next.js 15 with React 19, TypeScript, and TailwindCSS
- **API Integration**: Multiple news sources with unified data model
- **State Management**: React hooks and Context API
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 20.x or later
- Yarn package manager
- API keys for the news sources:
  - NewsAPI: [Get API Key](https://newsapi.org/register)
  - The Guardian: [Get API Key](https://open-platform.theguardian.com/access/)
  - New York Times: [Get API Key](https://developer.nytimes.com/get-started)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEWS_API_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_api_key
NYT_API_KEY=your_nyt_api_key
```

### Installation

```bash
# Install dependencies
yarn install

# Run the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Setup

### Building the Docker Image

```bash
docker build -t news-aggregator .
```

### Running the Container

```bash
docker run -p 3000:3000 --env-file .env.local news-aggregator
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js app router pages
├── components/           # React components
│   ├── layout/           # Layout components
│   ├── news/             # News-related components
│   └── ui/               # UI components
├── lib/                  # Utility functions and hooks
│   ├── api/              # API integration services
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
