document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive Cursor Glow
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation via Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.fade-up');
    elementsToReveal.forEach(el => observer.observe(el));
    
    // Initial trigger for hero elements (in case they are already in view)
    setTimeout(() => {
        document.querySelectorAll('#hero .fade-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // 4. Modal Logic
    const modalOverlay = document.getElementById('imageModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const cards = document.querySelectorAll('.feature-image-card');

    const modalContent = {
        gold: {
            title: 'Caramello',
            desc: 'Il calore del sole al tramonto racchiuso in una texture vellutata. Arricchito con note di caramello salato e polvere d\'oro alimentare. Un\'esplosione di lussuosa dolcezza che risveglia i sensi e illumina ogni singolo assaggio.',
            bg: 'var(--color-gold)'
        },
        maroon: {
            title: 'Lampone',
            desc: 'Profondo, intenso e avvolgente. Il cuore fondente al 75% incontra un retrogusto di frutti di bosco e vaniglia del Madagascar. Un\'esperienza dal sapore regale, creata per i palati più esigenti e per i momenti di vera meditazione.',
            bg: 'var(--color-maroon)'
        },
        blue: {
            title: 'Mirtillo',
            desc: 'Un\'audace sinfonia di freschezza. Una copertura croccante che nasconde un morbido ripieno al sentore di mirtilli selvatici e panna artigianale. Un contrasto sorprendente che danza tra le sfumature della notte e la vivacità del frutto.',
            bg: 'var(--color-blue)'
        }
    };

    const openModalForColor = (color) => {
        const data = modalContent[color];
        const cardTarget = document.querySelector(`.feature-image-card[data-color="${color}"]`);
        const imgSrc = cardTarget ? cardTarget.querySelector('img').src : '';

        if (data && imgSrc) {
            modalImage.src = imgSrc;
            modalTitle.textContent = data.title;
            modalDesc.textContent = data.desc;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const color = card.getAttribute('data-color');
            openModalForColor(color);
        });
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the container
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // 5. Hypnotic Sweep Transition
    const transitionLayer = document.getElementById('colorTransitionLayer');
    const colorSegments = document.querySelectorAll('.color-segment');

    colorSegments.forEach(segment => {
        segment.addEventListener('click', (e) => {
            e.preventDefault();
            const color = segment.getAttribute('data-color');
            const data = modalContent[color];
            
            if (data) {
                // Set transition color
                transitionLayer.style.backgroundColor = data.bg;
                
                // Sweep in
                transitionLayer.classList.remove('sweep-out');
                transitionLayer.classList.add('sweep-in');
                
                // Wait for sweep to cover screen
                setTimeout(() => {
                    // Jump to section behind the curtain
                    document.getElementById('collection').scrollIntoView({ behavior: 'instant' });
                    
                    // Open modal
                    openModalForColor(color);
                    
                    // Remove sweep (it exits to the right)
                    transitionLayer.classList.remove('sweep-in');
                    transitionLayer.classList.add('sweep-out');
                    
                    // Reset layer after animation finishes
                    setTimeout(() => {
                        transitionLayer.classList.remove('sweep-out');
                        // It snaps back to left: -100% via CSS instantly since we removed the classes, 
                        // but actually we need to remove the class and let it reset without animation. 
                        // To prevent backwards sliding, we temporarily disable transition.
                        transitionLayer.style.transition = 'none';
                        requestAnimationFrame(() => {
                            transitionLayer.style.transition = '';
                        });
                    }, 800);
                }, 800); // 800ms matches CSS transition duration
            }
        });
    });
});
