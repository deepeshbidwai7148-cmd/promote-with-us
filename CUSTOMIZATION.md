# Quick Customization Guide

## 🎨 Color Customization

### Change Primary Color
Edit `css/enhanced.css` line 6:
```css
--primary: #164069;  /* Change to your brand color */
```

### Change Secondary Color (Teal)
Edit `css/enhanced.css` line 7:
```css
--secondary: #20c5b5;  /* Change to your accent color */
```

### Change Accent Color (Red)
Edit `css/enhanced.css` line 8:
```css
--accent: #ff6b6b;  /* Change to your highlight color */
```

**Common Color Values:**
```
Blue:     #0066FF
Green:    #00CC66
Purple:   #9966FF
Orange:   #FF9900
Pink:     #FF66CC
```

---

## 📝 Text Content Updates

### Update Hero Title
Find in `index.html`:
```html
<span class="text-gradient">Transform Your Business</span>
```
Replace with your title.

### Update Hero Subtitle
Find in `index.html`:
```html
<p style="font-size: 20px; color: #666; margin-bottom: 30px;">
  From Offline to Online with Stunning Digital Solutions
</p>
```

### Update Section Titles
```html
<h2>Why Choose Us</h2>  <!-- Change this -->
<p>Experience cutting-edge web development...</p>  <!-- Change this -->
```

### Update Feature Cards
Find the 6 feature cards:
```html
<div class="card fade-in" data-animate>
  <div class="feature-icon">🎨</div>  <!-- Change emoji -->
  <h3>Beautiful Design</h3>  <!-- Change title -->
  <p>Modern, responsive designs...</p>  <!-- Change description -->
</div>
```

---

## 🎬 Animation Adjustments

### Speed Up Float Animation
In `css/enhanced.css`, find:
```css
.gradient-bg::before,
.gradient-bg::after {
  animation: float 20s ease-in-out infinite;  /* Reduce 20s for faster */
}
```
Change `20s` to smaller number like `10s` for faster animation.

### Change Fade-In Animation Speed
Find in `css/enhanced.css`:
```css
.fade-in {
  animation: fadeInUp 0.6s ease forwards;  /* Change 0.6s */
}
```
Reduce for faster, increase for slower.

### Adjust Hover Effects
Find `.card:hover`:
```css
.card:hover {
  transform: translateY(-8px);  /* Change -8px for more/less lift */
  box-shadow: var(--shadow-lg);
}
```

### Modify Button Hover
Find `.btn-primary:hover`:
```css
.btn-primary:hover {
  transform: translateY(-2px);  /* Change movement */
  box-shadow: 0 15px 40px rgba(22, 64, 105, 0.4);
}
```

---

## 🎯 3D Scene Customization

### Change 3D Cube Color
In `js/enhanced-3d.js`, find:
```javascript
const cubeMaterial = new THREE.MeshPhongMaterial({
  color: 0x164069,  // Change this hex color
  shininess: 100,
});
```

### Change 3D Sphere Color
Find:
```javascript
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x20c5b5,  // Change this color
  emissive: 0x20c5b5,  // Match the above color
});
```

### Add More 3D Objects
Add in `createAnimatedObjects()` method:
```javascript
// Example: Add an octahedron
const octGeo = new THREE.OctahedronGeometry(1.5, 0);
const octMat = new THREE.MeshPhongMaterial({ color: 0xff9900 });
const octahedron = new THREE.Mesh(octGeo, octMat);
octahedron.position.set(2, -1, 0);
this.scene.add(octahedron);
this.objects.push({ mesh: octahedron, rotationSpeed: 0.01, type: 'octahedron' });
```

### Change Lighting
Find `setupLights()` method:
```javascript
// Ambient light brightness (0.6 = 60% brightness)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

// Point light color and intensity
const pointLight = new THREE.PointLight(0x20c5b5, 1);  // (color, brightness)
```

---

## 🔘 Button Text Changes

### Hero CTA Buttons
```html
<button class="btn btn-primary">Get Started</button>
<button class="btn btn-secondary">Learn More</button>
```

### Footer CTA Button
```html
<button class="btn btn-primary" style="padding: 16px 40px;">
  Start Your Free Consultation
</button>
```

---

## 🏗️ Add New Sections

### Template for New Section
```html
<section style="background: white;">
  <div class="container">
    <div class="section-title">
      <h2>Section Title</h2>
      <p>Section subtitle/description</p>
    </div>
    
    <div class="grid grid-3">
      <div class="card fade-in" data-animate>
        <h3>Item Title</h3>
        <p>Item description</p>
      </div>
      <!-- Repeat for more items -->
    </div>
  </div>
</section>
```

