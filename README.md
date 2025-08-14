# Encode-Decode Tool

A modern web application built with React, TypeScript, and Tailwind CSS for encoding and decoding various data formats.

## Features

- **Modern UI**: Built with React 19 and TypeScript for type safety
- **Responsive Design**: Tailwind CSS for beautiful, responsive styling
- **Fast Development**: Vite for lightning-fast development and build times
- **Hash Tools**: Built-in hash generation and verification utilities
- **Cross-platform**: Works on Windows, macOS, and Linux

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Package Manager**: npm
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd encode-decode
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
encode-decode/
├── src/
│   ├── App.tsx          # Main application component
│   ├── hashTool.tsx     # Hash generation utilities
│   ├── main.tsx         # Application entry point
│   └── assets/          # Static assets
├── public/               # Public assets
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## Configuration

### Tailwind CSS

The project uses Tailwind CSS v4 with the new `@tailwindcss/postcss` plugin for optimal performance.

### PostCSS

Configured with `@tailwindcss/postcss` and `autoprefixer` for CSS processing.

### TypeScript

Strict TypeScript configuration with separate configs for app and node environments.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
