import { createSlice } from '@reduxjs/toolkit';
import { ui as initialUi } from '../../constants/initialState.js';

export const uiMainSlice = createSlice({
    name: 'ui',
    initialState: initialUi,
    reducers: {
        changePage: (state, action) => {
            const payload = { ...action.payload };
            const newPage = payload.page;
            delete payload.page;
            state.main.page = newPage;
            state[newPage] = { ...state[newPage], ...action.payload };
            // Update recent products
            if (newPage === 'itemGroups' || newPage === 'codeLists') {
                const recentName = newPage === 'itemGroups' ? 'recentStandards' : 'recentCt';
                let recent = state.products[recentName];
                const id = action.payload.productId;
                if (!recent.includes(id)) {
                    recent.unshift(id);
                    recent = recent.slice(0, 4);
                } else {
                    recent.splice(recent.indexOf(id), 1);
                    recent.unshift(id);
                }
                state.products[recentName] = recent;
            }
            return state;
        },
        changeBack: (state) => {
            const page = state.main.page;
            const newState = { ...state, main: { ...state.main } };
            if (page !== 'products') {
                // Add dummy history, so that back button does not exit the application
                window.history.pushState({}, '');
            }
            if ((page) === 'items') {
                newState.main.page = 'itemGroups';
            } else if (page === 'codedValues') {
                newState.main.page = 'codeLists';
            } else if (page === 'itemGroups' || page === 'codeLists') {
                newState.main.page = 'products';
            } else {
                newState.main.page = 'products';
            }
            return newState;
        },
        openSnackbar: (state, action) => {
            const newState = {
                ...state,
                snackbar: {
                    type: action.payload.type,
                    message: action.payload.message,
                    props: action.payload.props || {},
                }
            };
            return newState;
        },
        closeSnackbar: (state, action) => {
            const newState = { ...state, snackbar: initialUi.snackbar };
            return newState;
        },
        openModal: (state, action) => {
            const newType = state.modal.type.slice();
            newType.push(action.payload.type);
            return {
                ...state,
                modal: {
                    type: newType,
                    props: { ...state.modal.props, [action.payload.type]: action.payload.props },
                }
            };
        },
        closeModal: (state, action) => {
            if (action.payload !== undefined && action.payload.type !== undefined) {
                let newState = { ...state.modal };
                if (newState.props[action.payload.type] !== undefined) {
                    const newProps = { ...newState.props };
                    delete newProps[action.payload.type];
                    newState = { ...newState, props: newProps };
                }
                if (newState.type.includes(action.payload.type)) {
                    const newType = newState.type.slice();
                    newType.splice(newType.indexOf(action.payload.type), 1);
                    newState = { ...newState, type: newType };
                }
                return { ...state, modal: newState };
            } else {
                return { ...state, modal: initialUi.modal };
            }
        },
        changeProductType: (state, action) => {
            return { ...state, products: { ...state.products, productType: action.payload } };
        },
    }
});

export const {
    changePage,
    changeBack,
    openSnackbar,
    closeSnackbar,
    openModal,
    closeModal,
    changeProductType,
} = uiMainSlice.actions;

export default uiMainSlice.reducer;
