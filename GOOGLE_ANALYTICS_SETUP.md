# Google Analytics 4 Setup Guide for jpstas.com

This guide will walk you through setting up Google Analytics 4 (GA4) for your portfolio website to track user behavior, page views, and engagement metrics.

## 🚀 Quick Start

### 1. Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or "Create Account"
3. Enter your account name (e.g., "JP Stas Portfolio")
4. Configure data sharing settings as needed
5. Click "Next"

### 2. Set Up Property

1. **Property name**: `jpstas.com`
2. **Reporting time zone**: Select your timezone
3. **Currency**: Select your preferred currency
4. Click "Next"

### 3. Configure Business Information

1. **Industry category**: Select "Technology" or "Professional Services"
2. **Business size**: Select appropriate size
3. **How you plan to use Google Analytics**: Select relevant options
4. Click "Create"

### 4. Set Up Data Stream

1. Click "Web" under "Choose a platform"
2. **Website URL**: `https://jpstas.com`
3. **Stream name**: `jpstas.com Web Stream`
4. Click "Create stream"

### 5. Get Measurement ID

1. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
2. This will be used in your environment variables

## 🔧 Environment Configuration

### 1. Create Environment File

Create a `.env.local` file in your project root:

```bash
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 2. Update .env.example

Add the environment variable to your `.env.example` file:

```bash
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 📊 Analytics Features Implemented

### Automatic Tracking

The following events are automatically tracked:

#### Page Views
- **Event**: `page_view`
- **Data**: Page title, URL, path, content groups
- **Content Groups**:
  - `content_group1`: Section (home, workshop, portfolio, about, resume, admin)
  - `content_group2`: Subsection (design-bench, development-desk, etc.)

#### User Engagement
- **Time on Page**: Tracked every 30 seconds and on page exit
- **Scroll Depth**: Tracked at 25%, 50%, 75%, and 100%
- **Button Clicks**: All interactive elements
- **Link Clicks**: Internal and external links

#### Portfolio Interactions
- **Project Views**: When users click on projects
- **Project Filters**: Category and tag filtering
- **Project Interactions**: Image views, video plays, etc.

#### Workshop Interactions
- **Section Views**: When users visit workshop sections
- **Tool Usage**: When users interact with workshop tools
- **Process Steps**: When users follow process workflows

#### Admin Actions
- **Content Updates**: When content is modified
- **Media Uploads**: File uploads and management
- **User Actions**: Login, logout, form submissions

### Custom Events

#### Form Tracking
```javascript
// Track form submissions
analytics.trackFormSubmission('contact_form', true, {
  form_type: 'contact',
  user_type: 'visitor'
});
```

#### Download Tracking
```javascript
// Track file downloads
analytics.trackDownload('resume.pdf', 'pdf', 1024000);
```

#### Search Tracking
```javascript
// Track search queries
analytics.trackSearch('react portfolio', 15);
```

#### Conversion Tracking
```javascript
// Track conversions
analytics.trackConversion('contact_form_submit', 1, 'USD');
```

## 🎯 Key Metrics to Monitor

### 1. Audience Overview
- **Users**: Total unique visitors
- **Sessions**: Total visits
- **Page Views**: Total pages viewed
- **Session Duration**: Average time on site
- **Bounce Rate**: Percentage of single-page sessions

### 2. Acquisition
- **Traffic Sources**: Where visitors come from
- **Referrers**: Which websites link to you
- **Search Console**: Organic search performance
- **Social Media**: Social platform traffic

### 3. Behavior
- **Page Views**: Most popular pages
- **Content Groups**: Workshop vs Portfolio engagement
- **User Flow**: How users navigate your site
- **Events**: Custom interactions and conversions

### 4. Real-time
- **Active Users**: Currently on your site
- **Top Pages**: Currently viewed pages
- **Top Events**: Recent user interactions
- **Traffic Sources**: Current traffic sources

## 📈 Custom Reports

### 1. Portfolio Performance Report

**Metrics to Track:**
- Project view rates
- Most popular projects
- Filter usage patterns
- Time spent on project pages

**Custom Dimensions:**
- Project ID
- Project Category
- Project Tags

### 2. Workshop Engagement Report

**Metrics to Track:**
- Section visit rates
- Tool usage frequency
- Process completion rates
- Resource downloads

**Custom Dimensions:**
- Workshop Section
- Tool Name
- Process Step

### 3. Admin Activity Report

