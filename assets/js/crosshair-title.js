// Efecto crosshair premium + cambio de texto al hacer hover
import gsap from 'https://cdn.skypack.dev/gsap';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('crosshair-title-container');
    if (!container) return;

    const titleElement = document.getElementById('animated-title');
    if (!titleElement) return;

    // Guardar el texto original
    const originalHTML = titleElement.innerHTML;
    // Texto alternativo que aparecerá al hacer hover
    const alternateText = "Cada línea de código<br>cuenta una <span class='accent'>historia.</span>";

    // Crear elementos del crosshair (igual que antes)
    const crosshairDiv = document.createElement('div');
    crosshairDiv.className = 'crosshair-element';
    crosshairDiv.style.position = 'absolute';
    crosshairDiv.style.top = '0';
    crosshairDiv.style.left = '0';
    crosshairDiv.style.width = '100%';
    crosshairDiv.style.height = '100%';
    crosshairDiv.style.pointerEvents = 'none';
    crosshairDiv.style.zIndex = '15';

    const lineH = document.createElement('div');
    lineH.className = 'crosshair-line-horizontal';
    const lineV = document.createElement('div');
    lineV.className = 'crosshair-line-vertical';

    crosshairDiv.appendChild(lineH);
    crosshairDiv.appendChild(lineV);
    container.appendChild(crosshairDiv);

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    function getRelativeMousePos(e) {
        const rect = container.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        x = Math.min(Math.max(x, 0), rect.width);
        y = Math.min(Math.max(y, 0), rect.height);
        return { x, y };
    }

    function animateLines() {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;
        gsap.set(lineV, { x: currentX });
        gsap.set(lineH, { y: currentY });
        requestAnimationFrame(animateLines);
    }

    // Filtros SVG para efecto glitch
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "0";
    svg.style.height = "0";
    svg.style.opacity = "0";
    document.body.appendChild(svg);

    const defs = document.createElementNS(svgNS, "defs");
    svg.appendChild(defs);

    const filterX = document.createElementNS(svgNS, "filter");
    filterX.setAttribute("id", "filter-noise-x-title");
    const feTurbulenceX = document.createElementNS(svgNS, "feTurbulence");
    feTurbulenceX.setAttribute("type", "fractalNoise");
    feTurbulenceX.setAttribute("baseFrequency", "0.000001");
    feTurbulenceX.setAttribute("numOctaves", "1");
    const feDisplaceX = document.createElementNS(svgNS, "feDisplacementMap");
    feDisplaceX.setAttribute("in", "SourceGraphic");
    feDisplaceX.setAttribute("scale", "40");
    filterX.appendChild(feTurbulenceX);
    filterX.appendChild(feDisplaceX);
    defs.appendChild(filterX);

    const filterY = document.createElementNS(svgNS, "filter");
    filterY.setAttribute("id", "filter-noise-y-title");
    const feTurbulenceY = document.createElementNS(svgNS, "feTurbulence");
    feTurbulenceY.setAttribute("type", "fractalNoise");
    feTurbulenceY.setAttribute("baseFrequency", "0.000001");
    feTurbulenceY.setAttribute("numOctaves", "1");
    const feDisplaceY = document.createElementNS(svgNS, "feDisplacementMap");
    feDisplaceY.setAttribute("in", "SourceGraphic");
    feDisplaceY.setAttribute("scale", "40");
    filterY.appendChild(feTurbulenceY);
    filterY.appendChild(feDisplaceY);
    defs.appendChild(filterY);

    let turbulenceObj = { val: 1 };
    const noiseTimeline = gsap.timeline({ paused: true });
    noiseTimeline.to(turbulenceObj, {
        duration: 0.5,
        ease: "power1",
        startAt: { val: 1 },
        val: 0,
        onUpdate: () => {
            feTurbulenceX.setAttribute("baseFrequency", turbulenceObj.val);
            feTurbulenceY.setAttribute("baseFrequency", turbulenceObj.val);
        },
        onComplete: () => {
            lineH.style.filter = "none";
            lineV.style.filter = "none";
        }
    });

    // ===== EFECTO DE CAMBIO DE TEXTO =====
    let isHovering = false;
    let textAnimation;

    function changeTextWithGlitch(newHTML) {
        // Animación de salida (fade out + scale)
        gsap.to(titleElement, {
            duration: 0.2,
            opacity: 0,
            scale: 0.95,
            ease: "power2.in",
            onComplete: () => {
                titleElement.innerHTML = newHTML;
                gsap.to(titleElement, {
                    duration: 0.3,
                    opacity: 1,
                    scale: 1,
                    ease: "back.out(1.2)"
                });
            }
        });
    }

    function resetText() {
        if (titleElement.innerHTML !== originalHTML) {
            changeTextWithGlitch(originalHTML);
        }
    }

    function setAlternateText() {
        if (titleElement.innerHTML !== alternateText) {
            changeTextWithGlitch(alternateText);
        }
    }

    // Eventos hover
    container.addEventListener("mouseenter", () => {
        isHovering = true;
        // Mostrar líneas
        gsap.to([lineH, lineV], { duration: 0.3, opacity: 1 });
        lineH.style.filter = "url(#filter-noise-x-title)";
        lineV.style.filter = "url(#filter-noise-y-title)";
        noiseTimeline.restart();
        // Cambiar texto
        setAlternateText();
    });

    container.addEventListener("mouseleave", () => {
        isHovering = false;
        gsap.to([lineH, lineV], { duration: 0.4, opacity: 0 });
        noiseTimeline.progress(1).kill();
        resetText();
    });

    container.addEventListener("mousemove", (e) => {
        const pos = getRelativeMousePos(e);
        mouseX = pos.x;
        mouseY = pos.y;
    });

    animateLines();
});