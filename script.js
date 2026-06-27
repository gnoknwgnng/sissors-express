document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Lazy Load & Play Videos on Viewport Intersection
    const lazyVideos = document.querySelectorAll('.lazy-video');
    
    if ('IntersectionObserver' in window) {
        const lazyVideoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    const source = video.querySelector('source');
                    if (source && source.dataset.src) {
                        source.src = source.dataset.src;
                        video.load();
                        video.play().catch(err => console.log("Video play prevented: ", err));
                    }
                    // Keep observing but we could unobserve if we don't want to pause it
                    // Actually, let's pause it when it goes out of view to save CPU!
                } else {
                    // Pause if it goes out of view
                    if (video.currentTime > 0 && !video.paused && !video.ended) {
                        video.pause();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px 200px 0px" // Preload 200px before entering viewport
        });

        lazyVideos.forEach(video => {
            lazyVideoObserver.observe(video);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyVideos.forEach(video => {
            const source = video.querySelector('source');
            if (source && source.dataset.src) {
                source.src = source.dataset.src;
                video.load();
                video.play().catch(err => console.log(err));
            }
        });
    }

    // Handle missing videos gracefully
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('error', function(e) {
            this.parentElement.style.backgroundColor = '#111';
        });
    });
});
