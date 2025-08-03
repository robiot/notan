# Notan

A full-stack starter project built around a Chrome Extension, featuring:
<img width="1886" height="893" alt="image" src="https://github.com/user-attachments/assets/d1bcd358-9665-4f76-b19d-4b3530a365bc" />

* 🔌 Chrome Extension (Manifest V3)
* 🖥️ Rust backend
* 💳 Stripe payments integration
* 🌐 Landing page

Perfect for anyone looking to explore Chrome extension development, Rust web services, or payment integration.

---

## Features

* ✅ Chrome Extension (UI + background scripts)
* ✅ Rust-based API server
* ✅ Stripe Checkout for payments
* ✅ Prebuilt landing page
* ✅ Fully functional end-to-end flow
* ✅ Ready for local development and customization

---

## Tech Stack

| Component    | Tech                                  |
| ------------ | ------------------------------------- |
| Extension    | JavaScript / HTML / CSS (Manifest V3) |
| Backend      | Rust (`actix-web` or similar)         |
| Payments     | Stripe Checkout                       |
| Landing Page | HTML/CSS (static site)                |
| Deployment   | Customizable                          |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/robiot/notan.git
cd notan
```

### 2. Run the Backend (Rust)

```bash
cd services/backend
cargo build
cargo run
```

> Make sure you have Rust installed: [https://rustup.rs](https://rustup.rs)

### 3. Load the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

### 4. Configure Stripe

Update the Stripe keys in the backend config or `.env` file.

---

## License

MIT License.
Free to use, learn from, and build upon.

---

Let me know if you'd like badges, Docker setup, or deployment instructions added!
