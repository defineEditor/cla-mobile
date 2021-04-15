import { CdiscLibrary } from 'cla-wrapper';
import clone from 'clone';
import { openDB } from 'idb';
import Jszip from 'jszip';

const getRequestId = async (request) => {
    const shortenedUrl = request.url
        .replace('/root/', '/r/')
        .replace('/cdash/', '/cd/')
        .replace('/cdashig/', '/cdi/')
        .replace('/sdtm/', '/s/')
        .replace('/sdtmig/', '/si/')
        .replace('/send/', '/se/')
        .replace('/sendig/', '/sei/')
        .replace('/adam/', '/a/')
        .replace('/datasets/', '/d/')
        .replace('/domains/', '/dm/')
        .replace('/datastructures/', '/ds/')
        .replace('/classes/', '/c/')
        .replace('/variables/', '/v/')
        .replace('/fields/', '/f/')
        .replace('/varsets/', '/vs/')
        .replace('/packages/', '/p/')
        .replace('/codelists/', '/cl/')
        .replace('/terms/', '/t/')
        .replace('/scenarios/', '/s/')
        .replace(/.*?\/mdr\//, '')
    ;
    const requestOptions = JSON.stringify({ ...request.headers });
    const hash = await window.crypto.subtle.digest('SHA-1', new TextEncoder().encode(requestOptions));
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    if (request && request.headers && request.headers.Accept === 'application/json') {
        // These are standard request options, no need to add a hash code
        return shortenedUrl;
    } else {
        return shortenedUrl + hashHex;
    }
};

const claMatch = async (request) => {
    // Get an id
    const id = await getRequestId(request);

    const db = await openDB('cdiscLibrary-store', 1, {
        upgrade (db) {
            db.createObjectStore('cdiscLibrary', {});
        },
    });

    // Search for the response in cache
    const response = await db.get('cdiscLibrary', id);
    if (response !== undefined) {
        const zippedData = response.data;
        const zip = new Jszip();
        await zip.loadAsync(zippedData);
        if (Object.keys(zip.files).includes('response.json')) {
            const result = await zip.file('response.json').async('string');
            return { statusCode: 200, body: result };
        }
    }
};

const claPut = async (request, response) => {
    // Get an id
    const id = await getRequestId(request);
    // Do not put CT in cache, as it is converted to a different format and stored in another DB
    if (id.startsWith('ct/p/')) {
        return;
    }
    // Minify the response
    const data = JSON.parse(response.body);
    // Compress the data
    const zip = new Jszip();
    zip.file('response.json', JSON.stringify(data));
    const zippedData = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 7
        }
    });

    const db = await openDB('cdiscLibrary-store', 1, {
        upgrade (db) {
            db.createObjectStore('cdiscLibrary', {});
        },
    });

    // Add response to cache
    await db.put('cdiscLibrary', { date: new Date(), data: zippedData }, id);
};

export const initCdiscLibrary = (settings) => {
    const claSettings = settings;

    const options = {
        baseUrl: claSettings.baseUrl,
        cache: { match: claMatch, put: claPut },
    };
    if (claSettings.oAuth2 === true) {
        options.apiKey = claSettings.apiKey;
    } else {
        options.username = claSettings.username;
        options.password = claSettings.password;
    }
    return new CdiscLibrary(options);
};

export const updateCdiscLibrarySettings = (settingsDiff, originalSettings, cdiscLibraryContext) => {
    // Encrypt the cdiscLibrary password/apiKey
    const diff = clone(settingsDiff);
    // Enable/Disable the CDISC Library
    if (diff.enableCdiscLibrary === true) {
        const settings = { ...originalSettings, ...diff };
        cdiscLibraryContext.setCdiscLibrary(initCdiscLibrary(settings));
    } else if (diff.enableCdiscLibrary === false) {
        cdiscLibraryContext.setCdiscLibrary({});
    } else if (originalSettings.enableCdiscLibrary === true) {
        // If the credentials were changed, use the new
        const coreObject = cdiscLibraryContext.cdiscLibrary.coreObject;
        if (diff.username !== undefined) {
            coreObject.username = diff.username;
        }
        if (diff.password !== undefined) {
            coreObject.password = diff.password;
        }
        if (diff.apiKey !== undefined) {
            coreObject.apiKey = diff.apiKey;
        }
        if (diff.baseUrl !== undefined) {
            coreObject.baseUrl = diff.baseUrl;
        }
    }
    // Returns settings with encrypted password/apiKey if it was in diff
    return diff;
};

export const getProductTitle = (id) => {
    return id.replace(/\b(\S*)/g, (txt) => {
        let result = txt
            .replace(/(\w)-([a-z])/ig, '$1 $2')
            .replace(/([a-z])-(\w)/ig, '$1 $2')
            .replace(/(\d)-(?=\d)/ig, '$1.')
            .replace(/(\w)ig\b/ig, '$1-IG');
        if (txt.startsWith('adam')) {
            result = 'ADaM' + result.substring(4);
        } else {
            result = result.toUpperCase();
        }
        return result;
    });
};

export const getDecode = (object, language) => {
    if (object.decodes.length === 1) {
        return object.decodes[0].value;
    } else {
        return '';
    }
};

export const getDescription = (object, language) => {
    if (typeof object === 'object' && Array.isArray(object.descriptions)) {
        if (object.descriptions.length === 1) {
            return object.descriptions[0].value;
        } else if (object.descriptions.length > 1) {
            const filtDesc = object.descriptions.filter(description => (description.lang === language));
            if (filtDesc.length >= 1) {
                return filtDesc[0].value;
            } else {
                return '';
            }
        } else {
            return '';
        }
    }
};
