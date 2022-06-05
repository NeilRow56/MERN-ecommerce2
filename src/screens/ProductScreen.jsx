import React, { useContext, useEffect, useReducer } from 'react';
import Header from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, product: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

const ProductScreen = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { slug } = params;

	const [{ loading, error, product }, dispatch] = useReducer(reducer, {
		product: [],
		loading: true,
		error: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'FETCH_REQUEST' });
			try {
				const result = await axios.get(`/api/products/slug/${slug}`);
				dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
			} catch (error) {
				dispatch({ type: 'FETCH_FAIL', payload: error.message });
			}
		};
		fetchData();
	}, [slug]);

	const { state, dispatch: ctxDispatch } = useContext(Store);

	const { cart } = state;
	const addToCartHandler = async () => {
		const existItem = cart.cartItems.find((x) => x._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);
		if (data.countInStock < quantity) {
			window.alert('Sorry. Product is out of stock');
			return;
		}

		ctxDispatch({
			type: 'CART_ADD_ITEM',
			payload: { ...product, quantity },
		});

		navigate('/cart');
	};

	return loading ? (
		<div>Loading...</div>
	) : error ? (
		<div>{error}</div>
	) : (
		<>
			<Header />

			<div
				className="pt-20 max-w-[1500px] mx-auto
			"
			>
				<div className="grid grid-cols-6 md:grid-cols-9 lg:grid-cols-12  gap-4 ">
					<div className="col-span-6 bg-red-100 mx-auto">
						<img src={product.image} alt={product.name} />
					</div>
					<div className="col-span-6 md:col-span-3 ">
						<ul>
							<li className="border-b border-gray-100 pb-2">
								<Helmet>
									<title>{product.name}</title>
								</Helmet>
								<h1 className="">{product.name}</h1>
							</li>
							<li className="border-b border-gray-100 p-2">
								<Rating
									rating={product.rating}
									numReviews={product.numReviews}
								/>
							</li>
							<li className="border-b border-gray-100 p-2">
								Price : £{product.price}
							</li>
							<li className="border-b border-gray-100 p-2">
								Description:
								<p>{product.description}</p>
							</li>
						</ul>
					</div>
					<div className="col-span-6 md:col-span-3 ">
						<div className="max-w-[300px] px-8 py-4 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
							<ul>
								<li className="flex border-b border-gray-100 pb-2">
									<div className="mr-2 w-[75px]">Price:</div>
									<div> £{product.price} </div>
								</li>
								<li className="flex items-center mt-2">
									<div className="mr-2 w-[75px]">Status:</div>

									{product.countInStock > 0 ? (
										<div className="bg-green-600 text-center rounded-md text-[#ffff] w-[100px]   px-2     ">
											In Stock
										</div>
									) : (
										<div className="bg-red-600 text-center rounded-md max-w-[150px] px-2 text-[#ffff]     ">
											Unavailable
										</div>
									)}
								</li>
								{product.countInStock > 0 && (
									<div>
										<button
											onClick={addToCartHandler}
											className="bg-[#f0c14b] rounded-md my-3 w-full mx-auto p-1 border border-[#a88734]"
										>
											Add to Cart
										</button>
									</div>
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default ProductScreen;
