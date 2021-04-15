const getOid = (type, existingOids = [], preDefinedOid) => {
    let oid = '';
    const prefix = {
        CodeList: 'CL.',
        CodeListItem: 'NG.CI.',
        File: 'FL.',
    };
    if (preDefinedOid !== undefined && !existingOids.includes(preDefinedOid)) {
        if (preDefinedOid.startsWith(prefix[type])) {
            oid = preDefinedOid;
        } else {
            oid = prefix[type] + preDefinedOid;
        }
    } else {
    // get UUID
        let d = new Date().getTime();
        oid =
      prefix[type] +
      'xxxxxxxx-yxxx-4xxx'.replace(/[xy]/g, function (c) {
          const r = ((d + Math.random() * 16) % 16) | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    }
    // Check if the OID is not unique and regenerate it
    if (existingOids.includes(oid)) {
        return getOid(type, existingOids, preDefinedOid);
    } else {
        return oid;
    }
};

export default getOid;
