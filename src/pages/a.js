function buttonEffect() {
    function resetMagnet(button, text) {
        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 2.5,
            ease: "elastic.out(1.2, 0.2)",
        });

        gsap.to(text, {
            x: 0,
            y: 0,
            ease: "power3.out",
        });
    }

    const buttons = document.querySelectorAll(".magnetic-button");
    buttons.forEach((button) => {
        const text = button.querySelector(".btn .btn__text");
        const buttonMagnetPower = button.dataset.strength;
        const textMagnetPower = button.dataset.strengthText;
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
        button.addEventListener("mousemove", function (e) {
            const rect = button.getBoundingClientRect();
            const offsetX = e.clientX - rect.left - rect.width / 2;
            const offsetY = e.clientY - rect.top - rect.height / 2;

            // Move button and text with GSAP
            gsap.to(button, {
                x: offsetX * 0.5 * buttonMagnetPower,
                y: offsetY * 0.5 * buttonMagnetPower,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
            });

            gsap.to(text, {
                x: offsetX * textMagnetPower * 0.5,
                y: offsetY * textMagnetPower * 0.5,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
            });
        });

        button.addEventListener("mouseleave", (e) => {
            resetMagnet(button, text);
            handleOrigin(e);
        });
    });
}
