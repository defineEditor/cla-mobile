import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import rootReducer from './rootReducer.js';
import loadState from '../utils/loadState.js';

export default configureStore({
    reducer: undoable(rootReducer),
    preloadedState: loadState(),
});
