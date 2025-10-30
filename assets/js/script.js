/* ============================================
   Custom JavaScript for Toko Aldi Sembako
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 100,
            duration: 800,
            easing: 'ease-in-out'
        });
    }

    // Smooth scroll for internal anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    event.preventDefault();
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dynamic year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
