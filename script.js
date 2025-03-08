document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll(".page");
    const gridContainer = document.querySelector(".grid-container");

    // Initial state: Zoom to Home page (2,2)
    const initialPage = document.querySelector('.page[data-pos="2-2"]');
    zoomToPage(initialPage);

    // Add click listeners to nav links
    document.querySelectorAll(".navbar a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetPos = link.getAttribute("data-target");
            console.log("Clicked Link Target:", targetPos);
            const targetPage = document.querySelector(`.page[data-pos="${targetPos}"]`);
            console.log("Selected Page:", targetPage ? targetPage.querySelector("h1").textContent : "Not Found");
            if (targetPage) {
                zoomToPage(targetPage);
            } else {
                console.error("No page found for data-pos:", targetPos);
            }
        });
    });

    // Zoom function
    function zoomToPage(targetPage) {
        console.log("Screen Size:", { width: window.innerWidth, height: window.innerHeight });

        gsap.to(gridContainer, {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                const rect = targetPage.getBoundingClientRect();
                const gridRect = gridContainer.getBoundingClientRect();

                console.log("Target Page Rect:", { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
                console.log("Grid Container Rect:", { left: gridRect.left, top: gridRect.top, width: gridRect.width, height: gridRect.height });

                const scaleFactor = Math.min(window.innerWidth / rect.width, window.innerHeight / rect.height);
                console.log("Calculated Scale Factor:", scaleFactor);

                // Simplified and corrected centering logic
                const centerX = -(rect.left + rect.width / 2 - window.innerWidth / 2) * scaleFactor;
                const centerY = -(rect.top + rect.height / 2 - window.innerHeight / 2) * scaleFactor;
                console.log("Calculated Offsets:", { centerX, centerY });

                gsap.to(gridContainer, {
                    scale: scaleFactor,
                    x: centerX,
                    y: centerY,
                    duration: 1,
                    ease: "power2.inOut",
                    onUpdate: () => {
                        console.log("Current Transform:", gridContainer.style.transform);
                    },
                    onComplete: () => {
                        console.log("Zoom Complete for:", targetPage.querySelector("h1").textContent);
                    }
                });
            }
        });
    }

    window.addEventListener("resize", () => {
        const activePage = document.querySelector(".page.active") || initialPage;
        console.log("Window Resized - Re-zooming to:", activePage.querySelector("h1").textContent);
        zoomToPage(activePage);
    });
});