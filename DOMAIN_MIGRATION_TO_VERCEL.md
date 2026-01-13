# Domain Migration to Vercel - Step-by-Step Guide

## Overview

This guide explains how to update your domain `www.abrohr.com` to point to the live Vercel deployment where the new company signup system is currently running.

**Current Status**:
- ✅ Vercel Deployment: **ACTIVE & RUNNING** at https://abrohr-frontend.vercel.app/
- ⏳ www.abrohr.com: Still pointing to old version

---

## What's Live on Vercel?

The new AbrO HR system with the following features is now live:

✅ **Two-Tab Login System**
- Sign In for existing users
- New Company registration

✅ **Multi-Step Company Registration** (3 Steps)
- Step 1: Company Information
- Step 2: Admin Account Details  
- Step 3: Confirmation & Auto Password Generation

✅ **Advanced Features**
- Form validation
- Industry selection
- Automatic secure password generation
- Email delivery notifications

---

## Option 1: Update DNS Records (RECOMMENDED)

### For GoDaddy, Namecheap, or Similar Registrars

#### Step 1: Access Your Domain Management
1. Log in to your domain registrar account
2. Navigate to "Domain Management" or "DNS Settings"
3. Look for options like "Manage DNS", "DNS Manager", or "Advanced DNS"

#### Step 2: Update or Create CNAME Record

**For www subdomain:**

| Record Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | www | `cname.vercel-dns.com` | Auto or 3600 |

**For root domain (@):**

| Record Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | `76.76.19.0` | Auto or 3600 |
| A | @ | `76.76.19.1` | Auto or 3600 |
| AAAA | @ | `2606:4700:3034::ac43:1301` | Auto or 3600 |
| AAAA | @ | `2606:4700:3034::ac43:1302` | Auto or 3600 |

#### Step 3: Save Changes
- Click "Save" or "Update"
- DNS changes typically propagate within 24-48 hours
- You can check propagation at: https://www.nslookup.io/

---

## Option 2: Add Custom Domain in Vercel Dashboard

### Step-by-Step

#### Step 1: Go to Vercel Project Settings
1. Visit https://vercel.com/dashboard
2. Select your "abrohr-frontend" project
3. Go to **Settings** tab
4. Click **Domains** in the left sidebar

#### Step 2: Add Your Domain
1. Click **Add** or **Add Domain**
2. Enter your domain: `www.abrohr.com` (and optionally `abrohr.com`)
3. Click **Add**

#### Step 3: Configure DNS
Vercel will show you specific DNS records to add:
- If using a **CNAME**: Point `www` to Vercel's DNS
- If using **A records**: Add the IP addresses Vercel provides
- If using **Nameservers**: Change your nameservers to Vercel's

#### Step 4: Verify and Wait
- Vercel will check DNS propagation
- Once verified (usually within minutes), your domain is live!
- Full propagation across the internet: 24-48 hours

---

## Option 3: Update Nameservers (Most Reliable)

This is the most straightforward method:

### Step 1: Get Vercel's Nameservers
1. In your Vercel project Dashboard
2. Go to Settings → Domains
3. Select the "Nameserver" option
4. Note down the nameservers provided (usually 4 nameservers)

### Step 2: Update at Your Registrar
1. Log into your domain registrar
2. Go to Nameserver settings
3. Replace all existing nameservers with Vercel's nameservers
4. Save changes

### Step 3: Wait for Propagation
- Propagation: 1-48 hours
- Check status: https://www.whatsmydns.net/

---

## Troubleshooting DNS Updates

### DNS Changes Not Reflecting?

1. **Clear Browser Cache**
   ```
   Clear cached DNS in your browser
   Or use Incognito/Private window
   ```

2. **Check DNS Propagation**
   - Visit: https://www.nslookup.io/
   - Enter: www.abrohr.com
   - Should resolve to Vercel IP addresses

3. **Flush Local DNS Cache**
   
   **Windows:**
   ```cmd
   ipconfig /flushdns
   ```
   
   **Mac:**
   ```bash
   sudo dscacheutil -flushcache
   ```
   
   **Linux:**
   ```bash
   sudo systemctl restart systemd-resolved
   ```

4. **Wait for Full Propagation**
   - Changes can take up to 48 hours to propagate globally
   - Contact your registrar if still not working after 48 hours

---

## Verification Checklist

After updating DNS, verify:

- [ ] Visit www.abrohr.com in browser
- [ ] See the new "Sign In" and "New Company" buttons
- [ ] Test "New Company" signup form
- [ ] Verify all 3 steps of registration work
- [ ] Check SSL certificate is valid (green lock)
- [ ] Test on mobile devices
- [ ] Verify responsiveness

---

## Common DNS Providers Quick Links

| Provider | DNS Settings |
|---|---|
| GoDaddy | https://www.godaddy.com/help/manage-dns-records-680 |
| Namecheap | https://www.namecheap.com/support/knowledgebase/article.aspx/434/2237/how-do-i-set-up-host-records-for-a-domain |
| Cloudflare | https://support.cloudflare.com/hc/en-us/articles/200172286 |
| 1&1 (Ionos) | https://www.ionos.com/help/domains/dns-settings/creating-dns-records/ |
| Bluehost | https://www.bluehost.com/help/article/dns-zone-editor |

---

## Vercel Configuration

**Project**: abrohr-frontend
**Current Deployment URL**: https://abrohr-frontend.vercel.app/
**Auto-deployment**: Enabled (builds on each GitHub commit)
**Framework**: React + Vite
**Build Command**: `npm run build`

---

## After DNS Migration

### Enable SSL/TLS (If Not Auto-Enabled)
1. Go to Vercel project settings
2. Under Domains, SSL/TLS should be auto-enabled
3. Vercel automatically provisions free Let's Encrypt certificates

### Monitor Performance
1. Visit Vercel Analytics in project dashboard
2. Monitor build times and deployments
3. Check for any deployment errors

### Future Updates
- All commits to GitHub `main` branch auto-deploy
- Changes appear on both abrohr-frontend.vercel.app AND www.abrohr.com
- No manual deployment needed

---

## Support

If DNS migration fails or takes too long:

1. **Vercel Support**: https://vercel.com/support
2. **Contact your domain registrar's support**
3. **Check Vercel status**: https://www.vercelstatus.com/

---

## Timeline

- ✅ **Today**: Company signup system live on Vercel
- ⏳ **Within 5 minutes**: DNS records updated
- ⏳ **Within 1 hour**: Propagation starts
- ⏳ **Within 48 hours**: Full global propagation
- ✅ **Result**: www.abrohr.com shows new system

---

**Questions?** Check this guide first, then contact Vercel support or your domain registrar.
