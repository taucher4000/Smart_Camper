(function() {
    // --- KONFIGURATION ---
    const IDLE_TIME = 600000;      // Zeit bis zum "Ausschalten" (10 Minuten)
    const DEBOUNCE_WAIT = 500;     // Kurze Sperre nach dem Aufwachen (0.5 Sek)
    // ---------------------

    // Sicherheitschecks (Browser)
    if (!navigator.userAgent.toLowerCase().includes('x11')) return;

    let lastInteraction = Date.now();
    let isSleeping = false;
    
    // --- Scrollen global deaktivieren ---
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    window.addEventListener('wheel', e => e.preventDefault(), { passive: false });
    window.addEventListener('touchmove', e => e.preventDefault(), { passive: false });


    // Overlay-Element erstellen (Der schwarze Vorhang)
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        z-index: 999999;
        display: none;
        cursor: none;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);

    function sleep() {
        overlay.style.display = 'block';
        isSleeping = true;
        console.log("AMOLED-Schlafmodus aktiviert (HDMI aktiv)");
    }

    function wakeUp(e) {
        if (isSleeping) {
            // Verhindert den Klick auf das Dashboard unter dem Overlay
            if (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
            
            overlay.style.display = 'none';
            
            // Kurze Debounce-Phase einleiten
            setTimeout(() => {
                isSleeping = false;
                console.log("System bereit.");
            }, DEBOUNCE_WAIT);
            
            lastInteraction = Date.now();
            return false;
        }
        lastInteraction = Date.now();
    }

    // Timer zur Überprüfung der Inaktivität
    setInterval(() => {
        if (!isSleeping && (Date.now() - lastInteraction > IDLE_TIME)) {
            sleep();
        }
    }, 5000);

    // Event-Listener zum Aufwachen
    overlay.addEventListener('touchstart', wakeUp, { capture: true, passive: false });
    overlay.addEventListener('mousedown', wakeUp, { capture: true, passive: false });
    
    // Interaktion loggen, wenn das Display wach ist
    document.addEventListener('touchstart', () => { lastInteraction = Date.now(); }, true);
    document.addEventListener('mousedown', () => { lastInteraction = Date.now(); }, true);

    console.log("Instant-Wakeup Script für AMOLED geladen.");
})();
