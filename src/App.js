import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AboutScreen from './screens/AboutScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';

function App() {
	return (
		<BrowserRouter>
			<div className="">
				{/* Home */}
				<ToastContainer position="bottom-center" limit={1} />
				<Routes>
					<Route path="/product/:slug" element={<ProductScreen />} />
					<Route path="/about" element={<AboutScreen />} />

					<Route path="/cart" element={<CartScreen />} />
					<Route path="/signin" element={<SigninScreen />} />
					<Route path="/signup" element={<SignupScreen />} />
					<Route
						path="/shipping"
						element={<ShippingAddressScreen />}
					/>
					<Route path="/placeorder" element={<PlaceOrderScreen />} />
					<Route path="/payment" element={<PaymentMethodScreen />} />
					<Route path="/order/:id" element={<OrderScreen />} />
					<Route path="/" element={<HomeScreen />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
