const uiMain = {
    page: 'products',
    backPage: '',
    filterStringHistory: {},
    version: '',
};

const uiProducts = {
    recentStandards: [],
    recentCt: [],
    productType: 'terminology',
};

const uiItemGroups = {
    gridView: true,
    productId: '',
    label: '',
};

const uiItems = {
    itemGroupId: '',
    label: '',
    itemType: '',
};

const uiCodeLists = {
    productId: '',
    label: '',
};

const uiCodedValues = {
    codeListId: '',
    alias: '',
    label: '',
};

const uiSnackbar = {
    type: null,
    message: undefined,
    props: {},
};

const uiModal = {
    type: [],
    props: {},
};

export const ui = {
    main: uiMain,
    products: uiProducts,
    itemGroups: uiItemGroups,
    items: uiItems,
    codeLists: uiCodeLists,
    codedValues: uiCodedValues,
    snackbar: uiSnackbar,
    modal: uiModal,
};

export const settings = {
    cdiscLibrary: {
        apiKey: '',
        checkForCLUpdates: true,
        baseUrl: 'https://defineeditor.com:4600/api',
        itemGroupsGridView: true,
        itemsShowSetSubheader: false,
        useNciSiteForCt: true,
        nciSiteUrl: 'https://defineeditor.com:4600/nciSite',
    },
    controlledTerminology: {
        showLessMore: true,
    },
};

export const ct = {
};

export default {
    ui,
    settings,
    ct,
};
