# Sentry Error Alerts Setup

This document describes how to configure Sentry error alerts to Slack/Discord for TradeSuite.

## Prerequisites

1. Sentry project set up (see `sentry.client.config.ts`)
2. Slack workspace with admin access (for Slack integration)
3. Discord server with admin access (for Discord integration)

## Slack Integration

### Step 1: Create Slack App

1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name it "TradeSuite Alerts" and select your workspace
4. Go to "Incoming Webhooks" and enable it
5. Click "Add New Webhook to Workspace"
6. Select the channel for alerts (e.g., `#tradesuite-alerts`)
7. Copy the webhook URL (looks like: `https://hooks.slack.com/services/T.../B.../...`)

### Step 2: Configure Sentry Slack Integration

1. Go to your Sentry project: https://sentry.io/settings/projects/tradesuite/
2. Navigate to **Integrations** → **Slack**
3. Click "Configure"
4. Select the Slack workspace and authorize
5. Configure alert rules:
   - **Errors**: Critical & High severity in production
   - **Performance**: Slow transactions > 4s
   - **Releases**: New release deployed

### Step 3: Alert Rule Configuration

Create the following rules in Sentry:

```yaml
# Rule 1: Production Critical Errors
conditions:
  - environment: production
  - level: error
  - tags.level: critical
actions:
  - notify: slack
    channel: "#tradesuite-alerts"
    include: [issue_link, stacktrace, request_url]

# Rule 2: High Issue Frequency
conditions:
  - environment: production
  - issue_frequency: > 10 in 5 minutes
actions:
  - notify: slack
    channel: "#tradesuite-alerts"
    priority: high

# Rule 3: New Release Monitoring
conditions:
  - event: release_deployed
  - environment: production
  - new_issues: > 5 in 1 hour
actions:
  - notify: slack
    channel: "#tradesuite-releases"
```

## Discord Integration

### Step 1: Create Discord Webhook

1. Go to your Discord server settings
2. Navigate to **Integrations** → **Webhooks**
3. Click "New Webhook"
4. Name it "TradeSuite Alerts" and select the channel
5. Copy the webhook URL (looks like: `https://discord.com/api/webhooks/...`)

### Step 2: Configure Sentry Discord Integration

1. Sentry doesn't have native Discord integration, so use the **Webhook** integration
2. Go to **Integrations** → **Internal Integrations** → **New Integration**
3. Create a webhook integration that forwards to Discord

### Alternative: Custom Discord Integration

Create a small serverless function to transform Sentry webhooks to Discord format:

```typescript
// /api/sentry-webhook.ts (Vercel serverless function)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body;
  
  // Transform Sentry event to Discord embed
  const discordPayload = {
    content: null,
    embeds: [{
      title: event.event?.title || 'New Error',
      description: `**Message:** ${event.event?.message || 'Unknown error'}`,
      color: event.level === 'error' ? 16711680 : 16776960,
      fields: [
        { name: 'Environment', value: event.environment || 'unknown', inline: true },
        { name: 'Project', value: event.project || 'unknown', inline: true },
        { name: 'URL', value: event.web_url || 'N/A', inline: false },
      ],
      timestamp: new Date().toISOString(),
    }],
  };

  // Send to Discord webhook
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (discordWebhookUrl) {
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });
  }

  res.status(200).json({ success: true });
}
```

## Environment Variables

Add these to your production environment:

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=tradesuite

# Slack (optional - for custom webhook patterns)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...

# Discord (optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

## Testing the Integration

### Test Slack Alert

1. Go to Sentry Settings → Integrations → Slack
2. Click "Test Integration"
3. You should see a test message in `#tradesuite-alerts`

### Test Discord Alert

```bash
curl -X POST $DISCORD_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"content": "Test alert from TradeSuite"}'
```

## Alert Frequency Settings

To prevent alert fatigue, configure:

```yaml
# Daily digest for low-priority issues
daily_digest:
  enabled: true
  time: "09:00"
  timezone: "America/Los_Angeles"

# Issue grouping
grouping:
  strategy: "stacktrace"
  lookahead: 10

# Rate limiting
rate_limit:
  max_alerts_per_hour: 10
  cooldown_minutes: 5
```

## Slack Message Template

Customize the Slack message format:

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚨 TradeSuite Error Alert"
      }
    },
    {
      "type": "section",
      "fields": [
        {"type": "mrkdwn", "text": "*Environment:*\n<ENVIRONMENT>"},
        {"type": "mrkdwn", "text": "*Level:*\n<LEVEL>"},
        {"type": "mrkdwn", "text": "*Project:*\n<PROJECT_SLUG>"},
        {"type": "mrkdwn", "text": "*URL:*\n<WEB_URL>"}
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Message:*\n<MESSAGE>"
      }
    }
  ]
}
```

## Monitoring Dashboard

Create a Slack dashboard for real-time monitoring:

1. Create channel `#tradesuite-monitoring`
2. Configure Sentry to post:
   - Daily summary at 9 AM: errors, warnings, performance
   - Weekly summary on Monday: trends, unique errors
   - Release health after each deployment

## Troubleshooting

### Alerts not sending

1. Check Sentry project settings → Integrations → verify Slack is connected
2. Check alert rules have correct conditions
3. Check rate-limiting settings
4. Verify the webhook URL is correct

### Missing stack traces

1. Ensure source maps are uploaded with releases
2. Check `sentry.client.config.ts` has correct `tracesSampleRate`
3. Verify `attachStacktrace: true` in Sentry.init

### Too many alerts

1. Adjust alert frequency in Sentry settings
2. Use issue grouping to collapse similar errors
3. Set up daily/weekly digests for non-critical issues
4. Use `beforeSend` hook to filter noise

```typescript
// sentry.client.config.ts
Sentry.init({
  // ...
  beforeSend(event) {
    // Filter out known benign errors
    if (event.message?.includes('ResizeObserver loop limit exceeded')) {
      return null;
    }
    return event;
  },
});
```