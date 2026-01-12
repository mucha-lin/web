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
    // const prodLinks = document.querySelectorAll('.prodList a');
    // prodLinks.forEach(link => {
    //     link.setAttribute('href', 'product_inpage.html');
    // });

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

    const path = window.location.pathname;
    const matches = path.match(/([a-i])(\d{2})\.html$/);

    if (!matches) return;

    const currentCategory = matches[1];
    const currentIndex = parseInt(matches[2], 10);

    // 每個分類的產品數量
    const categoryCounts = {
        a: 7,
        b: 5,
        c: 7,
        d: 2,
        e: 3,
        f: 1,
        g: 4,
        h: 2,
        i: 4
    };

    generateBreadcrumb(currentCategory);
    generatePagination(currentCategory, currentIndex, categoryCounts);

    //列印
    document.querySelectorAll('.print-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.dataset.target;
            // 清除舊的列印標記
            document.querySelectorAll('.print-target').forEach(el => {
                el.classList.remove('print-only');
            });
            // 加上新的列印標記
            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add('print-only');
                window.print();
            }
        });
    });


});




function generateBreadcrumb(category) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (!breadcrumb) return;

    const categoryMap = {
        a: '手提式二氧化碳滅火器',
        b: '室內消防箱設備',
        c: '警報設備',
        d: '緊急廣播設備',
        e: '消防搶救設備',
        f: '自動撒水設備',
        g: '泡沫滅火設備',
        h: '緊急照明設備',
        i: '標示設備',
    };

    const categoryName = categoryMap[category] || 'Unknown Category';

    breadcrumb.innerHTML = `
    <a href="../index.html">首頁</a> <i class="fa-solid fa-angle-right"></i> 
    <a href="../product_list.html">產品介紹</a> <i class="fa-solid fa-angle-right"></i> 
    <sapn>${categoryName}</span>
  `;
}

//187行如果要改成有超連結可改為這個版本
// <a href="${category}01.html">${categoryName}</a> 


function generatePagination(category, index, categoryCounts) {
    const prevLink = document.getElementById('prevLink');
    const nextLink = document.getElementById('nextLink');
    if (!prevLink || !nextLink) return;

    const max = categoryCounts[category];
    const hasPrev = index > 1;
    const hasNext = index < max;

    if (hasPrev) {
        const prevIndex = String(index - 1).padStart(2, '0');
        prevLink.href = `${category}${prevIndex}.html`;
        prevLink.classList.remove('disabled');
    } else {
        prevLink.href = "#";
        prevLink.classList.add('disabled');
    }

    if (hasNext) {
        const nextIndex = String(index + 1).padStart(2, '0');
        nextLink.href = `${category}${nextIndex}.html`;
        nextLink.classList.remove('disabled');
    } else {
        nextLink.href = "#";
        nextLink.classList.add('disabled');
    }
}