# Plan Offer Feature - Visual Guide

## Feature Overview

The offer feature displays promotional discounts on plans with:
- 🎉 **Offer Badge** - Top-right corner showing discount percentage
- 💚 **Discounted Price** - Main price in teal/green
- 📉 **Original Price** - Struck-through gray text for comparison

---

## Visual Examples

### 1. Website Plans Page (index.html)

```
┌─────────────────────────────────────────────────────────┐
│                                   🎉 25% OFF  ← Badge    │
│                                                           │
│  🥇 GOLD PLAN                                            │
│  Premium website package                                │
│                                                           │
│  ✅ 10-Page Website                                      │
│  ✅ Custom UI/UX Design                                  │
│  ✅ Advanced SEO                                         │
│  ✅ Blog Integration                                     │
│  ✅ 3 Months Support                                     │
│                                                           │
│  ⏱️ Delivery: 7-10 Days                                  │
│  💡 Growing businesses                                  │
│                                                           │
│  ₹15,000          ← Discounted price (teal, bold)       │
│  ₹19,999          ← Original price (struck through)     │
│                                                           │
│  [ 🚀 Start Now ]                                        │
└─────────────────────────────────────────────────────────┘
```

### 2. Admin Dashboard - Plan List (admin-login.html)

```
Website Plans

┌────────────────────────────────────────────────────────────┐
│ 🎉 25% OFF ← Badge                                         │
│ Premium Website - ₹15,000 ₹19,999 ← Original (struck)     │
│ Premium website package                                    │
│ [✏️ Edit]  [🗑️ Delete]                                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ 🎉 30% OFF ← Badge                                         │
│ Basic Website - ₹10,000 ₹14,285 ← Original (struck)       │
│ Basic website package                                      │
│ [✏️ Edit]  [🗑️ Delete]                                    │
└────────────────────────────────────────────────────────────┘

[No offer]
┌────────────────────────────────────────────────────────────┐
│ Enterprise Website - ₹45,000 ← No badge, no struck price  │
│ Enterprise website package                                 │
│ [✏️ Edit]  [🗑️ Delete]                                    │
└────────────────────────────────────────────────────────────┘
```

### 3. User Dashboard - My Plans (user-dashboard.html)

```
┌─────────────────────────────────────────────────────┐
│                           🎉 25% OFF  ← Badge      │
│                                                     │
│  🥇 Gold                                            │
│  Website                                            │
│                                                     │
│  Plan Name: Premium Website                        │
│  Price: ₹15,000                                    │
│          ₹19,999 ← Original (struck)               │
│          25% OFF ← Offer info (teal, bold)         │
│                                                     │
│  Delivery Time: 7-10 Days                          │
│  Start Date: Jan 29, 2026                          │
│  Maintenance: Feb 28, 2026                         │
│  Time Remaining: 30 days                           │
│                                                     │
│  Ideal For: Growing businesses                     │
│                                                     │
│  [📨 Request Upgrade]  [📝 View Description]       │
└─────────────────────────────────────────────────────┘
```

---

## Step-by-Step: Adding an Offer

### Step 1: Navigate to Admin Plans Tab
```
Admin Dashboard
     ↓
Plans Tab
     ↓
Add New Plan Form
```

### Step 2: Fill Plan Details
```
Form Fields:
├─ Plan Category: Website ✓
├─ Plan Tier: Gold ✓
├─ Plan Name: Premium Website ✓
├─ Price: ₹15,000 ✓ (Discounted price)
├─ Original Rate: ₹19,999 ← NEW! (Before discount)
├─ Offer Percentage: 25 ← NEW! (Discount %)
├─ Description: Premium website package ✓
├─ Delivery Days: 7-10 Days ✓
├─ Ideal For: Growing businesses ✓
└─ Features: ✓
   ├─ 10-Page Website
   ├─ Custom UI/UX Design
   ├─ Advanced SEO
   └─ Blog Integration
```

### Step 3: Click "Add Plan"
```
Plan Created Successfully! ✅
     ↓
Displayed in "Added Plans" section with:
   🎉 25% OFF - Premium Website - ₹15,000
```

### Step 4: View on Website
```
Website → Plans Section
     ↓
Displays:
┌─────────────────────────────┐
│    🎉 25% OFF              │ ← Visible
│                             │
│  🥇 GOLD PLAN              │
│  Premium website package    │
│                             │
│  ... features ...           │
│                             │
│  ₹15,000                   │ ← Discounted price
│  ₹19,999                   │ ← Original price
│                             │
│  [🚀 Start Now]            │
└─────────────────────────────┘
```

---

## Offer Badge Appearance

### Location & Style
```
Position: Top-right corner of plan card
┌──────────────────────────────────┐
│                    ┌──────────────┐
│                    │🎉 25% OFF    │ ← Badge
│                    └──────────────┘
│  PLAN DETAILS                    │
│  ...                             │
│  ₹15,000                         │
│  ₹19,999                         │
└──────────────────────────────────┘
```

