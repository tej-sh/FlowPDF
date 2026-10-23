# FlowPDF 📄🌊

FlowPDF is a React Native mobile application for organizing and reading local PDF files in dedicated workspaces.

The app helps keep your PDFs organized by allowing you to select local folders, automatically find PDF files, and open them in a fast, focused reading environment.

## ✨ Features

- **Local PDF organization**  
  Select folders on your device and organize PDFs into dedicated workspaces.

- **Folder-based file discovery**  
  Browse local directories and scan selected folders for PDF documents.

- **Fast PDF rendering**  
  Uses `react-native-pdf-jsi` for smooth PDF viewing and interaction.

- **Modern navigation**  
  Uses Expo Router for file-based navigation and native-feeling screen transitions.

- **Performant lists**  
  Uses Shopify FlashList for efficient rendering of large PDF collections.

- **Persistent preferences**  
  Uses Zustand and AsyncStorage to remember selected folders and app settings.

- **Mobile-first design**  
  Built for Android and iOS with a clean, focused reading experience.

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Framework:** React Native
- **Platform:** Expo SDK 54
- **Navigation:** Expo Router
- **PDF Rendering:** `react-native-pdf-jsi`
- **State Management:** Zustand
- **Storage:** AsyncStorage
- **File Access:** Expo File System and Expo Document Picker
- **Lists:** Shopify FlashList
- **Icons:** Expo Vector Icons and React Native Vector Icons

## 🚀 Getting Started

### Prerequisites

Install the following tools before running the project:

- Node.js
- npm
- Android Studio for Android development
- Xcode for iOS development on macOS
- Expo development tools

Because FlowPDF uses native PDF rendering and device filesystem access, development builds are recommended instead of relying only on Expo Go.

## Installation

Clone the repository:

```bash
git clone https://github.com/tej-sh/FlowPDF.git
```

Move into the project directory:

```bash
cd FlowPDF
```

Install dependencies:

```bash
npm install
```

## Running the Application

### Start the Expo development server

```bash
npm start
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

### Run on the web

```bash
npm run web
```

### Run linting

```bash
npm run lint
```

## Android Setup

To run FlowPDF on Android:

1. Install Android Studio.
2. Install an Android SDK and create an emulator, or connect a physical Android device.
3. Enable USB debugging if using a physical device.
4. Run:

```bash
npm run android
```

The project includes Android permissions for local file access, downloads, and network state detection.

## iOS Setup

To run FlowPDF on iOS:

1. Use macOS with Xcode installed.
2. Install CocoaPods if required.
3. Start an iOS simulator or connect a physical device.
4. Run:

```bash
npm run ios
```

## Project Structure

```text
FlowPDF/
├── app/                    # Expo Router screens and routes
├── components/             # Reusable UI components
│   ├── Folders/            # Folder selection and file browsing UI
│   └── Pdf/                # PDF viewer components and controls
├── store/                  # Zustand stores and persistent app state
├── assets/                 # Images, icons, fonts, and other assets
├── android/                # Native Android project files
├── scripts/                # Project utility scripts
├── app.json                # Expo configuration
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## How It Works

1. Select a folder from your device.
2. FlowPDF scans the folder for PDF files.
3. Available PDFs are displayed in an organized list.
4. Select a PDF to open it in the built-in viewer.
5. Your folder preferences are saved for future app sessions.

## Important Notes

- FlowPDF works with locally stored PDF files.
- File access behavior may vary between Android and iOS.
- Native PDF functionality may require a development build.
- The application does not upload your PDFs to a server.
- Make sure your device grants the required file access permissions.
- Some platform-specific features may not be fully available on the web.

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo development server |
| `npm run android` | Build and run the app on Android |
| `npm run ios` | Build and run the app on iOS |
| `npm run web` | Start the web version |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Reset the starter project structure |

## Contributing

Contributions, issues, and feature requests are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes.
4. Run the linter:

```bash
npm run lint
```

5. Commit your changes:

```bash
git commit -m "Add your change description"
```

6. Push your branch:

```bash
git push origin feature/your-feature-name
```

7. Open a pull request.

For bugs or feature requests, visit the [Issues page](https://github.com/tej-sh/FlowPDF/issues).

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.