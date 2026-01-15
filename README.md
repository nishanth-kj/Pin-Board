# ✨ Pin-Board Pro

**Pin-Board Pro** is a modern, lightweight desktop application that lets you stick **floating notes (pins)** anywhere on your screen. Keep your to-dos, reminders, and thoughts always visible above other windows.

Built with **Rust** and **egui** for blazing speed and minimal resource usage.

🌐 **Website**: [nishanth-kj.github.io/Pin-Board](https://nishanth-kj.github.io/Pin-Board)

## 🚀 Features

- **Floating Pins**: Create multiple sticky notes that float above all other windows.
- **Always On Top**: Pins stay visible so you never miss a reminder.
- **Deadlines & Timers**: Set quick countdowns (5m, 15m, 1h) or custom deadlines. Timers turn red when overdue!
- **Modern UI**: Clean, glass-morphic pastel aesthetics with per-pin opacity control.
- **Resizable**: Drag the bottom-right corner (⇲) to resize any pin.
- **Persistence**: Your pins and their positions are saved automatically.
- **Cross-Platform**: Runs on Windows, macOS, and Linux.

## 📦 Installation

### Download Binaries
Go to the [Releases](https://github.com/nishanth-kj/Pin-Board/releases) page to download the latest version for your OS.

### Build from Source
If you prefer to build it yourself:

1.  **Install Rust**: [rustup.rs](https://rustup.rs/)
2.  **Clone the repo**:
    ```bash
    git clone https://github.com/nishanth-kj/Pin-Board.git
    cd Pin-Board
    ```
3.  **Run**:
    ```bash
    cargo run --release
    ```

## 🛠 Usage

1.  **Create a Pin**: Use the Dashboard to type a note and click "➕ Create Pin".
2.  **Add Timer**: Use the minute input or quick buttons (+5, +15) to set a deadline.
3.  **Manage Pins**:
    - **Move**: Drag the empty space in the pin header.
    - **Resize**: Drag the ⇲ icon in the bottom-right.
    - **Settings**: Click ⚙ to change opacity.
    - **Color**: Click the colored dots at the bottom to categorize your pins.
    - **Delete**: Click ❌ to remove a pin.
4.  **Hide/Show All**: Use the buttons on the dashboard to quickly toggle visibility.

## 🤝 Contributing
Contributions are welcome! Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

## 📚 Documentation
- [Build Instructions](docs/BUILD.md)
- [Release Notes](release/RELEASE.md)
- [Contributing](docs/CONTRIBUTING.md)

## 📄 License
MIT License.
