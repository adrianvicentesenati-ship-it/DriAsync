document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.pc-card-wrapper');
    const shell = document.querySelector('.pc-card-shell');
    if (!wrapper || !shell) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;

    function updatePosition(x, y) {
        const rect = wrapper.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const percentX = (x / width) * 100;
        const percentY = (y / height) * 100;
        const centerX = percentX - 50;
        const centerY = percentY - 50;
        const fromCenter = Math.min(1, Math.hypot(centerX, centerY) / 50);
        const fromTop = percentY / 100;
        const fromLeft = percentX / 100;

        wrapper.style.setProperty('--pointer-x', `${percentX}%`);
        wrapper.style.setProperty('--pointer-y', `${percentY}%`);
        wrapper.style.setProperty('--pointer-from-center', fromCenter);
        wrapper.style.setProperty('--pointer-from-top', fromTop);
        wrapper.style.setProperty('--pointer-from-left', fromLeft);
        wrapper.style.setProperty('--rotate-x', `${-centerX / 6}deg`);
        wrapper.style.setProperty('--rotate-y', `${centerY / 6}deg`);
        wrapper.style.setProperty('--background-x', `${35 + percentX * 0.3}%`);
        wrapper.style.setProperty('--background-y', `${35 + percentY * 0.3}%`);
    }

    function animate() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        updatePosition(currentX, currentY);
        if (Math.abs(targetX - currentX) > 0.3 || Math.abs(targetY - currentY) > 0.3) {
            rafId = requestAnimationFrame(animate);
        } else {
            rafId = null;
        }
    }

    function setTarget(x, y) {
        targetX = x;
        targetY = y;
        if (!rafId) rafId = requestAnimationFrame(animate);
    }

    function resetToCenter() {
        const rect = wrapper.getBoundingClientRect();
        setTarget(rect.width / 2, rect.height / 2);
    }

    const handleMouseMove = (e) => {
        const rect = wrapper.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        x = Math.min(Math.max(x, 0), rect.width);
        y = Math.min(Math.max(y, 0), rect.height);
        setTarget(x, y);
    };

    const handleMouseEnter = (e) => {
        wrapper.classList.add('active');
        shell.classList.add('entering');
        setTimeout(() => shell.classList.remove('entering'), 200);
        const rect = wrapper.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        x = Math.min(Math.max(x, 0), rect.width);
        y = Math.min(Math.max(y, 0), rect.height);
        setTarget(x, y);
    };

    const handleMouseLeave = () => {
        wrapper.classList.remove('active');
        resetToCenter();
    };

    wrapper.addEventListener('mouseenter', handleMouseEnter);
    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', handleMouseLeave);

    // animación inicial
    const rect = wrapper.getBoundingClientRect();
    currentX = rect.width - 70;
    currentY = 40;
    updatePosition(currentX, currentY);
    setTimeout(() => resetToCenter(), 100);
});