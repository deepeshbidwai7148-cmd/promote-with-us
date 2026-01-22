// Global switchTab function for tab navigation
function switchTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active class from all buttons
  const tabButtons = document.querySelectorAll('.nav-tab-button');
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
  });

  // Show the selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Add active class to the clicked button
  const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submitBtn');
      const formMessage = document.getElementById('formMessage');
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate sending (replace with actual API call)
      setTimeout(() => {
        formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        formMessage.style.color = '#20c5b5';
        formMessage.style.display = 'block';
        
        this.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Close menu when clicking on a menu item
  const navLinks = document.querySelectorAll('.nav-menu li');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
});
