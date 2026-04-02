# WhatsApp Meta Webhook & Template Setup

Quick reference for configuring WhatsApp webhooks and message templates in Meta.

---

## Quick Reference

| Item | Value |
|------|-------|
| **Webhook Callback URL** | `https://acemark01-recruitai-backend.hf.space/test/whatsapp/webhook` |
| **Verify Token** | `RecruitAI_WA_Verify_2026_4f9cA72dPqL8xM3v` |
| **Template Name** | `assessment_invite_v1` |
| **Template Category** | `UTILITY` |
| **Language** | `English` (code: `en`) |
| **Event Subscription** | `message_status` |

---

## Part 1: Configure Webhook in Meta

### Step 1: Access Meta Webhooks

1. Open **Meta Developer Dashboard** (developer.facebook.com)
2. Sign in with the account that owns your WhatsApp Business app
3. Select your app from the dashboard
4. Navigate to **Settings** → **Webhooks** (may appear under WhatsApp product)

### Step 2: Set Callback URL & Verify Token

1. Click **Configure webhooks**
2. **Callback URL** field → paste:
   ```
   https://acemark01-recruitai-backend.hf.space/test/whatsapp/webhook
   ```

3. **Verify Token** field → paste exactly:
   ```
   RecruitAI_WA_Verify_2026_4f9cA72dPqL8xM3v
   ```

4. Click **Verify and Save**

### Step 3: Troubleshoot (If Verification Fails)

| Check | Details |
|-------|---------|
| Backend running? | Hugging Face Space must be in Running state |
| Webhook route exists? | Backend must have endpoint at `/test/whatsapp/webhook` |
| Token matches? | Ensure `WHATSAPP_WEBHOOK_VERIFY_TOKEN` env var matches exactly |
| For local testing? | Use tunnel (ngrok) to expose local backend publicly |

### Step 4: Subscribe to Events

1. After webhook is verified, open **Subscribe to webhook fields**
2. Enable checkbox for `message_status`
3. Click **Save**
4. This enables delivery status updates (Delivered, Read, Failed)

---

## Part 2: Create WhatsApp Message Template

### Why Templates?

Meta requires all bulk WhatsApp messages to use pre-approved templates. Our template uses **6 variables** for dynamic content.

### Template Variables

| Placeholder | Purpose | Example |
|------------|---------|---------|
| `{{1}}` | Candidate Name | Aanya Sharma |
| `{{2}}` | Job Title | Web Developer |
| `{{3}}` | Test Date/Time | 04 Apr 2026, 10:30 AM |
| `{{4}}` | Duration (minutes) | 60 |
| `{{5}}` | Assessment Link | https://recruitai.example.com/tests/abc123 |
| `{{6}}` | Company Name | AceMark |

### Step 1: Create Template in Meta

1. Go to **Settings** → **Message Templates**
2. Click **Create template**
3. Fill in details:

   | Field | Value |
   |-------|-------|
   | Template Name | `assessment_invite_v1` |
   | Category | `UTILITY` |
   | Language | `English` |

4. Click **Next** and paste template body:

```
Hello {{1}},

You're invited to take the {{2}} assessment at {{3}}.

⏱️ Duration: {{4}} minutes

📋 Start your assessment here:
{{5}}

Company: {{6}}

Good luck! 🎯
```

5. Click **Submit for approval**
6. Status: `Pending Review` → `Active - Quality Pending` (usually instant for UTILITY category)

### Step 2: Verify Template Parameters

1. Open **Message Templates** list
2. Click on `assessment_invite_v1`
3. Verify:
   - All **6 parameters** are present
   - Language code shows `en` (NOT `en_US`)
   - Status is `Active` or `Active - Quality Pending`

---

## Live Example

When RecruitAI sends an assessment invite, the rendered message looks like:

```
Hello Aanya Sharma,

You're invited to take the Web Developer assessment at 04 Apr 2026, 10:30 AM.

⏱️ Duration: 60 minutes

📋 Start your assessment here:
https://recruitai.example.com/tests/abc123

Company: AceMark

Good luck! 🎯
```

---

## Backend Environment Variable

Add this to your Space **Settings → Variables and secrets**:

```env
WHATSAPP_WEBHOOK_VERIFY_TOKEN=RecruitAI_WA_Verify_2026_4f9cA72dPqL8xM3v
```

---

## Checklist

- [ ] Webhook callback URL configured in Meta
- [ ] Verify token set and matched in backend
- [ ] Webhook verified successfully
- [ ] `message_status` event subscribed
- [ ] Template `assessment_invite_v1` created
- [ ] Template approved and marked Active
- [ ] All 6 template variables present
- [ ] Language set to `en` (English)
- [ ] Backend env var `WHATSAPP_WEBHOOK_VERIFY_TOKEN` set
- [ ] Test message sent and delivered
