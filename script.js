// XLight Website - JavaScript

document.addEventListener("DOMContentLoaded", () => {
    // 页面元素进入视口时显示
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    sections.forEach((section) => {
        section.classList.add("hidden");
        observer.observe(section);
    });

    // 导航栏平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.querySelector(link.getAttribute("href"));

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // 控制台彩蛋
    console.log(
        "%cXLIGHT",
        "font-size: 30px; font-weight: bold;"
    );
    console.log(
        "Welcome to XLight's digital space."
    );
});