**Metrics to Track:**
- Content update frequency
- Media upload patterns
- User management actions
- System performance

## 🔍 Debugging and Testing

### 1. Google Analytics DebugView

1. Go to your GA4 property
2. Navigate to "Configure" > "DebugView"
3. Enable debug mode in your browser
4. View real-time events

### 2. Browser Developer Tools

```javascript
// Check if analytics is loaded
console.log(window.gtag);
console.log(window.dataLayer);

// View recent events
console.log(window.dataLayer);
```

### 3. Google Tag Assistant

1. Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your website
3. Check for proper tag firing

## 🚨 Common Issues and Solutions

### 1. Analytics Not Loading

**Symptoms:**
- No data in GA4
- Console errors about gtag

**Solutions:**
- Check Measurement ID format
- Verify environment variables
- Check network connectivity
- Ensure script loads in production

### 2. Events Not Tracking

**Symptoms:**
- Page views work but custom events don't
- Inconsistent event data

**Solutions:**
- Check event parameters
- Verify event names and categories
- Test in DebugView
- Check for JavaScript errors

### 3. Data Discrepancies

**Symptoms:**
- Different numbers in different reports
- Missing data

**Solutions:**
- Check date ranges
- Verify filters
- Check for data processing delays
- Review sampling settings

## 📱 Mobile and Cross-Device Tracking

### 1. Enhanced Measurement

Enable these features in GA4:
- **Scrolls**: Track scroll depth
- **Outbound clicks**: Track external links
- **Site search**: Track search queries
- **Video engagement**: Track video interactions
- **File downloads**: Track file downloads

### 2. Cross-Device Tracking

- Users are tracked across devices when logged in
- Anonymous users are tracked per device
- Consider implementing user ID tracking for better attribution

## 🔒 Privacy and Compliance

### 1. GDPR Compliance

- Implement cookie consent banner
- Provide opt-out mechanisms
- Document data processing activities
- Regular privacy policy updates

### 2. Data Retention

- Set appropriate data retention periods
- Regularly review and purge old data
- Implement data anonymization where possible

### 3. User Consent

```javascript
// Example consent management
if (userConsent) {
  analytics.initialize();
} else {
  // Disable tracking
}
```

## 📊 Advanced Configuration

### 1. Custom Dimensions

Set up custom dimensions for:
- User Type (visitor, admin)
- Content Category
- Project Status
- Workshop Section

### 2. Custom Metrics

Track custom metrics like:
- Time to First Interaction
- Engagement Rate
- Conversion Rate
- Return Visitor Rate

### 3. Goals and Conversions

Set up conversion goals:
- Contact form submissions
- Resume downloads
- Project views
- Workshop tool usage

## 🚀 Going Live

### 1. Pre-Launch Checklist

- [ ] Measurement ID configured
- [ ] Environment variables set
- [ ] Analytics loading in production
- [ ] Events firing correctly
- [ ] DebugView showing data
- [ ] Privacy policy updated
- [ ] Cookie consent implemented

### 2. Post-Launch Monitoring

- Monitor real-time data for first 24 hours
- Check for any errors or issues
- Verify all events are tracking
- Review data quality
- Set up automated alerts

### 3. Regular Maintenance

- Weekly data review
- Monthly report analysis
- Quarterly configuration review
- Annual privacy policy update

## 📞 Support and Resources

### 1. Google Analytics Help

- [GA4 Help Center](https://support.google.com/analytics/answer/9304153)
- [GA4 Community](https://support.google.com/analytics/community)
- [GA4 YouTube Channel](https://www.youtube.com/c/GoogleAnalytics)

### 2. Implementation Resources

- [GA4 Implementation Guide](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 Debugging Guide](https://developers.google.com/analytics/devguides/collection/ga4/debug-events)

### 3. Best Practices

- [GA4 Best Practices](https://support.google.com/analytics/answer/9304153)
- [Data Quality Guidelines](https://support.google.com/analytics/answer/9304153)
- [Privacy and Security](https://support.google.com/analytics/answer/9304153)

---

## 🎉 You're All Set!

Your Google Analytics 4 implementation is now complete and ready to provide valuable insights into your portfolio website's performance. Monitor your data regularly and use the insights to improve user experience and engagement.

**Next Steps:**
1. Set up your GA4 property
2. Configure environment variables
3. Deploy to production
4. Monitor and analyze your data
5. Optimize based on insights

Happy analyzing! 📊✨
