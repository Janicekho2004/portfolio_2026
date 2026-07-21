const cards = Array.from(document.querySelectorAll(".phone-card"));
const dotsContainer = document.getElementById("carouselDots");
const nextButton = document.getElementById("carouselNext");
const prevButton = document.getElementById("carouselPrev");
const stage = document.getElementById("carouselStage");
const zoomPips = document.getElementById("zoomPips");
const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");

if (cards.length && dotsContainer && nextButton && prevButton && stage && zoomPips && zoomInButton && zoomOutButton) {
    const zoomSteps = [
        { width: 160, gap1: 178, gap2: 316, hiddenGap: 450, stageHeight: 420 },
        { width: 200, gap1: 222, gap2: 395, hiddenGap: 560, stageHeight: 520 },
        { width: 240, gap1: 266, gap2: 474, hiddenGap: 670, stageHeight: 620 },
        { width: 280, gap1: 310, gap2: 553, hiddenGap: 780, stageHeight: 720 },
    ];

    const positionConfig = {
        center: [0, 0, 1, 1],
        left1: [-1, 28, 0.82, 1],
        right1: [1, -28, 0.82, 1],
        left2: [-1, 45, 0.64, 0.55],
        right2: [1, -45, 0.64, 0.55],
        "hidden-left": [-1, 60, 0.48, 0],
        "hidden-right": [1, -60, 0.48, 0],
    };

    const gapByPosition = {
        center: null,
        left1: "gap1",
        right1: "gap1",
        left2: "gap2",
        right2: "gap2",
        "hidden-left": "hiddenGap",
        "hidden-right": "hiddenGap",
    };

    let currentCenter = 2;
    let zoomLevel = 2;
    let autoTimer;

    function getPosition(index) {
        let offset = index - currentCenter;

        while (offset > Math.floor(cards.length / 2)) offset -= cards.length;
        while (offset < -Math.floor(cards.length / 2)) offset += cards.length;

        if (offset === -2) return "left2";
        if (offset === -1) return "left1";
        if (offset === 0) return "center";
        if (offset === 1) return "right1";
        if (offset === 2) return "right2";

        return offset < 0 ? "hidden-left" : "hidden-right";
    }

    function applyCardStyles() {
        const zoom = zoomSteps[zoomLevel];
        stage.style.height = `${zoom.stageHeight}px`;

        cards.forEach((card, index) => {
            const position = getPosition(index);
            const config = positionConfig[position];
            const gapKey = gapByPosition[position];
            const translateX = config[0] * (gapKey ? zoom[gapKey] : 0);
            const shell = card.querySelector(".phone-shell");

            card.dataset.pos = position;
            card.style.width = `${zoom.width}px`;
            card.style.opacity = config[3];
            card.style.transform = `translateX(${translateX}px) rotateY(${config[1]}deg) scale(${config[2]})`;

            if (shell) {
                shell.style.width = `${zoom.width}px`;
            }
        });

        document.querySelectorAll(".carousel-dot").forEach((dot, index) => {
            dot.classList.toggle("active", index === currentCenter);
        });

        document.querySelectorAll(".zoom-pip").forEach((pip, index) => {
            pip.classList.toggle("active", index === zoomLevel);
        });

        zoomOutButton.disabled = zoomLevel === 0;
        zoomInButton.disabled = zoomLevel === zoomSteps.length - 1;
    }

    function goTo(index) {
        currentCenter = (index + cards.length) % cards.length;
        applyCardStyles();
    }

    function next() {
        goTo(currentCenter + 1);
    }

    function prev() {
        goTo(currentCenter - 1);
    }

    function startAuto() {
        autoTimer = setInterval(next, 3500);
    }

    function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
    }

    cards.forEach((card, index) => {
        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `View screen ${index + 1}`);
        dot.addEventListener("click", () => {
            goTo(index);
            resetAuto();
        });
        dotsContainer.appendChild(dot);

        card.addEventListener("click", () => {
            goTo(index);
            resetAuto();
        });
    });

    zoomSteps.forEach((_, index) => {
        const pip = document.createElement("button");
        pip.className = "zoom-pip";
        pip.type = "button";
        pip.setAttribute("aria-label", `Set carousel zoom ${index + 1}`);
        pip.addEventListener("click", () => {
            zoomLevel = index;
            applyCardStyles();
        });
        zoomPips.appendChild(pip);
    });

    nextButton.addEventListener("click", () => {
        next();
        resetAuto();
    });

    prevButton.addEventListener("click", () => {
        prev();
        resetAuto();
    });

    zoomInButton.addEventListener("click", () => {
        zoomLevel = Math.min(zoomSteps.length - 1, zoomLevel + 1);
        applyCardStyles();
    });

    zoomOutButton.addEventListener("click", () => {
        zoomLevel = Math.max(0, zoomLevel - 1);
        applyCardStyles();
    });

    stage.addEventListener("mouseenter", () => clearInterval(autoTimer));
    stage.addEventListener("mouseleave", startAuto);

    applyCardStyles();
    startAuto();
}