### Template for Glass Card
```html
<div class="glass-card fade-in" data-animate>
  <h3>Title</h3>
  <p>Description text here</p>
  <div style="margin-top: 20px;">
    <span style="display: inline-block; background: rgba(32, 197, 181, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 12px; color: #20c5b5;">Tag 1</span>
  </div>
</div>
```

---

## 🎨 Font Customization

### Change Font Family
In `css/enhanced.css`, find:
```css
body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

**Replace with:**
```css
/* Google Font Example */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}
```

### Change Heading Font Size
Find in `css/enhanced.css`:
```css
h1 { font-size: 48px; }   /* Change for larger/smaller */
h2 { font-size: 36px; }
h3 { font-size: 24px; }
```

---

## 🖼️ Image & Icon Changes

### Change Feature Icons
Find feature cards and replace emojis:
```html
<div class="feature-icon">🎨</div>
<!-- Change 🎨 to any emoji:
🚀 🎯 💡 ⚡ 🔒 📱 💬 🎨 ✨ 🌟 -->
```

### Add Logo/Images
```html
<!-- In hero section -->
<img src="images/your-logo.png" alt="Logo" style="width: 100px; margin-bottom: 20px;">
```

---

## 📐 Spacing & Layout Changes

### Change Section Padding
Find `section { padding: 80px 20px; }` and adjust:
```css
section { padding: 40px 20px; }  /* Reduce for tighter spacing */
```

### Change Grid Gap
Find `.grid { gap: 32px; }` and adjust:
```css
.grid { gap: 16px; }  /* Smaller gaps between items */
```

### Change Container Width
Find `.container { max-width: 1200px; }`:
```css
.container { max-width: 1000px; }  /* Narrower or wider */
```

---

## 🌈 Gradient Customization

### Change Background Gradient
Find in `css/enhanced.css`:
```css
:root {
  --gradient-main: linear-gradient(135deg, #164069 0%, #20c5b5 100%);
  --gradient-accent: linear-gradient(135deg, #ff6b6b 0%, #ff8e72 100%);
  --gradient-dark: linear-gradient(135deg, #0a0e27 0%, #1a2847 100%);
}
```

**Create custom gradient:**
```css
linear-gradient(135deg, #startColor 0%, #endColor 100%)
```

Direction options: `to right`, `to bottom`, `135deg`, `45deg`, etc.

---

## 🎪 Shadow Customization

### Change Box Shadows
Find in `css/enhanced.css`:
```css
--shadow-lg: 0 20px 60px rgba(22, 64, 105, 0.15);
--shadow-md: 0 10px 30px rgba(22, 64, 105, 0.1);
--shadow-sm: 0 5px 15px rgba(22, 64, 105, 0.05);
```

Shadow syntax: `offsetX offsetY blur spread rgba(R, G, B, opacity)`

---

## 📱 Responsive Breakpoint Changes

### Modify Mobile Breakpoint
Find in `css/enhanced.css`:
```css
@media (max-width: 768px) {
  /* Mobile styles - adjust 768px value */
}
```

Common breakpoints:
- 480px: Small mobile
- 768px: Tablet
- 1024px: Desktop
- 1440px: Large desktop

---

## ⌚ Animation Timing Reference

### Common Animation Durations
```css
0.3s  /* Quick interactions */
0.6s  /* Fade-in effects */
2s    /* Pulse animations */
6s    /* Floating animations */
15s   /* Gradient shifts */
20s   /* Background floats */
```

### Easing Functions
```css
ease              /* Default smooth */
ease-in           /* Slow start */
ease-out          /* Slow end */
ease-in-out       /* Slow both ends */
linear            /* Constant speed */
cubic-bezier()    /* Custom */
```

---

## 🔍 Advanced: Custom CSS Classes

### Create Custom Animation
```css
@keyframes myAnimation {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.my-animation {
  animation: myAnimation 0.6s ease forwards;
}
```

### Create Custom Component
```css
.my-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.my-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

---

## 🎯 Quick Tips

1. **Always test on mobile** after changes
2. **Use browser DevTools** to preview changes before saving
3. **Keep color contrast** for accessibility
4. **Don't overuse animations** - they should enhance, not distract
5. **Use CSS variables** for easy theming
6. **Test in multiple browsers** (Chrome, Firefox, Safari)

---

## 🚀 Next Steps

1. Customize colors to match your brand
2. Update all text content
3. Add your logo and images
4. Modify animations to your preference
5. Test on all devices
6. Add more sections as needed
7. Optimize for SEO
8. Deploy and celebrate! 🎉

Enjoy your enhanced website! 💜
