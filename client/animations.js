// animations.js
document.addEventListener('DOMContentLoaded', () => {
    // Select elements to animate
    const elements = document.querySelectorAll('.scroll-animation');
  
    // Initialize Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });
  
    // Observe each element
    elements.forEach(element => {
      observer.observe(element);
    });
  });
  