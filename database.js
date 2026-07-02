/*
=========================================================
 DATABASE.JS
---------------------------------------------------------
Gestor de Trimado Naval

Toda la persistencia de datos pasa por este archivo.

Características

✓ IndexedDB
✓ async / await
✓ Migración automática desde localStorage
✓ CRUD completo
✓ Preparado para futuras versiones

=========================================================
*/

const DB_NAME = "TrimadoDB";
const DB_VERSION = 1;

const STORE = "app";

/*
=========================================================
Abrir base de datos
=========================================================
*/

function openDB() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );

        request.onerror = () => reject(request.error);

        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = event => {

            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE)) {

                db.createObjectStore(STORE);

            }

        };

    });

}

/*
=========================================================
Guardar
=========================================================
*/

async function put(key, value) {

    const db = await openDB();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(
            STORE,
            "readwrite"
        );

        tx.objectStore(STORE).put(value, key);

        tx.oncomplete = () => resolve();

        tx.onerror = () => reject(tx.error);

    });

}

/*
=========================================================
Leer
=========================================================
*/

async function get(key) {

    const db = await openDB();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(
            STORE,
            "readonly"
        );

        const req = tx.objectStore(STORE).get(key);

        req.onsuccess = () => resolve(req.result);

        req.onerror = () => reject(req.error);

    });

}

/*
=========================================================
Eliminar
=========================================================
*/

async function remove(key) {

    const db = await openDB();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(
            STORE,
            "readwrite"
        );

        tx.objectStore(STORE).delete(key);

        tx.oncomplete = () => resolve();

        tx.onerror = () => reject(tx.error);

    });

}

/*
=========================================================
Inicializar estructura
=========================================================
*/

export async function initializeDatabase() {

    let data = await get("database");

    if (data) {

        return data;

    }

    data = {

        classes: ["WASZP"],

        boats: {

            WASZP: []

        },

        configs: {},

        columnsByClass: {

            WASZP: []

        }

    };

    await put(
        "database",
        data
    );

    return data;

}

/*
=========================================================
Guardar toda la base
=========================================================
*/

export async function saveDatabase(database) {

    await put(
        "database",
        database
    );

}

/*
=========================================================
Cargar
=========================================================
*/

export async function loadDatabase() {

    return await get("database");

}

/*
=========================================================
Último estado
=========================================================
*/

export async function saveLastState(state) {

    await put(
        "lastState",
        state
    );

}

export async function loadLastState() {

    return await get("lastState");

}

/*
=========================================================
Migración automática desde localStorage
=========================================================
*/

export async function migrateLocalStorage() {

    const oldDB = localStorage.getItem(
        "trimDB_v5"
    );

    if (!oldDB) {

        return;

    }

    const exists = await get("database");

    if (exists) {

        localStorage.removeItem("trimDB_v5");

        return;

    }

    try {

        const parsed = JSON.parse(oldDB);

        await put(
            "database",
            parsed
        );

        const lastState = localStorage.getItem(
            "trimLastState_v5"
        );

        if (lastState) {

            await put(
                "lastState",
                JSON.parse(lastState)
            );

        }

        localStorage.removeItem("trimDB_v5");

        localStorage.removeItem("trimLastState_v5");

        console.log(
            "Migración completada."
        );

    }

    catch (error) {

        console.error(error);

    }

}

/*
=========================================================
Reset completo
=========================================================
*/

export async function clearDatabase() {

    const db = await openDB();

    return new Promise((resolve, reject) => {

        const tx = db.transaction(
            STORE,
            "readwrite"
        );

        tx.objectStore(STORE).clear();

        tx.oncomplete = () => resolve();

        tx.onerror = () => reject(tx.error);

    });

}