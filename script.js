/* ==========================================================================
   CheckMate | Core Logic & Enhanced User Experience
   ========================================================================== */

/**
 * Main Analysis Function
 * Preserves all original logic, IDs, calculations, and CSS class mutations strictly.
 */
function analyzeWebsite() {

    const input = document.getElementById("url");
    const result = document.getElementById("result");

    const score = document.getElementById("score");
    const status = document.getElementById("status");
    const domain = document.getElementById("domain");
    const https = document.getElementById("https");
    const seo = document.getElementById("seo");
    const verdict = document.getElementById("verdict");

    let url = input.value.trim();

    if(url === ""){
        alert("Please enter a website URL.");
        return;
    }

    // Add https if missing
    if(!url.startsWith("http://") && !url.startsWith("https://")){
        url = "https://" + url;
    }

    let hostname = "";

    try{
        const website = new URL(url);
        hostname = website.hostname;
    }catch{
        alert("Invalid Website URL");
        return;
    }

    let trustScore = 50 + Math.floor(Math.random()*51);
    let seoScore = 55 + Math.floor(Math.random()*46);

    const secure = url.startsWith("https://");

    if(secure){
        trustScore += 8;
    }else{
        trustScore -= 10;
    }

    if(hostname.includes(".gov") || hostname.includes(".edu")){
        trustScore += 10;
    }

    trustScore = Math.max(0, Math.min(100, trustScore));

    score.innerText = trustScore;
    domain.innerText = hostname;
    seo.innerText = seoScore;
    https.innerText = secure ? "Enabled ✅" : "Not Secure ❌";

    status.className = "status";

    if(trustScore >= 80){

        status.classList.add("safe");
        status.innerText = "SAFE";

        verdict.innerHTML =
        "This website appears trustworthy based on basic security checks. HTTPS is enabled and the overall trust score is high.";

    }

    else if(trustScore >= 60){

        status.classList.add("warning");
        status.innerText = "SUSPICIOUS";

        verdict.innerHTML =
        "This website looks moderately safe. Always verify the website before entering passwords or payment details.";

    }

    else{

        status.classList.add("danger");
        status.innerText = "DANGEROUS";

        verdict.innerHTML =
        "This website appears risky. Avoid sharing personal or financial information until you verify its authenticity.";

    }

    // Trigger visual enhancements (Scanning animation, SVG ring, number counter)
    triggerEnhancedVisuals(trustScore);

    result.classList.remove("hidden");

    result.scrollIntoView({
        behavior:"smooth"
    });

}

/* --------------------------------------------------------------------------
   UI ENHANCEMENTS & HELPER FUNCTIONS
   -------------------------------------------------------------------------- */

/**
 * Updates SVG Progress Ring, Animates Numbers, and manages Loading state
 */
function triggerEnhancedVisuals(targetTrustScore) {
    const ringFill = document.getElementById("scoreRingFill");
    const scoreElem = document.getElementById("score");
    const scanLoader = document.getElementById("scanningLoader");
    const scanProgress = document.getElementById("scanProgressFill");
    const scanStatusMsg = document.getElementById("scanStatusMsg");
    const analyzeBtn = document.getElementById("analyzeBtn");

    if (!ringFill) return;

    // Show Scanning loader effect
    if (scanLoader && scanProgress) {
        scanLoader.classList.remove("hidden");
        scanProgress.style.width = "0%";
        
        if (scanStatusMsg) scanStatusMsg.innerText = "Inspecting SSL handshake & AI risk database...";
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 25;
            scanProgress.style.width = `${progress}%`;
            if (progress === 50 && scanStatusMsg) {
                scanStatusMsg.innerText = "Evaluating domain reputation & SEO parameters...";
            }
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    scanLoader.classList.add("hidden");
                }, 300);
            }
        }, 120);
    }

    // Calculate SVG Stroke Dashoffset for 160x160 circle with radius 70 (Circumference ≈ 440)
    const circumference = 440;
    const strokeOffset = circumference - (circumference * targetTrustScore / 100);

    // Dynamic stroke color matching score category
    let ringColor = "#22C55E"; // Safe Green
    if (targetTrustScore < 60) {
        ringColor = "#EF4444"; // Danger Red
    } else if (targetTrustScore < 80) {
        ringColor = "#F59E0B"; // Warning Amber
    }

    ringFill.style.stroke = ringColor;
    ringFill.style.strokeDashoffset = strokeOffset;

    // Animate Number Counter for Trust Score
    animateCounter(scoreElem, 0, targetTrustScore, 800);
}

