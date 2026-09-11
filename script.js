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
        ".contact-form",
        ".contact-email",
        ".footer"
    ];

    const revealItems =
        document.querySelectorAll(
            revealSelectors.join(",")
        );

    revealItems.forEach(item => {
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

    } else {

        revealItems.forEach(item => {

            item.classList.add(
                "is-visible"
            );

        });

    }


    /* =========================
       CONTACT FORM / FORMSPREE
    ========================= */

    const contactForm =
        document.querySelector(".contact-form");

    if (contactForm) {

        const submitButton =
            contactForm.querySelector(".contact-submit");

        const buttonText =
            submitButton
                ? submitButton.querySelector("span:first-child")
                : null;

        const originalButtonText =
            buttonText
                ? buttonText.textContent
                : "Send enquiry";


        /* =========================
           FORM STATUS MESSAGE
        ========================= */

        const formStatus =
            document.createElement("div");

        formStatus.className =
            "contact-form-status";

        formStatus.setAttribute(
            "role",
            "status"
        );

        formStatus.setAttribute(
            "aria-live",
            "polite"
        );

        formStatus.style.display =
            "none";

        contactForm.appendChild(
            formStatus
        );


        /* =========================
           FORM SUBMIT
        ========================= */

        contactForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                /* -------------------------
                   PREVENT DOUBLE SUBMIT
                ------------------------- */

                if (
                    submitButton &&
                    submitButton.disabled
                ) {
                    return;
                }


                /* -------------------------
                   HTML VALIDATION
                ------------------------- */

                if (
                    !contactForm.checkValidity()
                ) {

                    contactForm.reportValidity();

                    return;
                }


                /* -------------------------
                   SENDING STATE
                ------------------------- */

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.style.opacity =
                        "0.7";

                    submitButton.style.cursor =
                        "wait";

                }

                if (buttonText) {

                    buttonText.textContent =
                        "SENDING...";

                }

                formStatus.style.display =
                    "none";

                formStatus.textContent =
                    "";

                formStatus.classList.remove(
                    "success",
                    "error"
                );


                /* -------------------------
                   FORM DATA
                ------------------------- */

                const formData =
                    new FormData(contactForm);


                try {

                    /* =========================
                       SEND TO FORMSPREE
                    ========================= */

                    const response =
                        await fetch(
                            contactForm.action,
                            {
                                method:
                                    contactForm.method || "POST",

                                body:
                                    formData,

                                headers: {
                                    "Accept":
                                        "application/json"
                                }
                            }
                        );


                    /* =========================
                       SUCCESS
                    ========================= */

                    if (response.ok) {

                        contactForm.reset();

                        formStatus.textContent =
                            "Thank you. Your enquiry has been sent.";

                        formStatus.classList.add(
                            "success"
                        );

                        formStatus.style.display =
                            "block";

                        if (buttonText) {

                            buttonText.textContent =
                                "SENT ✓";

                        }


                        /* -------------------------
                           RESTORE BUTTON TEXT
                        ------------------------- */

                        setTimeout(() => {

                            if (buttonText) {

                                buttonText.textContent =
                                    originalButtonText;

                            }

                        }, 3500);

                    }


                    /* =========================
                       FORMSPREE ERROR
                    ========================= */

                    else {

                        let errorMessage =
                            "Something went wrong. Please try again.";

                        try {

                            const data =
                                await response.json();

                            if (
                                data &&
                                data.errors &&
                                data.errors.length
                            ) {

                                errorMessage =
                                    data.errors
                                        .map(error => error.message)
                                        .join(" ");

                            }

                        } catch (jsonError) {

                            console.error(
                                "Could not read Formspree error:",
                                jsonError
                            );

                        }


                        formStatus.textContent =
                            errorMessage;

                        formStatus.classList.add(
                            "error"
                        );

                        formStatus.style.display =
                            "block";

                        if (buttonText) {

                            buttonText.textContent =
                                "TRY AGAIN";

                        }

                    }

                }


                /* =========================
                   NETWORK ERROR
                ========================= */

                catch (error) {

                    console.error(
                        "Form submission error:",
                        error
                    );

                    formStatus.textContent =
                        "We couldn't send your enquiry. Please check your connection and try again.";

                    formStatus.classList.add(
                        "error"
                    );

                    formStatus.style.display =
                        "block";

                    if (buttonText) {

                        buttonText.textContent =
                            "TRY AGAIN";

                    }

                }


                /* =========================
                   RESTORE BUTTON
                ========================= */

                finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.style.opacity =
                            "";

                        submitButton.style.cursor =
                            "";

                    }

                }

            }
        );

    }

});
