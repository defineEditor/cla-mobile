import initialState from '../constants/initialState.js';

const mergeDefaults = (state, defaultState) => {
    if (state === null || state === undefined) {
        return defaultState;
    }
    const newState = { ...state };
    for (const attr in defaultState) {
        if (!!defaultState[attr] && defaultState[attr].constructor === Object) {
            newState[attr] = mergeDefaults(newState[attr], defaultState[attr]);
        } else if (state[attr] === undefined) {
            newState[attr] = defaultState[attr];
        }
    }
    return newState;
};

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return initialState;
        } else {
            const state = JSON.parse(serializedState);
            // Start with products page
            state.ui.main.page = 'products';
            return mergeDefaults(state, initialState);
        }
    } catch (err) {
        console.error('Error while loading state. ' + err.message);
        return initialState;
    }
};

export default loadState;
