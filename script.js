document.addEventListener('DOMContentLoaded', () => {
    const App = {
        init() {
            this.initThemeToggle();
            this.initPageTransitions();
            this.initProfileLightbox();
            this.initContactForm();
            this.initProjectFilter(); 
        },

        initThemeToggle() {
            const themeToggle = document.getElementById('theme-toggle');
            if (!themeToggle) return;

            const icon = themeToggle.querySelector('i');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            let currentTheme = localStorage.getItem('theme');

            if (currentTheme === null) {
                currentTheme = prefersDark ? 'dark' : 'light';
            }

            this.setTheme(currentTheme, icon);

            themeToggle.addEventListener('click', () => {
                const newTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
                this.setTheme(newTheme, icon);
                localStorage.setItem('theme', newTheme);
            });
        },

        setTheme(theme, icon) {
            if (theme === 'light') {
                document.body.classList.add('light-theme');
                icon.classList.remove('fa-lightbulb');
                icon.classList.add('fa-moon');
            } else {
                document.body.classList.remove('light-theme');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-lightbulb');
            }
        },

        initPageTransitions() {
            const allLinks = document.querySelectorAll('.nav-link, .buttons-container .btn[href]');
            const navLinksOnly = document.querySelectorAll('.right-nav .nav-link');
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';

            // Xóa active cũ + gán active cho link hiện tại
            navLinksOnly.forEach(link => {
                link.classList.remove('active');
                const linkPath = link.getAttribute('href').split('/').pop() || 'index.html';
                if (linkPath === currentPath) {
                    link.classList.add('active');
                }
            });

            // Thêm lớp fade-in khi load trang
            document.body.classList.add('fade-in');
            requestAnimationFrame(() => {
                document.body.classList.remove('fade-in');
            });

            // Tạo overlay transition
            const transitionOverlay = document.createElement('div');
            transitionOverlay.className = 'transition-overlay';
            document.body.appendChild(transitionOverlay);

            // Xử lý hiệu ứng fade-out khi click link
            allLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    const isExternal = link.hasAttribute('target') || href.startsWith('http');
                    const linkPath = href ? (href.split('/').pop() || 'index.html') : null;

                    if (href && !isExternal && linkPath !== currentPath) {
                        e.preventDefault();
                        transitionOverlay.classList.add('active'); // Bật overlay
                        setTimeout(() => {
                            window.location.href = href;
                        }, 500); // ⏳ đợi 0.5s cho hiệu ứng
                    }
                });
            });
        },

        initProfileLightbox() {
            const profileImage = document.getElementById("profile-image");
            const lightbox = document.getElementById("lightbox");
            const closeBtn = document.querySelector(".close-btn");

            // Mở popup khi click ảnh
            profileImage.addEventListener("click", () => {
                lightbox.style.display = "flex";
            });

            // Đóng popup khi click nút close
            closeBtn.addEventListener("click", () => {
                lightbox.style.display = "none";
            });

            // Đóng popup khi click bên ngoài ảnh
            lightbox.addEventListener("click", (e) => {
                if (e.target === lightbox) {
                    lightbox.style.display = "none";
                }
            });


        },


        initContactForm() {
            const contactForm = document.getElementById('main-contact-form');
            if (!contactForm) return;

            contactForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(contactForm);
                const name = formData.get('name');
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.querySelector('.btn-text').textContent;

                submitButton.disabled = true;
                submitButton.querySelector('.btn-text').textContent = 'Sending...';

                setTimeout(() => {
                    this.showToast(`Thank you, ${name}! Your message has been sent.`);
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.querySelector('.btn-text').textContent = originalButtonText;
                }, 1000);
            });
        },

        initProjectFilter() {
            // const filterContainer = document.querySelector('.filter-nav');
            // if (!filterContainer) return;

            // const filterButtons = filterContainer.querySelectorAll('.filter-btn');
            // const projectItems = document.querySelectorAll('.project-item');

            // filterButtons.forEach(button => {
            //     button.addEventListener('click', () => {
            //         filterContainer.querySelector('.active').classList.remove('active');
            //         button.classList.add('active');

            //         const filter = button.dataset.filter;
            //         projectItems.forEach(item => {
            //             if (filter === 'all' || item.dataset.category === filter) {
            //                 item.classList.remove('hidden');
            //             } else {
            //                 item.classList.add('hidden');
            //             }
            //         });
            //     });
            // });
        },


        showToast(message) {
            const oldToast = document.querySelector('.toast-notification');
            if (oldToast) oldToast.remove();

            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => toast.classList.add('visible'), 10);
            setTimeout(() => {
                toast.classList.remove('visible');
                toast.addEventListener('transitionend', () => toast.remove(), { once: true });
            }, 5000);
        },

    };

    App.init();
});
