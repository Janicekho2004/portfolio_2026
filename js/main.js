const sections = document.querySelectorAll(".portfolio-section");

const revealSection = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
        }
    });
};

const observer = new IntersectionObserver(revealSection, {
    threshold: 0.45
});

sections.forEach((section, index) => {
    if (index === 0) {
        section.classList.add("is-visible");
    }

    observer.observe(section);
});
