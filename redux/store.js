import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter/counterSlice';
import counterReducer from './counterSlice';
import {cartsReducer} from './cart'

// const reducer = combineReducers({
//     cart,
// });

// export { cartsActions } from './cart';


export const store = configureStore({
	reducer: {
		cart:cartsReducer,
		counter: counterReducer,
	},
});
