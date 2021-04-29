import { CdiscLibrary } from 'cla-wrapper';
import clone from 'clone';
import { openDB } from 'idb';
import Jszip from 'jszip';

const getRequestId = (request) => {
    const shortenedUrl = request.url
        .replace(/.*\/nciSite\//, 'nciSite/')
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
    return shortenedUrl;
};

const claMatch = async (request) => {
    // Get an id
    const id = getRequestId(request);

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
            return JSON.parse(result);
        }
    }
};

const claPut = async (request, response) => {
    // Get an id
    const id = getRequestId(request);
    // Do not put CT in cache, as it is converted to a different format and stored in another DB
    if (id.startsWith('ct/p/') || /^\/nciSite\/.*xml/.test(id)) {
        return;
    }
    const data = { headers: response.headers, statusCode: response.statusCode };
    if (data?.headers['content-type']?.includes('application/json')) {
        data.body = JSON.stringify(JSON.parse(response.body));
    } else {
        data.body = response.body;
    }
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
    const options = {
        cache: { match: claMatch, put: claPut },
        contentEncoding: 'gzip',
        ...settings,
    };
    return new CdiscLibrary(options);
};

export const updateCdiscLibrarySettings = (settingsDiff, originalSettings, cdiscLibraryContext) => {
    const diff = clone(settingsDiff);
    // If the connection options were changed, create a new CDISC Lib
    if (diff.apiKey !== undefined || diff.baseUrl !== undefined || diff.useNciSiteForCt !== undefined) {
        const settings = { ...originalSettings, ...diff };
        const newCdiscLibrary = initCdiscLibrary(settings);
        // It is required to reset contents to avoid potential conflicts
        newCdiscLibrary.reset();
        cdiscLibraryContext.setCdiscLibrary(newCdiscLibrary);
    }
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
