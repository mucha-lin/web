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
});
