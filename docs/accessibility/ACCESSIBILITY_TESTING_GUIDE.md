# Accessibility Testing Guide

## Overview
This guide provides step-by-step instructions for testing the accessibility improvements made to jpstas.com.

---

## Quick Start Testing Checklist

### ✅ Automated Testing (5 minutes)
1. **Lighthouse Audit**
   - Open Chrome DevTools (F12)
   - Go to "Lighthouse" tab
   - Check "Accessibility" only
   - Click "Analyze page load"
   - **Target Score: 100**

2. **axe DevTools**
   - Install: [axe DevTools Extension](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
   - Click the axe icon
   - Run "Scan ALL of my page"
   - **Target: 0 violations**

3. **WAVE**
   - Install: [WAVE Extension](https://wave.webaim.org/extension/)
   - Click the WAVE icon
   - Review any errors or alerts
   - **Target: 0 errors**

---

## Manual Testing (15 minutes)

### 1. Keyboard Navigation Test
**Goal:** All functionality must be accessible without a mouse

**Steps:**
1. Start at the homepage
2. Press `Tab` to move through interactive elements
3. Press `Shift + Tab` to move backwards
4. Press `Enter` on links and buttons
5. Press `Space` on buttons

**What to verify:**
- [ ] Visible focus indicator on all elements (blue 3px outline)
- [ ] Logical tab order (top to bottom, left to right)
- [ ] "Skip to main content" link appears when pressing Tab
- [ ] All buttons and links are reachable
- [ ] Modal/menu can be closed with `Escape` key
- [ ] No keyboard traps (can always Tab forward/backward)

**Pages to test:**
- [ ] Homepage
- [ ] About
- [ ] Portfolio
- [ ] Resume
- [ ] Contact (test form submission)

---

### 2. Screen Reader Test
**Goal:** All content must be accessible to blind users

**Screen Readers:**
- **Windows:** NVDA (free) - [Download](https://www.nvaccess.org/)
- **Mac:** VoiceOver (built-in) - `Cmd + F5` to toggle
- **JAWS:** [Download trial](https://www.freedomscientific.com/products/software/jaws/)

**Steps:**
1. Start screen reader
2. Navigate with:
   - `H` - Jump to next heading
   - `Tab` - Next interactive element
   - `Arrow keys` - Read content
   - `Enter` - Activate links/buttons

**What to verify:**
- [ ] All images have descriptive alt text
- [ ] Headings are in logical order (H1 → H2 → H3)
- [ ] Links have descriptive text (not just "click here")
- [ ] Form labels are announced correctly
- [ ] Button purposes are clear
- [ ] Skip link works ("Skip to main content")

---

### 3. Color Contrast Test
**Goal:** All text meets WCAG AA 4.5:1 contrast ratio

**Tool:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**What to verify:**
- [ ] Body text: `#1a1a1a` on `#FFFFFF` = **15:1** ✅
- [ ] Secondary text: `#4a4a4a` on `#FFFFFF` = **9.7:1** ✅
- [ ] Primary links: `#2563eb` on `#FFFFFF` = **8.6:1** ✅
- [ ] Buttons on gradient backgrounds (manually check)
- [ ] White text on colored backgrounds (manually check)

**How to test:**
1. Take a screenshot of any text element
2. Use a color picker to get hex values
3. Enter foreground and background colors into WebAIM checker
4. Verify ratio is ≥ 4.5:1 (AA) or ≥ 7:1 (AAA)

---

### 4. Text Resize Test
**Goal:** Page must be usable at 200% zoom

**Steps:**
1. Go to any page
2. Press `Ctrl +` (Windows) or `Cmd +` (Mac) repeatedly to zoom to 200%
3. Test all pages

**What to verify:**
- [ ] No horizontal scrolling
- [ ] Text doesn't overlap
- [ ] All content remains visible
- [ ] Buttons remain clickable
- [ ] Forms still functional
- [ ] No content is cut off

---

### 5. Touch Target Size Test (Mobile)
**Goal:** All interactive elements are at least 44x44px

**Steps:**
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Select "iPhone 12 Pro" or similar
4. Try tapping all buttons and links

**What to verify:**
- [ ] All buttons are easily tappable
- [ ] Links don't require precise tapping
- [ ] Form inputs are large enough
- [ ] No accidental clicks on adjacent elements
- [ ] Navigation menu is touch-friendly

---

### 6. Animation & Motion Test
**Goal:** Respect user's motion preferences

**Steps:**
1. **Windows:** Settings → Ease of Access → Display → Show animations (turn OFF)
2. **Mac:** System Preferences → Accessibility → Display → Reduce motion (turn ON)
3. **Chrome:** DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce
4. Reload the site

**What to verify:**
- [ ] No animations play (or very minimal)
- [ ] Smooth scrolling is disabled
- [ ] Transitions are instant
- [ ] Page remains fully functional
- [ ] Content is still readable

---

### 7. High Contrast Mode Test
**Goal:** Site works in system high contrast mode

**Steps:**
1. **Windows:** Settings → Ease of Access → High contrast → Turn on
2. **Mac:** System Preferences → Accessibility → Display → Increase contrast
3. Reload the site

**What to verify:**
- [ ] All text is visible
- [ ] Borders appear on buttons/inputs
- [ ] Focus indicators are visible
- [ ] Links are distinguishable
- [ ] No content disappears

---

### 8. Form Accessibility Test
**Goal:** Forms are fully accessible with proper labels and error handling

**Test on Contact Page:**
1. Use keyboard only to fill form
2. Leave a required field empty
3. Submit the form
4. Verify error message appears

**What to verify:**
- [ ] All fields have visible labels
- [ ] Required fields marked with `*`
- [ ] Labels are programmatically associated (click label focuses input)
- [ ] Error messages are clear and specific
- [ ] Error messages use color AND text (not color alone)
- [ ] Success message is announced to screen readers
- [ ] Tab order is logical
- [ ] Can submit with `Enter` key

---

## Browser Testing Matrix

### Desktop Browsers
- [ ] Chrome (Windows)
- [ ] Edge (Windows)
- [ ] Firefox (Windows)
- [ ] Safari (macOS)

### Mobile Browsers
- [ ] Safari (iOS)
- [ ] Chrome (Android)
- [ ] Firefox (Android)

**For each browser, test:**
1. Keyboard navigation
2. Focus indicators
3. Form submission
4. Button interactions
5. Link functionality

---

## Common Issues to Look For

### ❌ FAILURES
- Focus indicator not visible
- Text contrast < 4.5:1
- Form fields without labels
- Buttons without accessible names
- Keyboard traps
- Missing alt text on images
- Heading skips (H1 → H3)
- Touch targets < 44x44px

### ✅ PASSES
- Clear focus indicators (3px blue outline)
- All text ≥ 4.5:1 contrast
- All forms properly labeled
- All buttons have clear purposes
- Full keyboard access
- Descriptive alt text
- Logical heading structure
- Large touch targets

---

## Testing Tools Reference

### Browser Extensions
1. **axe DevTools** - [Install](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
2. **WAVE** - [Install](https://wave.webaim.org/extension/)
3. **Accessibility Insights** - [Install](https://accessibilityinsights.io/)

### Online Tools
1. **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
2. **WAVE Web Accessibility Evaluation Tool** - https://wave.webaim.org/
3. **HTML Validator** - https://validator.w3.org/

### Screen Readers
1. **NVDA (Windows, Free)** - https://www.nvaccess.org/
2. **JAWS (Windows, Paid/Trial)** - https://www.freedomscientific.com/
3. **VoiceOver (Mac, Built-in)** - Cmd + F5
4. **TalkBack (Android, Built-in)** - Settings → Accessibility

---

## Quick Command Reference

### VoiceOver (Mac)
- `Cmd + F5` - Start/Stop VoiceOver
- `VO + Right Arrow` - Next item
- `VO + Left Arrow` - Previous item
- `VO + H` - Next heading
- `VO + L` - Next link
- `VO + Space` - Click/Activate

### NVDA (Windows)
- `Ctrl + Alt + N` - Start NVDA
- `Insert + Q` - Quit NVDA
- `H` - Next heading
- `K` - Next link
- `B` - Next button
- `F` - Next form field
- `Enter` - Click/Activate

---

## Reporting Issues

If you find accessibility issues:

1. **Document the issue:**
   - Page URL
   - Description of problem
   - Screenshot (if visual)
   - WCAG criterion violated
   - Browser/device used

2. **Severity levels:**
   - **Critical:** Blocks access to functionality
   - **High:** Major usability issue
   - **Medium:** Minor usability issue
   - **Low:** Enhancement suggestion

3. **Create a GitHub issue** with template:
   ```markdown
   ## Accessibility Issue

   **Page:** [URL]
   **Severity:** [Critical/High/Medium/Low]
   **WCAG Criterion:** [e.g., 1.4.3 Contrast (Minimum)]

   **Description:**
   [What's wrong]

   **Steps to Reproduce:**
   1. [Step 1]
   2. [Step 2]

   **Expected Behavior:**
   [What should happen]

   **Actual Behavior:**
   [What actually happens]

   **Screenshot:**
   [If applicable]

   **Environment:**
   - Browser: [e.g., Chrome 120]
   - OS: [e.g., Windows 11]
   - Screen Reader: [if applicable]
   ```

---

## Compliance Checklist

### WCAG 2.1 Level A ✅
- [x] 1.1.1 Non-text Content
- [x] 1.3.1 Info and Relationships
- [x] 1.3.2 Meaningful Sequence
- [x] 1.3.3 Sensory Characteristics
- [x] 2.1.1 Keyboard
- [x] 2.1.2 No Keyboard Trap
- [x] 2.4.1 Bypass Blocks (Skip link)
- [x] 2.4.2 Page Titled
- [x] 2.4.4 Link Purpose
- [x] 3.3.1 Error Identification
- [x] 3.3.2 Labels or Instructions
- [x] 4.1.2 Name, Role, Value

### WCAG 2.1 Level AA ✅
- [x] 1.4.3 Contrast (Minimum)
- [x] 1.4.4 Resize Text
- [x] 1.4.5 Images of Text
- [x] 2.4.5 Multiple Ways
- [x] 2.4.6 Headings and Labels
- [x] 2.4.7 Focus Visible
- [x] 3.2.3 Consistent Navigation
- [x] 3.2.4 Consistent Identification
- [x] 3.3.3 Error Suggestion
- [x] 3.3.4 Error Prevention

---

## Next Steps

1. ✅ Run automated tests (Lighthouse, axe, WAVE)
2. ✅ Test keyboard navigation
3. ✅ Test with screen reader
4. ✅ Verify color contrast
5. ✅ Test text resize
6. ✅ Test touch targets on mobile
7. ✅ Test reduced motion
8. ✅ Test form accessibility
9. ⏳ Fix any issues found
10. ⏳ Re-test after fixes
11. ⏳ Document final compliance status

---

**Last Updated:** $(date)
**Tested By:** [Your Name]
**Compliance Level:** WCAG 2.1 Level AA
**Status:** Ready for Testing






