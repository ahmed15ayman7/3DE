import { useEffect } from "react";

const ApplyBlackWithMessage = (): void => {
  document.documentElement.classList.add("screenshot-detected");

  const existingMessage = document.getElementById("refresh-message");
  if (existingMessage) return;

  const messageContainer: HTMLDivElement = document.createElement("div");
  messageContainer.id = "refresh-message";
  messageContainer.style.position = "fixed";
  messageContainer.style.top = "50%";
  messageContainer.style.left = "50%";
  messageContainer.style.transform = "translate(-50%, -50%)";
  messageContainer.style.backgroundColor = "white";
  messageContainer.style.color = "black";
  messageContainer.style.padding = "20px";
  messageContainer.style.borderRadius = "8px";
  messageContainer.style.zIndex = "10000";
  messageContainer.style.textAlign = "center";
  messageContainer.style.maxWidth = "90%";
  messageContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
  messageContainer.dir = "rtl";

  messageContainer.innerHTML = `
    <p style="margin-bottom: 16px;">
      يحتوي هذا الموقع على معلومات حساسة. كإجراء أمني، لا يُسمح بأخذ لقطات شاشة أو تنفيذ أي إجراء فوق شاشة الموقع.
      هذا لحمايتك وحمايتنا من التهديدات الأمنية المحتملة. يُرجى إعادة تحميل الصفحة للمتابعة.
    </p>
    <button id="refresh-button" style="background-color: var(--color-primary-main);
    color: white; padding: 12px 24px; border: none;
    cursor: pointer; border-radius: 5px;">
      إعادة تحميل
    </button>
  `;

  document.body.appendChild(messageContainer);

  const refreshBtn = document.getElementById("refresh-button");
  refreshBtn?.addEventListener("click", () => {
    window.location.reload(); // إعادة تحميل الصفحة
  });
};

const usePersistScreenshotBlackout = () => {
  useEffect(() => {
    let isScreenshotDetected = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const isLetter = /^[a-zA-Z]$/.test(key);
      const isAllowedKey = key === "Shift" || key === "Delete";

      if (!isScreenshotDetected && !isLetter && !isAllowedKey) {
        isScreenshotDetected = true;
        // ApplyBlackWithMessage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};

export default usePersistScreenshotBlackout;
