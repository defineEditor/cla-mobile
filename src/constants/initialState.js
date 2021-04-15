const uiMain = {
    page: 'products',
};

const uiProducts = {
    recentStandards: [],
    recentCt: [],
    productType: 'standards',
};

const uiItemGroups = {
    gridView: true,
    productId: '',
};

const uiItems = {
    itemGroupId: '',
    itemType: '',
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
    snackbar: uiSnackbar,
    modal: uiModal,
};

export const settings = {
    cdiscLibrary: {
        apiKey: '',
        checkForCLUpdates: true,
        baseUrl: 'https://library.cdisc.org/api',
        itemGroupsGridView: true,
        itemsShowSetSubheader: false,
    },
};

export const ct = {
};

export default {
    ui,
    settings,
    ct,
};
