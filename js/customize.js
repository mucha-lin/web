document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burgerToggle');
    const menu = document.getElementById('mainMenu');

    if (!burger || !menu) return;

    const toggleMenu = () => {
        const isOpen = menu.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(isOpen));
    };

    burger.addEventListener('click', toggleMenu);

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('open')) toggleMenu();
        });
    });

    // On the product list page, temporarily point all product links to the detail page
    const prodLinks = document.querySelectorAll('.prodList a');
    prodLinks.forEach(link => {
        link.setAttribute('href', 'product_inpage.html');
    });

    // Location hover: tie map points to contact cards with interruptible fades
    const mapPoints = document.querySelectorAll('.taiwanMapLink .maplocation');
    const contactCards = document.querySelectorAll('.service_locations .inf');
    const targetIds = new Set(
        Array.from(mapPoints)
            .map(point => point.dataset.contact)
            .filter(Boolean)
    );
    const controlledCards = Array.from(contactCards).filter(card => targetIds.has(card.id));

    if (mapPoints.length && controlledCards.length) {
        const duration = 300; // ms, 0.3s
        let activeCard = null;
        let animationFrame = null;
        let token = 0; // increments per interaction to cancel older animations

        const stopAnimation = () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        };

        const fade = (el, from, to, runToken) => new Promise(resolve => {
            stopAnimation();
            const start = performance.now();
            el.style.opacity = from;
            if (to > from) el.style.display = 'block';

            const step = now => {
                if (runToken !== token) {
                    if (to > from) {
                        el.style.opacity = '0';
                        el.style.display = 'none';
                    }
                    resolve('cancel');
                    return;
                }

                const progress = Math.min((now - start) / duration, 1);
                const value = from + (to - from) * progress;
                el.style.opacity = value;

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(step);
                } else {
                    if (to === 0) {
                        el.style.display = 'none';
                    }
                    animationFrame = null;
                    resolve('done');
                }
            };

            animationFrame = requestAnimationFrame(step);
        });

        const fadeOut = (el, runToken) => {
            const currentOpacity = parseFloat(getComputedStyle(el).opacity);
            const startOpacity = Number.isFinite(currentOpacity) ? currentOpacity : 0;
            return fade(el, startOpacity, 0, runToken);
        };

        const fadeIn = (el, runToken) => {
            const currentOpacity = parseFloat(getComputedStyle(el).opacity);
            const startOpacity = Number.isFinite(currentOpacity) ? currentOpacity : 0;
            return fade(el, startOpacity, 1, runToken);
        };

        // Prep cards: hide initially and attach leave handler (only controlled ones)
        controlledCards.forEach(card => {
            card.style.opacity = '0';
            card.style.display = 'none';
            card.addEventListener('mouseleave', () => {
                if (card !== activeCard) return;
                const runToken = ++token;
                fadeOut(card, runToken).then(() => {
                    if (runToken !== token) return;
                    activeCard = null;
                });
            });
        });

        const showCard = targetCard => {
            const runToken = ++token;
            (async () => {
                if (activeCard && activeCard !== targetCard) {
                    await fadeOut(activeCard, runToken);
                    if (runToken !== token) return;
                    activeCard = null;
                }

                activeCard = targetCard;
                await fadeIn(targetCard, runToken);
                if (runToken !== token) return;
            })();
        };

        mapPoints.forEach(point => {
            const targetId = point.dataset.contact;
            if (!targetId) return; // skip points without data-contact

            point.addEventListener('mouseenter', () => {
                const card = document.getElementById(targetId);
                if (!card || !targetIds.has(card.id)) return;
                showCard(card);
            });
        });
    }
});
