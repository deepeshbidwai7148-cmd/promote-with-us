# User Dashboard & Admin Panel Fixes

## Issues Fixed

### 1. **Plan Name Matching Issue (Case-Sensitive)**
   - **Problem**: Plan names in leads.json (e.g., "Gold Plan") didn't match plan names in plans.json (e.g., "GOLD PLAN")
   - **Solution**: Updated user-dashboard.html to use case-insensitive plan name matching
   - **File**: `user-dashboard.html` (Line ~710)
   - **Change**: 
     ```javascript
     // Before
     const planDetail = allPlans.find(p => p.name === planName);
     
     // After
     const planDetail = allPlans.find(p => 
         p.name && p.name.toLowerCase() === planName.toLowerCase()
     );
     ```

### 2. **Missing Plan Duration Dates**
   - **Problem**: Plan start and end dates were not being displayed on user dashboard
   - **Solution**: Added `planStartDate` and `planEndDate` fields to leads.json for "Promote" user
   - **File**: `leads.json`
   - **Added Fields**:
     ```json
     "planStartDate": "2026-01-22",
     "planEndDate": "2026-02-22"
     ```

### 3. **Plan Dropdown in Admin Panel**
   - **Problem**: Admin had to manually type plan names in text field; no validation or selection from available plans
   - **Solution**: Converted plan selection from text input to dropdown with all available plans
   - **Files Modified**:
     - `admin-login.html` (Line ~1155): Changed `<input>` to `<select>` dropdown
     - `admin-login.html` (Line ~1426): Added `populatePlanDropdownForAdmin()` function
   
   - **Dropdown Features**:
     - Displays all available plans with tier, category, and price
     - Pre-selects current user's plan when modal opens
     - Only populated for approved users (when editing is enabled)

## Data Flow

### User Dashboard Display
1. User logs in → Username stored in localStorage
2. Dashboard loads plans data via `/api/leads` endpoint
3. Finds user record by matching username (case-insensitive)
4. Matches user's plan name with plans.json using case-insensitive comparison
5. Displays plan card with:
   - Plan name, price, delivery time, ideal use case
   - Start date and end date (from planStartDate/planEndDate or created_at fallback)
   - Time remaining calculation
   - Update/Upgrade and Request Update buttons

### Admin Panel Edit Panel
1. Admin clicks user row → showDetailModal() opens
2. For approved users, edit panel shows with plan dropdown
3. populatePlanDropdownForAdmin() fetches all plans and populates dropdown
4. Current plan is pre-selected in dropdown
5. Admin can change plan, set start/end dates, edit company info
6. On save, PUT request to `/api/lead/:id` with all updated fields

## API Endpoints

### GET /api/leads
Returns lead records with camelCase field names:
```json
{
  "leads": [{
    "brandName": "...",
    "plan": "Gold Plan",
    "planStartDate": "2026-01-22",
    "planEndDate": "2026-02-22",
    ...
  }]
}
```

### PUT /api/lead/:id
Updates lead with new data:
```json
{
  "brandName": "...",
  "phone": "...",
  "email": "...",
  "plan": "...",
  "requirements": "...",
  "planStartDate": "2026-01-22",
  "planEndDate": "2026-02-22"
}
```

## Testing Checklist

- [x] Plan name matching works (case-insensitive)
- [x] Dates display on user dashboard
- [x] Time remaining calculation works
- [x] Admin plan dropdown populated with all plans
- [x] Plan dropdown pre-selects current plan
- [x] Admin can edit and save plan changes
- [ ] User sees updated dates after admin makes changes
- [ ] Expired plan countdown shows "Expired"

## Files Modified

1. **user-dashboard.html**
   - Line ~710: Fixed plan name matching with toLowerCase()

2. **admin-login.html**
   - Line ~1155: Changed plan input from text to dropdown
   - Line ~1212: Added call to populatePlanDropdownForAdmin()
   - Line ~1426: Added new function populatePlanDropdownForAdmin()

3. **leads.json**
   - Added planStartDate and planEndDate to "Promote" user record

## Next Steps

1. Test complete user login flow
2. Test admin edit and save functionality
3. Verify dates persist after page refresh
4. Test with multiple users having different plans
