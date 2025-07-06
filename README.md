# 🍎 App Store Connect Status Webhook

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftechinpark%2Fappstore-status-webhook)

*[🇰🇷 한국어 README](README.ko.md)*

A serverless webhook proxy that receives App Store Connect webhook events and forwards them to Slack and Discord with beautiful, localized notifications.

## ✨ Features

- 🔔 **Multi-platform notifications**: Slack and Discord support
- 🌐 **Internationalization**: English and Korean localization
- 🔒 **Secure**: Apple signature verification
- 🎨 **Beautiful formatting**: Rich embeds with status colors and emojis
- ⚡ **Serverless**: Deploy instantly to Vercel
- 📱 **App Store focused**: Handles all App Store Connect webhook events

## 🚀 Quick Start

### 1. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftechinpark%2Fappstore-status-webhook)

Or clone and deploy manually:

```bash
git clone https://github.com/techinpark/appstore-status-webhook.git
cd appstore-status-webhook
npm install
vercel --prod
```

### 2. Configure Environment Variables

Set these environment variables in your Vercel project settings:

```bash
# Required: At least one webhook URL
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK

# Optional: Apple signature verification
SHARED_SECRET=your_shared_secret_here

# Optional: Customization
APP_STORE_URL=https://apps.apple.com/app/your-app/id123456789
TIMEZONE=Asia/Seoul
LANGUAGE=ko  # en (English) or ko (Korean)
```

### 3. Configure App Store Connect

1. Go to **App Store Connect** → **Users and Access** → **Webhooks**
2. Create a new webhook with your deployed URL: `https://your-app.vercel.app/api/webhook`
3. Select the events you want to receive
4. Save your webhook

## 📊 Supported Events

| Event | Description | Platforms |
|-------|-------------|-----------|
| `appStoreVersionAppVersionStateUpdated` | App version status changes | ✅ All |
| `webhookPingCreated` | Webhook test ping | ✅ All |
| Custom events | Unhandled events with JSON payload | ✅ All |

## 🎨 Notification Examples

### Slack
```
🍏 App Store Connect
────────────────────────────────────────
✅ Current Status: Ready for Sale
📤 Previous Status: Pending Apple Release
🆔 Version ID: 12345678
```

### Discord
Rich embed with color-coded status and timestamp

## 🔧 Local Development

```bash
# Clone the repository
git clone https://github.com/techinpark/appstore-status-webhook.git
cd appstore-status-webhook

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Edit .env.local with your webhook URLs
# Start development server
npm run start

# Test the webhook (in another terminal)
npm run test
```

## 🌐 Localization

The project supports multiple languages:

- **English** (`en`): Default language
- **Korean** (`ko`): Complete Korean localization

Set the `LANGUAGE` environment variable to your preferred language.

## 🔒 Security

### Apple Signature Verification

Enable signature verification by setting the `SHARED_SECRET` environment variable:

```bash
SHARED_SECRET=your_shared_secret_from_appstore_connect
```

This ensures that only authentic webhooks from Apple are processed.

## 🎯 API Reference

### `POST /api/webhook`

Receives App Store Connect webhook events.

**Headers:**
- `Content-Type: application/json`
- `X-Apple-Signature: sha256=...` (when signature verification is enabled)

**Response:**
```json
{
  "message": "OK"
}
```

**Error Responses:**
- `405 Method Not Allowed` - Non-POST requests
- `401 Unauthorized` - Invalid signature
- `500 Internal Server Error` - Processing error

## 📁 Project Structure

```
appstore-status-webhook/
├── api/
│   └── webhook.ts              # Main webhook handler
├── lib/
│   ├── builders/               # Message builders
│   │   ├── discord.ts
│   │   └── slack.ts
│   ├── constants/              # Configuration constants
│   │   ├── config.ts
│   │   └── status.ts
│   ├── locales/               # Localization files
│   │   ├── en.json
│   │   └── ko.json
│   ├── notifiers/             # Platform notifiers
│   │   ├── discord.ts
│   │   └── slack.ts
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   └── utils/                 # Utility functions
│       ├── color.ts
│       ├── locale.ts
│       ├── signature.ts
│       ├── status.ts
│       └── timestamp.ts
├── env.example                # Environment variables template
├── package.json
├── tsconfig.json
└── vercel.json               # Vercel configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the App Store Connect developer community
- Inspired by the need for better webhook notifications
- Special thanks to all contributors

---

**Need help?** [Open an issue](https://github.com/techinpark/appstore-status-webhook/issues) or [start a discussion](https://github.com/techinpark/appstore-status-webhook/discussions). 