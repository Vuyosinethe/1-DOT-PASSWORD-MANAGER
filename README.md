<div align="center">

# 🔐 1Dot Password Manager

**Secure • Simple • Beautiful**

*Your passwords, encrypted and protected with military-grade security*

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Features

<div align="center">

| 🔒 **Security First** | 🎨 **Beautiful UI** | ⚡ **Lightning Fast** |
|:---:|:---:|:---:|
| AES-256 Encryption | Modern Design | Instant Access |
| PBKDF2 Key Derivation | Responsive Layout | Real-time Updates |
| bcrypt Password Hashing | Dark/Light Mode | Offline Capable |

</div>

### 🛡️ Security Features

- **🔐 Zero-Knowledge Architecture** - Your master password never leaves your device
- **🔑 AES-256 Encryption** - Military-grade encryption for all stored passwords
- **🧂 Unique Salt Generation** - Each user gets a unique cryptographic salt
- **🔒 PBKDF2 Key Derivation** - 100,000 iterations prevent brute force attacks
- **🛡️ bcrypt Password Hashing** - Adaptive cost algorithm for user authentication
- **💾 Local Storage** - All data stays on your device, never sent to servers

### ✨ User Experience

- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🎯 Real-time Password Strength** - Instant feedback on password security
- **🔄 Smart Password Generator** - Customizable strong password creation
- **📋 One-Click Copy** - Easy clipboard integration
- **🚀 Fast Performance** - Built with Next.js for optimal speed
- **🎨 Beautiful Interface** - Clean, modern design with Tailwind CSS

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/1dot-password-manager.git
   cd 1dot-password-manager
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

That's it! 🎉 Your password manager is now running locally.

---

## 🏗️ Tech Stack

<div align="center">

```mermaid
graph TD
    A[Next.js 14] --> B[React 18]
    A --> C[TypeScript]
    A --> D[Tailwind CSS]
    
    E[Security Layer] --> F[AES-256 Encryption]
    E --> G[PBKDF2 Key Derivation]
    E --> H[bcrypt Hashing]
    
    I[Storage] --> J[localStorage]
    I --> K[Client-side Only]
    
    L[UI Components] --> M[Lucide Icons]
    L --> N[Responsive Design]
    L --> O[Modern Animations]