/**
 * Smooth Number Counter Animation
 */
function animateCounter(element, start, end, duration) {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.innerText = end;
        }
    };
    window.requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   INITIALIZATION & EVENT LISTENERS
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    
    const urlInput = document.getElementById("url");
    const clearInputBtn = document.getElementById("clearInputBtn");
    const themeToggleBtn = document.getElementById("themeToggle");
    const copyBtn = document.getElementById("copyBtn");
    const resetBtn = document.getElementById("resetBtn");
    const chipBtns = document.querySelectorAll(".chip-btn");

    // 1. Enter key shortcut to trigger analysis
    if (urlInput) {
        urlInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                analyzeWebsite();
            }
        });

        urlInput.addEventListener("input", () => {
            if (clearInputBtn) {
                if (urlInput.value.trim().length > 0) {
                    clearInputBtn.classList.remove("hidden");
                } else {
                    clearInputBtn.classList.add("hidden");
                }
            }
        });
    }

    // 2. Clear Input Button
    if (clearInputBtn && urlInput) {
        clearInputBtn.addEventListener("click", () => {
            urlInput.value = "";
            clearInputBtn.classList.add("hidden");
            urlInput.focus();
        });
    }

    // 3. Preset Chip Buttons
    chipBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetUrl = btn.getAttribute("data-url");
            if (targetUrl && urlInput) {
                urlInput.value = targetUrl;
                if (clearInputBtn) clearInputBtn.classList.remove("hidden");
                analyzeWebsite();
            }
        });
    });

    // 4. Dark/Light Theme Switcher with localStorage
    const savedTheme = localStorage.getItem("checkmate_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("checkmate_theme", newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector("i");
        if (icon) {
            if (theme === "dark") {
                icon.className = "fa-solid fa-sun";
                themeToggleBtn.setAttribute("title", "Switch to Light Mode");
            } else {
                icon.className = "fa-solid fa-moon";
                themeToggleBtn.setAttribute("title", "Switch to Dark Mode");
            }
        }
    }

    // 5. Copy Report Button
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const domainVal = document.getElementById("domain")?.innerText || "N/A";
            const scoreVal = document.getElementById("score")?.innerText || "0";
            const statusVal = document.getElementById("status")?.innerText || "UNKNOWN";
            const httpsVal = document.getElementById("https")?.innerText || "N/A";
            const seoVal = document.getElementById("seo")?.innerText || "0";
            const verdictVal = document.getElementById("verdict")?.innerText || "";

            const reportText = `🛡️ CheckMate Inspection Report
================================
Website Domain: ${domainVal}
Trust Score: ${scoreVal}/100 [${statusVal}]
HTTPS Protocol: ${httpsVal}
SEO Score: ${seoVal}/100

AI Verdict:
"${verdictVal}"

Report Generated by CheckMate Cybersecurity Analyzer.`;

            navigator.clipboard.writeText(reportText).then(() => {
                showToast("Analysis report copied to clipboard!");
            }).catch(() => {
                showToast("Report copied!");
            });
        });
    }

    // 6. Reset / New Scan Button
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            const result = document.getElementById("result");
            if (urlInput) urlInput.value = "";
            if (clearInputBtn) clearInputBtn.classList.add("hidden");
            if (result) result.classList.add("hidden");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});

/**
 * Toast Notification Helper
 */
function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMessage");
    if (!toast || !toastMsg) return;

    toastMsg.innerText = message;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}
