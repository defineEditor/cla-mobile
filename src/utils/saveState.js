import store from '../redux/store.js';

const saveState = () => {
    try {
        const state = store.getState();
        const serializedState = JSON.stringify(state.present);
        localStorage.setItem('state', serializedState);
    } catch (error) {
        // ignore write errors
    }
};

export default saveState;