### Color & Effects
- **Background**: Pink/Red Gradient (🔴 #f093fb to #f5576c)
- **Text Color**: White
- **Font Weight**: Bold (700)
- **Border Radius**: 6px
- **Shadow**: Subtle drop shadow for depth
- **Emoji**: 🎉 Party popper for celebration

---

## Price Display Behavior

### With Offer
```
✅ When offerPercentage AND originalRate are set:

Display:
  ₹15,000              ← Discounted price (main, teal, bold)
  ₹19,999              ← Original price (smaller, gray, struck)
  
Also show badge: 🎉 25% OFF
```

### Without Offer
```
❌ When offerPercentage OR originalRate are empty:

Display:
  ₹15,000              ← Only current price (no struck through)
  
No badge shown
```

---

## Admin Panel - Plan Form

### Offer Fields (in Admin Plans Tab)

```
Form Layout:
┌────────────────────────────────────────┐
│ Plan Category      [Website        ▼]  │
│ Plan Tier          [Gold            ▼] │
│ Plan Name          [Premium Website  ] │
│ Price              [₹15,000         ]  │ ← Discounted
├────────────────────────────────────────┤
│ Original Rate      [₹19,999         ]  │ ← NEW! Optional
│ Offer Percentage   [25              ]  │ ← NEW! Optional
├────────────────────────────────────────┤
│ Description        [Premium package  ] │
│ Delivery Days      [7-10 Days       ]  │
│ Ideal For          [Growing business ]  │
├────────────────────────────────────────┤
│ Key Points / Features                  │
│ ├─ ✅ Feature 1    [X Remove]          │
│ ├─ ✅ Feature 2    [X Remove]          │
│ └─ [+ Add Feature]                     │
├────────────────────────────────────────┤
│ [Add Plan]                             │
│ ✅ Plan added successfully!            │
└────────────────────────────────────────┘
```

---

## Real-World Examples

### Example 1: Seasonal Promotion
```
Plan: Website Design
Original: ₹25,000
Discounted: ₹18,750
Offer: 25% OFF

Display:
🎉 25% OFF

₹18,750 (Pay this)
₹25,000 (Save this!)
```

### Example 2: Early Bird Discount
```
Plan: Social Media Management
Original: ₹5,000/month
Discounted: ₹3,500/month
Offer: 30% OFF

Display:
🎉 30% OFF

₹3,500 (Special price)
₹5,000 (Regular price)
```

### Example 3: Limited Time Offer
```
Plan: App Development
Original: ₹1,00,000
Discounted: ₹75,000
Offer: 25% OFF

Display:
🎉 25% OFF

₹75,000 (Today's price)
₹1,00,000 (Tomorrow's price)
```

---

## Responsive Behavior

### Desktop (Large Screens)
```
Full plan card with all details visible
Badge large and prominent (25% OFF)
Prices clearly separated and easy to read
```

### Tablet (Medium Screens)
```
Compact plan card layout
Badge still visible at top-right
Prices stacked vertically
All info readable
```

### Mobile (Small Screens)
```
Vertical plan layout
Badge repositioned for visibility
Prices stacked with clear hierarchy
Touch-friendly buttons
```

---

## Testing Scenarios

### Scenario 1: Add Plan with Offer
```
✅ Admin adds plan with:
   - Price: ₹15,000
   - Original: ₹19,999
   - Offer: 25%
✅ Badge displays: 🎉 25% OFF
✅ Both prices visible
✅ Prices correctly formatted
```

### Scenario 2: View on Website
```
✅ Open website homepage
✅ Go to Plans section
✅ See plan card with badge
✅ Badge positioned top-right
✅ Original price struck through
✅ Discount clearly visible
```

### Scenario 3: Edit Offer
```
✅ Admin clicks Edit
✅ Form loads with current values
✅ Admin changes offer to 30%
✅ Admin saves
✅ Badge updates: 🎉 30% OFF
✅ All displays refresh
```

### Scenario 4: Remove Offer
```
✅ Admin clicks Edit
✅ Clears Original Rate field
✅ Clears Offer Percentage field
✅ Admin saves
✅ Badge disappears
✅ Only current price shown
```

---

## FAQ - Offers

**Q: Do I have to set an offer?**
A: No! Both Original Rate and Offer Percentage are optional. If you leave them blank, no badge will show and only the current price displays.

**Q: Can I edit offers later?**
A: Yes! Click the Edit button on any plan to modify its offer details anytime.

**Q: Will users see the original price?**
A: Yes! When an offer is set, both prices display - original (struck through) and current (discounted).

**Q: How do I remove an offer?**
A: Edit the plan and clear the Original Rate and Offer Percentage fields, then save.

**Q: Can I set multiple offers on one plan?**
A: Currently, the system supports one offer per plan. The percentage applies to the price difference.

**Q: Does the price auto-calculate?**
A: No, you manually enter both the discounted price and original price. The system displays them as entered.

---

## Success Indicators ✅

- ✅ Admin can add offer percentage to plans
- ✅ Offer badge displays on all plan cards
- ✅ Original price shown as struck through
- ✅ Discounted price highlighted in teal
- ✅ Badge positioned on top-right
- ✅ Works across website, admin, and user dashboards
- ✅ Responsive on all devices
- ✅ Can edit/remove offers anytime
- ✅ Professional appearance with gradients

---

## Implementation Status

| Feature | Status | Location |
|---------|--------|----------|
| Admin form offer fields | ✅ Ready | admin-login.html |
| Server API support | ✅ Ready | server.js |
| Website display | ✅ Updated | index.html |
| User dashboard | ✅ Updated | user-dashboard.html |
| Admin dashboard | ✅ Updated | admin-login.html |
| Responsive design | ✅ Included | All files |
| Badge styling | ✅ Complete | CSS gradients |

---

## Need Help?

1. **Badge not showing?**
   - Ensure both "Original Rate" and "Offer Percentage" are filled
   - Check browser console for errors

2. **Prices not updating?**
   - Clear browser cache (Ctrl+Shift+Del)
   - Refresh page (Ctrl+R)

3. **Can't edit offer?**
   - Click the Edit button on the plan in Added Plans section
   - Make changes and click Update Plan

---

*Last Updated: January 29, 2026*
*Feature: Plan Offer System v1.0*
