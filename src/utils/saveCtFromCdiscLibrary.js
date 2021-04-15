import Jszip from 'jszip';
import parseCdiscCodeLists from './parseCdiscCodelists.js';
import getCtPublishingSet from './getCtPublishingSet.js';
import { openDB } from 'idb';

const saveCtFromCdiscLibrary = async (controlledTerminology) => {
    let stdCodeList = {};

    try {
        const stdCodeListOdmRaw = JSON.stringify(parseCdiscCodeLists(controlledTerminology));
        const stdCodeListOdm = JSON.parse(stdCodeListOdmRaw);

        const zip = new Jszip();
        zip.file('ct.json', stdCodeListOdmRaw);
        const zippedData = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 7
            }
        });

        const db = await openDB('ct-store', 1, {
            upgrade (db) {
                db.createObjectStore('controlledTerminology', {});
            },
        });

        const id = controlledTerminology.id;

        let terminologyType = controlledTerminology.label.replace(/^\s*(\S+).*/, '$1');
        if (terminologyType === 'PROTOCOL') {
            terminologyType = 'Protocol';
        }
        stdCodeList = {
            id,
            version: stdCodeListOdm.sourceSystemVersion,
            name: stdCodeListOdm.study.globalVariables.studyName,
            codeListCount: Object.keys(stdCodeListOdm.study.metaDataVersion.codeLists).length,
            isCdiscNci: stdCodeListOdm.sourceSystem === 'NCI Thesaurus',
            publishingSet: stdCodeListOdm.sourceSystem === 'NCI Thesaurus' ? getCtPublishingSet(id) : undefined,
            type: terminologyType,
            data: zippedData
        };

        // Add response to cache
        await db.put('controlledTerminology', stdCodeList, id);
        return stdCodeListOdm;
    } catch (error) {
        console.log(error);
    }
};

export default saveCtFromCdiscLibrary;
