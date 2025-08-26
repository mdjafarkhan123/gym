import Lenis from "lenis";
document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".accordion-item button");
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

    function toggleAction(e) {
        const state = this.getAttribute("aria-expanded");
        if (state == "false") {
            this.setAttribute("aria-expanded", "true");
        } else {
            this.setAttribute("aria-expanded", "false");
        }
    }

    items.forEach((item) => {
        item.addEventListener("click", toggleAction);
    });
    mobileMenu();
});
