// Carrusel para cada celda del grid del hero
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.carousel-hero-card');
    
    cards.forEach(card => {
        const imagesData = card.getAttribute('data-images');
        if (!imagesData) return;
        
        let images = [];
        try {
            images = JSON.parse(imagesData);
        } catch(e) {
            console.error('Error parsing images data', e);
            return;
        }
        
        if (!images.length) return;
        
        let currentIndex = 0;
        const imgElement = card.querySelector('.carousel-hero-img');
        if (!imgElement) return;
        
        const intervalTime = parseInt(card.getAttribute('data-interval')) || 2000;
        
        function changeImage() {
            currentIndex = (currentIndex + 1) % images.length;
            // Transición suave (fade)
            imgElement.style.opacity = '0.5';
            setTimeout(() => {
                imgElement.src = images[currentIndex];
                imgElement.style.opacity = '1';
            }, 200);
        }
        
        setInterval(changeImage, intervalTime);
    });
    
    // Reaplicar el efecto de "active" aleatorio (el que ya existía en main.js)
    function animateShowcase() {
        const cards = document.querySelectorAll('.showcase-card');
        if (!cards.length) return;
        cards.forEach(c => c.classList.remove('active'));
        const count = Math.floor(Math.random() * 2) + 2;
        const indices = [];
        while (indices.length < count) {
            const r = Math.floor(Math.random() * cards.length);
            if (!indices.includes(r)) indices.push(r);
        }
        indices.forEach(i => cards[i].classList.add('active'));
    }
    setInterval(animateShowcase, 1200);
    animateShowcase();
});