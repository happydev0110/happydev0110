import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'carts',
  initialState: {
    items: [],
    itemcnt: 0,
    changed: 0,
  },
  reducers: {
    update(state, action) {
      state.items = action.payload
    },
    updateCount(state, action) {
      state.itemcnt = action.payload
    },
    updateChanged(state, action) {
      state.changed = action.payload
    },
  },
});

export { actions as cartsActions };
export { reducer as cartsReducer };

// export default 