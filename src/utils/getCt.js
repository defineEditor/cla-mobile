import Jszip from 'jszip';
import { openDB } from 'idb';
import saveCtFromCdiscLibrary from './saveCtFromCdiscLibrary.js';

const getCt = async (ctId, options) => {
    const { cdiscLibrary } = options;
    // Check if CT is in cached data
    const db = await openDB('ct-store', 1, {
        upgrade (db) {
            db.createObjectStore('controlledTerminology', {});
        },
    });

    // Search for the response in cache
    let loadedCt;
    const response = await db.get('controlledTerminology', ctId);
    if (response !== undefined) {
        const zippedData = response.data;
        const zip = new Jszip();
        await zip.loadAsync(zippedData);
        if (Object.keys(zip.files).includes('ct.json')) {
            loadedCt = JSON.parse(await zip.file('ct.json').async('string'));
        }
    } else {
        const ctProduct = await cdiscLibrary.getFullProduct(ctId);
        loadedCt = await saveCtFromCdiscLibrary(ctProduct);
        // Remove CT from the cdiscLibrary as it is not needed anymore, but uses significant memory
        ctProduct.removeContent();
    }
    if (loadedCt?.study === undefined) {
        // CT was not loaded
        return;
    }

    return loadedCt;
};

export default getCt;
