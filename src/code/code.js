import Lenis from "lenis";
import { gsap } from "gsap";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis({
        wheelMultiplier: 2,
        smoothWheel: true,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    function mobileMenu() {
        const breakpoint = 992;
        if (window.innerWidth >= breakpoint) {
            const menu = document.getElementById("main-navigation");
            if (menu) {
                menu.style.transform = "translateX(0)";
                const menuIcon = document.querySelector(
                    ".header__menu-toggler"
                );
                if (menuIcon) {
                    menuIcon.setAttribute("aria-expanded", "false");
                }
            }
            return; // Exit the function if the screen is desktop size
        }
        const menuIcon = document.querySelector(".header__menu-toggler");
        const menu = document.getElementById("main-navigation");
        const menuItem = menu?.querySelectorAll(".header__menu-item");
        if (!menuIcon || !menu) return;

        let openState = menuIcon?.getAttribute("aria-expanded") === "true";

        function toggle() {
            menuIcon.setAttribute("aria-expanded", openState);
            if (openState) {
                menu.style.transform = "translateX(0)";
            } else {
                menu.style.transform = "translateX(100%)";
            }
        }

        menuIcon?.addEventListener("click", (e) => {
            openState = !openState;
            toggle();
        });

        menuItem?.forEach((item) => {
            item.addEventListener("click", (e) => {
                openState = !openState;
                toggle();
            });
        });
    }

    function buttonEffect() {
        const buttons = document.querySelectorAll(".btn");
        buttons.forEach((button) => {
            const bg = button.querySelector(".btn__bg");

            //========= BG follow mouse effect
            const handleOrigin = (e) => {
                const rect = button.getBoundingClientRect();
                bg.style.left = `${e.clientX - rect.left}px`;
                bg.style.top = `${e.clientY - rect.top}px`;
            };

            button.addEventListener("mouseenter", (e) => {
                handleOrigin(e);
            });

            button.addEventListener("mouseleave", (e) => {
                handleOrigin(e);
            });
        });
    }

    const serviceSwiper = new Swiper(".mySwiper", {
        modules: [Navigation],
        slidesPerView: 1,
        loop: true,
        navigation: {
            nextEl: ".services__right-button",
            prevEl: ".services__left-button",
        },

        spaceBetween: 20,
        breakpoints: {
            0: {
                enabled: false, // disables swiper on small screens
            },
            768: {
                enabled: true, // enables swiper from tablet breakpoint
            },
        },
    });

    const testimonialSwiper = new Swiper(".swiper-testimonials", {
        modules: [Navigation],
        autoHeight: true,
        loop: true,
        navigation: {
            nextEl: ".testimonials .testimonials__right-button",
            prevEl: ".testimonials .testimonials__left-button",
        },

        breakpoints: {
            768: {
                slidesPerView: 2,
            },

            992: {
                autoHeight: false,
                slidesPerView: 1,
            },
        },

        spaceBetween: 20,
    });

    function popUp() {
        const openPopupBtn = document.getElementById("video-popup-btn");
        const closePopupBtn = document.getElementById("close-video-popup-btn");
        const popupOverlay = document.getElementById("video-popup-overlay");
        const popupContent = document.getElementById("video-popup-content");
        const videoPlayer = document.getElementById("video-player"); // The iframe

        let player; // Will hold the YouTube Player object
        let focusedElementBeforeModal;

        // Initialize YouTube Player API if it's not already loaded
        // This function is called by the YouTube IFrame Player API
        window.onYouTubeIframeAPIReady = () => {
            player = new YT.Player("video-player", {
                events: {
                    // No specific events needed for this simple pause/play,
                    // but you could add onReady, onStateChange here if needed.
                },
            });
        };

        // Load the YouTube IFrame Player API asynchronously
        function loadYouTubeAPI() {
            if (typeof YT == "undefined" || typeof YT.Player == "undefined") {
                const tag = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag =
                    document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            } else {
                // API already loaded, just create the player
                if (!player) {
                    // Ensure player is only created once
                    player = new YT.Player("video-player", {
                        events: {},
                    });
                }
            }
        }
        loadYouTubeAPI(); // Call on DOMContentLoaded

        // Get all focusable elements inside the modal
        function getFocusableElements(container) {
            return Array.from(
                container.querySelectorAll(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter(
                (el) =>
                    el.offsetWidth > 0 ||
                    el.offsetHeight > 0 ||
                    el === document.activeElement
            );
        }

        // Function to open the popup
        function openPopup() {
            focusedElementBeforeModal = document.activeElement;

            popupOverlay?.setAttribute("aria-hidden", "false");
            openPopupBtn?.setAttribute("aria-expanded", "true");

            popupOverlay?.addEventListener(
                "transitionend",
                function handler() {
                    const focusableElements =
                        getFocusableElements(popupContent);
                    if (focusableElements.length > 0) {
                        // Prioritize focusing the video player itself if it's the first focusable
                        focusableElements[0].focus();
                    } else {
                        popupContent?.focus(); // Fallback
                    }
                    popupOverlay?.removeEventListener("transitionend", handler);
                },
                { once: true }
            );
        }

        // Function to close the popup
        function closePopup() {
            popupOverlay?.setAttribute("aria-hidden", "true");
            openPopupBtn?.setAttribute("aria-expanded", "false");

            // Pause the YouTube video if the player exists
            if (player && typeof player.pauseVideo === "function") {
                player.pauseVideo();
            }

            popupOverlay?.addEventListener(
                "transitionend",
                function handler() {
                    if (focusedElementBeforeModal) {
                        focusedElementBeforeModal.focus();
                    }
                    popupOverlay?.removeEventListener("transitionend", handler);
                },
                { once: true }
            );
        }

        // Event Listeners
        openPopupBtn?.addEventListener("click", openPopup);
        closePopupBtn?.addEventListener("click", closePopup);

        // Close on overlay click
        popupOverlay?.addEventListener("click", (event) => {
            if (event.target === popupOverlay) {
                closePopup();
            }
        });

        // Close on Escape key press
        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                popupOverlay?.getAttribute("aria-hidden") === "false"
            ) {
                closePopup();
            }
        });

        // Trap focus inside the modal
        document.addEventListener("keydown", (event) => {
            if (
                popupOverlay?.getAttribute("aria-hidden") === "false" &&
                event.key === "Tab"
            ) {
                const focusableElements = getFocusableElements(popupContent);
                if (focusableElements.length === 0) {
                    event.preventDefault();
                    return;
                }

                const firstFocusable = focusableElements[0];
                const lastFocusable =
                    focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        event.preventDefault();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        event.preventDefault();
                    }
                }
            }
        });

        // Ensure the popup content itself can be focused if no other elements
        popupContent?.setAttribute("tabindex", "-1");
    }

    popUp();

    function rollingText() {
        let direction = 1; // 1 = forward, -1 = backward scroll

        const roll1 = roll(".ribbon__track .ribbon__content", {
                duration: 26,
            }),
            scroll = ScrollTrigger.create({
                onUpdate(self) {
                    if (self.direction !== direction) {
                        direction *= -1;
                        gsap.to(roll1, {
                            timeScale: direction,
                            overwrite: true,
                        });
                    }
                },
            });

        // helper function that clones the targets, places them next to the original, then animates the xPercent in a loop to make it appear to roll across the screen in a seamless loop.
        function roll(targets, vars, reverse) {
            vars = vars || {};
            vars.ease || (vars.ease = "none");
            const tl = gsap.timeline({
                    repeat: -1,
                    onReverseComplete() {
                        this.totalTime(this.rawTime() + this.duration() * 10); // otherwise when the playhead gets back to the beginning, it'd stop. So push the playhead forward 10 iterations (it could be any number)
                    },
                }),
                elements = gsap.utils.toArray(targets),
                clones = elements.map((el) => {
                    let clone = el.cloneNode(true);
                    el.parentNode.appendChild(clone);
                    return clone;
                }),
                positionClones = () =>
                    elements.forEach((el, i) =>
                        gsap.set(clones[i], {
                            position: "absolute",
                            overwrite: false,
                            left:
                                el.offsetLeft +
                                (reverse ? -el.offsetWidth : el.offsetWidth),
                        })
                    );
            positionClones();
            elements.forEach((el, i) =>
                tl.to(
                    [el, clones[i]],
                    { xPercent: reverse ? 100 : -100, ...vars },
                    0
                )
            );
            window.addEventListener("resize", () => {
                let time = tl.totalTime(); // record the current time
                tl.totalTime(0); // rewind and clear out the timeline
                positionClones(); // reposition
                tl.totalTime(time); // jump back to the proper time
            });
            return tl;
        }
    }

    function faq() {
        const items = document.querySelectorAll(".accordion-item button");
        function toggleAction(e) {
            const mainElem = e.target.closest(".accordion-item");
            const state = this.getAttribute("aria-expanded");
            if (state == "false") {
                this.setAttribute("aria-expanded", "true");
                mainElem.classList.add("active");
            } else {
                this.setAttribute("aria-expanded", "false");
                mainElem.classList.remove("active");
            }
        }

        items.forEach((item) => {
            item.addEventListener("click", toggleAction);
        });
    }

    buttonEffect();
    rollingText();
    faq();
    mobileMenu();
});
