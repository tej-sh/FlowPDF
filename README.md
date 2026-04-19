# FlowPDF 📄🌊

FlowPDF is a modern, high-performance React Native mobile application built with Expo to seamlessly view and manage your PDF files. With a clean UI, scoped storage access, and robust PDF rendering, FlowPDF gives you an exceptional reading experience directly on your device.

## ✨ Features

- **Folder Selection & File System Access**: Browse your device's local directories and select folders to scan for PDFs using Android's native Storage Access Framework.
- **High-Performance PDF Rendering**: Built with `react-native-pdf-jsi` for lightning-fast, smooth PDF rendering and interactions.
- **Modern Navigation**: Powered by Expo Router for native-feeling, file-based routing.
- **Fast Lists**: Implements `@shopify/flash-list` for highly performant and smooth virtualization of large lists of local files.
- **State Management**: Uses `zustand` combined with Async Storage to persist your configuration (like root folder preferences) across app launches.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (SDK ~54.0)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **PDF Engine**: [`react-native-pdf-jsi`](https://github.com/react-native-pdf-jsi/react-native-pdf-jsi)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **File System**: `expo-file-system`, `expo-document-picker`
- **Lists**: `@shopify/flash-list`
- **UI & Icons**: `@expo/vector-icons`, `@react-native-vector-icons`

## 🚀 Getting Started

### Prerequisites

You need to have Node.js installed along with the Expo CLI. Since FlowPDF utilizes custom native code (for advanced PDF rendering and extensive file system permissions), it must be run using an **Expo Development Build**. It will not run using the standard Expo Go app.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/floatPDF.git
   cd floatPDF
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running on a Device

Run a clean pre-build and compile the app for your respective platform:

**To run on Android**:
```bash
npx expo run:android
```

**To run on iOS**:
```bash
npx expo run:ios
```

## 📂 Project Structure

```text
├── app/                  # Expo Router views and screens (e.g., index, PdfScreen)
├── components/           # Reusable UI components
│   ├── Folders/          # Folder picking and file system UI
│   └── Pdf/              # PDF viewing elements (Viewer, Header, Modal)
├── store/                # Zustand stores for global state (e.g., rootFolder auth)
├── assets/               # Local assets like images and fonts
├── android/              # Native Android project files
└── package.json          # Dependencies and scripts
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/your-username/floatPDF/issues) if you have any suggestions.

## 📝 License

This project is licensed under the MIT License.
