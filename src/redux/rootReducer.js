import { combineReducers } from 'redux';
import settings from './slices/settings.js';
import ui from './slices/ui.js';
import ct from './slices/ct.js';

const rootReducer = combineReducers({ ui, settings, ct });

export default rootReducer;
