import { createSlice } from '@reduxjs/toolkit';
import { ct as initialCt } from '../../constants/initialState.js';

export const ctSlice = createSlice({
    name: 'ct',
    initialState: initialCt,
    reducers: {
        updateCt: (state, action) => {
            const { ct, productId } = action.payload;
            const newState = { [productId]: ct };
            return newState;
        }
    }
});

export const { updateCt } = ctSlice.actions;

export default ctSlice.reducer;
