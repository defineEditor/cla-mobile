import { createSlice } from '@reduxjs/toolkit';
import { settings as initialSettings } from '../../constants/initialState.js';

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialSettings,
    reducers: {
        updateSettings: (state, action) => {
            const newState = { ...state };
            Object.keys(action.payload).forEach(category => {
                newState[category] = {
                    ...newState[category],
                    ...action.payload[category]
                };
            });
            return newState;
        }
    }
});

export const { updateSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
