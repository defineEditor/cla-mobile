const uiMain = {
    page: 'products',
    filterStringHistory: {},
};

const uiProducts = {
    recentStandards: [],
    recentCt: [],
    productType: 'standards',
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
        baseUrl: 'https://defineeditor.com:4600/api',
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
