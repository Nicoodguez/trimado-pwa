/*
----------------------------------------
PWA
----------------------------------------
*/

let deferredPrompt = null;

export function registerServiceWorker() {

    if (!("serviceWorker" in navigator)) {

        return;

    }

    window.addEventListener("load", async () => {

        try {

            await navigator.serviceWorker.register(
                "/service-worker.js"
            );

            console.log("Service Worker registrado");

        }

        catch (error) {

            console.error(error);

        }

    });

}

export function initInstallButton() {

    const button = document.getElementById("installBtn");

    window.addEventListener("beforeinstallprompt", event => {

        event.preventDefault();

        deferredPrompt = event;

        button.hidden = false;

    });

    button.addEventListener("click", async () => {

        if (!deferredPrompt) {

            return;

        }

        deferredPrompt.prompt();

        await deferredPrompt.userChoice;

        deferredPrompt = null;

        button.hidden = true;

    });

}