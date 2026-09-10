document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       SMOOTH ANCHOR SCROLL
    ========================= */

    const internalLinks =
        document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =========================
       REVEAL ELEMENTS
    ========================= */

    const revealSelectors = [
        ".section-head",
        ".work-card",
        ".services-intro",
        ".service-row",
        ".statement-section",
        ".process-intro",
        ".process-card",
        ".contact-top",
        ".contact-main",
        ".contact-email",
        ".footer"
    ];

    const revealItems =
        document.querySelectorAll(
            revealSelectors.join(",")
        );

 revealItems.forEach((item) => {
    item.classList.add("reveal");
});


    /* =========================
       INTERSECTION OBSERVER
    ========================= */

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target
                                .classList
                                .add("is-visible");

                            observer
                                .unobserve(entry.target);

                        }

                    });

                },

                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );

        revealItems.forEach(item => {

            observer.observe(item);

        });

    }

    else {

        revealItems.forEach(item => {

            item.classList.add(
                "is-visible"
            );

        });

    }

});