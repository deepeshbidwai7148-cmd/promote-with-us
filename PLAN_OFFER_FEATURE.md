# Plan Offer Feature - Implementation Guide

## Overview
The offer feature allows admins to add discounts to plans. When an offer is set, the system displays:
- ✅ Original price (crossed out)
- ✅ Discounted price (in teal/green color)
- ✅ Offer percentage badge (displayed on top-right of plan cards)

## How It Works

### Admin Side - Adding/Editing Offers

#### Step 1: Add New Plan with Offer
1. Go to Admin Dashboard → **Plans Tab**
2. Fill in the form:
   - Plan Category *
   - Plan Tier *
   - Plan Name *
   - **Price** - The discounted price (what users will pay)
   - **Original Rate** - The original price before discount (optional)
   - **Offer Percentage** - Discount percentage (e.g., 25)
   - Description
   - Delivery Days
   - Ideal For
   - Features

3. Click **"Add Plan"**

#### Step 2: Edit Existing Plan to Add/Modify Offer
1. In the "Added Plans" section, click **✏️ Edit** on any plan
2. Update the offer fields:
   - Original Rate (before discount)
   - Offer Percentage (discount %)
3. Click **"Update Plan"**

### How Offers Display

#### 1. Main Website (index.html)
- **Location**: Top-right corner of plan card
- **Badge**: `🎉 25% OFF` (in red/pink gradient)
- **Price Display**:
  - New Price: `₹15,000` (in teal, larger font)
  - Original Price: `₹19,999` (struck through, gray, smaller font)

#### 2. User Dashboard (user-dashboard.html)
- **Location**: Top-right corner of user's plan card
- **Badge**: `🎉 25% OFF` (in red/pink gradient)
- **Price Display**:
  - Offer Price: `₹15,000` (in teal)
  - Original Price: `₹19,999` (struck through)
  - Offer Info: `25% OFF` (in teal, smaller font)

#### 3. Admin Dashboard (admin-login.html)
- **Location**: Top-right corner of plan listing
- **Badge**: `🎉 25% OFF` (in red/pink gradient)
- **Price Display**:
  - Plan Name and Price: `Plan Name - ₹15,000`
  - Original Price: `₹19,999` (struck through, gray)

## Database Structure

### Plan Object
```json
{
  "id": 1,
  "category": "Website",
  "tier": "Gold",
  "name": "Premium Website",
  "price": "₹15,000",
  "originalRate": "₹19,999",
  "offerPercentage": "25",
  "description": "Premium website package",
  "features": ["..."],
  "deliveryTime": "7-10 Days",
  "idealFor": "Growing businesses",
  "created_at": "2026-01-29T..."
}
```

## API Endpoints

### Create Plan with Offer
**POST** `/api/plans`
```javascript
{
  "category": "Website",
  "tier": "Gold",
  "name": "Premium Website",
  "price": "₹15,000",
  "originalRate": "₹19,999",
  "offerPercentage": "25",
  "description": "Premium website package",
  "features": ["..."],
  "deliveryTime": "7-10 Days",
  "idealFor": "Growing businesses"
}
```

### Update Plan with Offer
**PUT** `/api/plans/:id`
```javascript
{
  "category": "Website",
  "tier": "Gold",
  "name": "Premium Website",
  "price": "₹15,000",
  "originalRate": "₹19,999",
  "offerPercentage": "25",
  "description": "Premium website package",
  "features": ["..."],
  "deliveryTime": "7-10 Days",
  "idealFor": "Growing businesses"
}
```

### Get All Plans
**GET** `/api/plans`

Returns all plans grouped by category with offer information included.

## User Experience Flow

```
User Visits Website
        ↓
Browses Plans Section
        ↓
Sees Plan Card with:
  - Offer Badge (🎉 25% OFF)
  - Discounted Price (₹15,000)
  - Original Price (₹19,999 struck through)
        ↓
Clicks "Start Now"
        ↓
Proceeds with Purchase
```

## Admin Experience Flow

```
Admin Login
        ↓
Go to Plans Tab
        ↓
Click "Add New Plan"
        ↓
Fill Form with Offer Details:
  - Price: ₹15,000
  - Original Rate: ₹19,999
  - Offer %: 25
        ↓
Click "Add Plan"
        ↓
Plan Displayed with Badge:
  "🎉 25% OFF - Premium Website - ₹15,000"
        ↓
Admin Can Edit or Delete
```

## Visual Styling

### Offer Badge
```css
Background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
Color: white
Padding: 8px 12px
Border-radius: 6px
Font-weight: 700
Font-size: 14px
Box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3)
Position: absolute top-right
```

### Discounted Price
- Color: #20c5b5 (teal)
- Font-weight: 600
- Font-size: 18px
- Margin: 0

### Original Price (Struck Through)
- Color: #999 (gray)
- Font-size: 13px
- Text-decoration: line-through
- Margin: 5px 0 0 0

## Testing Checklist

### Test 1: Add Plan with Offer
- [ ] Admin adds plan with offer percentage
- [ ] Plan displays in admin dashboard with badge
- [ ] Badge shows correct percentage
- [ ] Original price shown as struck through
- [ ] Discounted price shown in teal

### Test 2: View Plan on Website
- [ ] Plan displays with offer badge
- [ ] Badge positioned top-right
- [ ] Both prices visible
- [ ] "Start Now" button functional

### Test 3: User Dashboard
- [ ] User with plan sees offer badge
- [ ] Offer details displayed correctly
- [ ] Price comparison clear

### Test 4: Edit Plan Offer
- [ ] Admin edits offer percentage
- [ ] Changes reflected immediately
- [ ] All displays updated

### Test 5: Remove Offer
- [ ] Admin clears offer fields
- [ ] Offer badge disappears
- [ ] Only current price shown

## Files Modified

1. **index.html**
   - Updated plan card display to show offer badge
   - Added original price display (struck through)
   - Conditional rendering based on offerPercentage

2. **admin-login.html**
   - Updated plan listing to show offer badge
   - Display original price when offer exists
   - Plan form already had offer fields

3. **user-dashboard.html**
   - Updated plan card display with offer badge
   - Added original price display
   - Added offer badge positioning

4. **server.js** ✅ (Already Implemented)
   - POST /api/plans endpoint handles offer fields
   - PUT /api/plans/:id endpoint handles offer updates
   - GET /api/plans returns all offer data

## Features

✅ Add offer percentage when creating plan
✅ Edit offer percentage for existing plans
✅ Display offer badge on all plan cards
✅ Show original price (struck through)
✅ Show discounted price prominently
✅ Works across all interfaces (website, admin, user dashboard)
✅ Responsive design
✅ Beautiful gradient styling

## Future Enhancements

- Auto-calculate offer price based on percentage
- Offer expiry dates
- Multiple offer types (percentage, flat discount)
- Promotional campaigns with offers
- Bulk offer updates
- Offer analytics/reporting

## Troubleshooting

### Offer badge not showing?
- Verify `offerPercentage` is set
- Verify `originalRate` is set
- Check browser console for errors

### Original price not showing?
- Ensure `originalRate` field has a value
- Check that both price and originalRate are provided

### Plan updates not reflected?
- Clear browser cache
- Refresh page
- Check network requests in developer tools

## Support

For issues or questions about the offer feature, check:
1. Server logs for API errors
2. Browser console for JavaScript errors
3. Network tab for API response validation
4. Database (plans.json) for stored offer values
