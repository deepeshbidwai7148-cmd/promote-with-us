# Testing the Admin Plans Feature

## Setup & Startup

1. Open terminal in the project directory
2. Run `npm install` (if not already done)
3. Run `npm start`
4. Navigate to `http://localhost:3000`

## Testing Steps

### Step 1: Login to Admin Dashboard
1. Scroll to footer and click the admin login button (👤)
2. Login credentials:
   - Username: `chetan` (or any of: aarshin, deepesh, sameer, jayesh)
   - Password: `ACDS@123`
3. Click "Login"

### Step 2: Navigate to Plans Tab
1. In the dashboard modal, click "➕ Plans" tab
2. You should see the "Add New Plan" form

### Step 3: Add a Test Plan
1. Fill in the form:
   - **Category**: Website
   - **Tier**: Silver
   - **Name**: Test Plan
   - **Price**: ₹10,000
   - **Description**: This is a test plan
2. Click "Add Plan"
3. Should see success message: "✅ Plan added successfully!"

### Step 4: Verify Plans List
1. Below the form, you should see "Added Plans" section
2. Your new plan should appear grouped under "Website"
3. It should show: "SILVER - Test Plan" with "₹10,000" and a Delete button

### Step 5: Test on Main Website
1. Close the dashboard modal (click X or Escape)
2. Click "Plans" in navigation or scroll to Plans section
3. Should see:
   - "Website Plans" heading (default plans)
   - Default Silver, Gold, Platinum plans
   - Below them, a new "Website Plans" heading (if you added a Website category plan)
   - Your newly added plan: "Silver - Test Plan ₹10,000"

### Step 6: Add Plans from Different Categories
1. Go back to Plans tab
2. Add another plan with:
   - **Category**: Social Media
   - **Tier**: Gold
   - **Name**: Social Media Management
   - **Price**: ₹25,000
3. Click "Add Plan"
4. Verify it appears in the list

### Step 7: View on Website
1. Go to Plans section
2. Should now see:
   - Website Plans (default)
   - Website Plans (admin-added) - with your test plan
   - Social Media Plans (admin-added) - with your social media plan

### Step 8: Test Delete
1. Go back to Plans tab
2. Click "Delete" button on a plan
3. Confirm deletion in the dialog
4. Plan should disappear from the list
5. Verify it's also removed from the website Plans section

## Expected Behavior

✅ Plans are organized by category with category headings
✅ Each category shows its plans in a grid
✅ Plans can be added from admin dashboard
✅ Plans appear dynamically on website
✅ Plans can be deleted
✅ Category headings appear when plans exist for that category
✅ All admin actions require authentication

## Troubleshooting

**Plans not appearing on website:**
- Check browser console for errors (F12 > Console)
- Verify server is running
- Try refreshing the page
- Check if plans.json was created

**Cannot add plans:**
- Verify you're logged in as admin
- Check all required fields are filled
- Look for error messages in the form

**Category heading not showing:**
- Make sure at least one plan was added for that category
- Refresh the page
- Check browser console

## Browser Console Debugging
Press F12 to open developer tools and check:
- Network tab to verify `/api/plans` requests work
- Console tab for any JavaScript errors
- Application tab to see plans.json data being saved
