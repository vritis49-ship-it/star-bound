// Dynamic Star Generator
function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 150; // Adjust this number for more or fewer stars

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Randomize position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Randomize size
        const size = Math.random() * 3 + 1;
        
        // Randomize animation duration and delay
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 3;
        
        // Apply styles
        star.style.left = `${x}vw`;
        star.style.top = `${y}vh`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        
        container.appendChild(star);
    }
}

// Initialize stars when the page loads
window.onload = createStars;