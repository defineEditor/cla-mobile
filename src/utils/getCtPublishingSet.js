const getCtPublishingSet = (id) => {
    let publishingSet;
    const ctModel = id.replace(/^.*?\.(.*)\..*$/, '$1');
    if (['ADaM', 'SDTM', 'CDASH', 'SEND'].includes(ctModel)) {
        publishingSet = ctModel;
    } else if (['QS-FT', 'QS', 'COA', 'QRS', 'Protocol'].includes(ctModel)) {
        publishingSet = 'SDTM';
    } else if (['Def-XML'].includes(ctModel)) {
        publishingSet = 'DEFINE-XML';
    }
    return publishingSet;
};

export default getCtPublishingSet;
