import React, { useEffect, useReducer } from 'react';
import Header from '../components/Header';
// import data from '../utils/data';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, products: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

const HomeScreen = () => {
	// const [products, setProducts] = useState([]);

	const [{ loading, error, products }, dispatch] = useReducer(
		logger(reducer),
		{
			products: [],
			loading: true,
			error: '',
		}
	);

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'FETCH_REQUEST' });
			try {
				const result = await axios.get('/api/products');
				dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
			} catch (error) {
				dispatch({ type: 'FETCH_FAIL', payload: error.message });
			}

			// setProducts(result.data);
		};
		fetchData();
	}, []);

	return (
		<>
			<Header />
			<div className="w-full max-w-[1500px] mx-auto ">
				<Helmet>
					<title>Amazona</title>
				</Helmet>
				<h1 className="text-3xl pt-[80px] pb-5">Featured Products</h1>
				<div className=" ">
					{loading ? (
						<div>Loading...</div>
					) : error ? (
						<div>{error}</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
							{products.map((product) => (
								<div key={product.slug} className="">
									<Product product={product}></Product>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default HomeScreen;
