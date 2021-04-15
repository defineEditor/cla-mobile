import stdCL from './stdCodeListStructure.js';

/*
 * Parse functions
 */

function parseCodeLists (codeListsRaw) {
    const codeLists = {};
    Object.values(codeListsRaw).forEach((codeListRaw) => {
        const args = {
            oid: 'CL.' + codeListRaw.conceptId + '.' + codeListRaw.submissionValue,
            name: codeListRaw.name,
            dataType: 'text',
            cdiscSubmissionValue: codeListRaw.submissionValue,
            codeListExtensible: codeListRaw.extensible ? 'Yes' : 'No',
            preferredTerm: codeListRaw.preferredTerm,
            synonyms: codeListRaw.synonyms,
        };
        // QuickParse is used when a folder with CTs is parsed, no need to parse individual codes;
        // Create an Alias
        args.alias = new stdCL.Alias({
            context: 'nci:ExtCodeID',
            name: codeListRaw.conceptId,
        });
        // CodeList type is always set to decoded
        args.codeListType = 'decoded';
        const codeList = new stdCL.StdCodeList(args);

        const itemOrder = [];
        // Parse items
        if (Array.isArray(codeListRaw.terms)) {
            codeListRaw.terms.forEach(term => {
                const itemArgs = {
                    codedValue: term.submissionValue,
                    definition: term.definition,
                    synonyms: term.synonyms,
                };
                // Create an Alias
                itemArgs.alias = new stdCL.Alias({
                    context: 'nci:ExtCodeID',
                    name: term.conceptId,
                });
                const codeListItem = new stdCL.StdCodeListItem(itemArgs);
                if (term.preferredTerm) {
                    codeListItem.addDecode(new stdCL.TranslatedText({ value: term.preferredTerm }));
                }
                itemOrder.push(codeList.addCodeListItem(codeListItem));
            });
        }

        codeList.itemOrder = itemOrder;

        // Parse descriptions
        if (codeListRaw.definition) {
            const args = {
                value: codeListRaw.definition,
            };

            codeList.addDescription(new stdCL.TranslatedText(args));
        }
        codeLists[codeList.oid] = codeList;
    });

    return codeLists;
}

function parseMetaDataVersion (ct) {
    // Parse the MetadataVersion element

    const mdv = {};
    mdv.codeLists = parseCodeLists(ct.codelists);
    // Connect NCI codes with CodeList IDs
    const nciCodeOids = {};
    Object.keys(mdv.codeLists).forEach(codeListOid => {
        nciCodeOids[mdv.codeLists[codeListOid].alias.name] = codeListOid;
    });

    const args = {
        oid: `CDISC_CT_MetaDataVersion.${ct.terminologyType}.${ct.version}`,
        name: `CDISC ${ct.terminologyType} Controlled Terminology`,
        codeLists: mdv.codeLists,
        nciCodeOids,
    };

    const metaDataVersion = new stdCL.MetaDataVersion(args);

    if (ct.description) {
        const description = new stdCL.TranslatedText({
            value: ct.description
        });
        metaDataVersion.addDescription(description);
    }

    return metaDataVersion;
}

function parseGlobalVariables (ct) {
    const args = {
        protocolName: `CDISC ${ct.terminologyType} Controlled Terminology`,
        studyDescription: `CDISC ${ct.terminologyType} Controlled Terminology, ${ct.version}`,
        studyName: `CDISC ${ct.terminologyType} Controlled Terminology`,
    };

    return new stdCL.GlobalVariables(args);
}

function parseStudy (ct) {
    const args = {
        oid: ct.id,
    };

    args.metaDataVersion = parseMetaDataVersion(ct);
    args.globalVariables = parseGlobalVariables(ct);

    return new stdCL.Study(args);
}

function parseOdm (ct) {
    const args = {
        fileOid: `CDISC_CT.${ct.terminologyType}.${ct.version}`,
        asOfDateTime: ct.version + 'T00:00:00',
        originator: 'CDISC Library',
        sourceSystem: 'NCI Thesaurus',
        sourceSystemVersion: ct.version,
        creationDateTime: new Date().toISOString(),
        fileType: 'Snapshot',
        schemaLocation: 'http://www.nci.nih.gov/EVS/CDISC ../schema/controlledterminology1-0-0.xsd',
        odmVersion: '1.3.2',
        xmlns: 'http://www.w3.org/2001/XMLSchema-instance',
        type: ct.terminologyType,
    };

    args.study = parseStudy(ct);

    return new stdCL.Odm(args);
}

function parseCdiscCodeLists (ct) {
    // Parse Study
    const ctUpdated = { ...ct };
    ctUpdated.terminologyType = ct.label.replace(/^\s*(\S+).*/, '$1');
    if (ctUpdated.terminologyType === 'PROTOCOL') {
        ctUpdated.terminologyType = 'Protocol';
    }
    const odm = parseOdm(ctUpdated);

    return odm;
}

export default parseCdiscCodeLists;
