"use strict";

// Simple initialization
window.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Starting Shabooboo...");

    // Check for Web Speech support
    if (!("speechSynthesis" in window)) {
      console.warn("No speech synthesis available");
      // Still continue without speech
    }

    // Create app
    const app = new Shabooboo();
    window.shaboobooApp = app;

    console.log("Shabooboo ready!");

    // Keyboard shortcuts for testing
    document.addEventListener("keydown", (e) => {
      // T = Talk
      if (e.key === "t" || e.key === "T") {
        const talkBtn = document.getElementById("talk");
        if (talkBtn) talkBtn.click();
      }
      // 1-5 for buttons
      if (e.key === "1") document.getElementById("talk")?.click();
      if (e.key === "2") document.getElementById("sit")?.click();
      if (e.key === "3") document.getElementById("stand")?.click();
      if (e.key === "4") document.getElementById("walk")?.click();
      if (e.key === "5") document.getElementById("run")?.click();
    });
  } catch (error) {
    console.error("Error:", error);

    // Simple error display
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff5555;
            background: black;
            padding: 20px;
            border: 2px solid #ff5555;
            font-family: monospace;
            z-index: 10000;
        `;
    errorDiv.innerHTML = `
            <h3>Error</h3>
            <p>${error.message}</p>
            <p>Check console (F12)</p>
        `;
    document.body.appendChild(errorDiv);
  }
});
