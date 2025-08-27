import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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

    function rollingText() {
        let direction = 1; // 1 = forward, -1 = backward scroll

        const roll1 = roll(".ribbon__track .ribbon__content", {
                duration: 10,
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
    }

    rollingText();
    faq();
    mobileMenu();
});
