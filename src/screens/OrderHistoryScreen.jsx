import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils/utilsError';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, orders: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

export default function OrderHistoryScreen() {
	const { state } = useContext(Store);
	const { userInfo } = state;
	const navigate = useNavigate();

	const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
		loading: true,
		error: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'FETCH_REQUEST' });
			try {
				const { data } = await axios.get(
					`/api/orders/mine`,

					{ headers: { Authorization: `Bearer ${userInfo.token}` } }
				);
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (error) {
				dispatch({
					type: 'FETCH_FAIL',
					payload: getError(error),
				});
			}
		};
		fetchData();
	}, [userInfo]);
	return (
		<>
			<Header />

			<div className=" max-w-[1400px] pt-16  h-screen mx-auto flex flex-col  ">
				<Helmet>
					<title>Order History</title>
				</Helmet>
				<h1>Order History</h1>
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					{ error }
				) : (
					<div className="flex flex-col">
						<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
								<div className="overflow-hidden">
									<table className="min-w-full table-auto">
										<thead className="border-b">
											<tr>
												<th
													scope="col"
													className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
												>
													ID
												</th>
												<th
													scope="col"
													className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
												>
													DATE
												</th>
												<th
													scope="col"
													className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
												>
													TOTAL
												</th>
												<th
													scope="col"
													className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
												>
													PAID
												</th>
												<th
													scope="col"
													className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
												>
													DELIVERED
												</th>
												<th
													scope="col"
													className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
												>
													ACTIONS
												</th>
											</tr>
										</thead>
										<tbody>
											{orders.map((order) => (
												<tr
													className="border-b"
													key={order._id}
												>
													<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
														{order._id}
													</td>
													<td>
														{order.createdAt.substring(
															0,
															10
														)}
													</td>
													<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
														{order.totalPrice.toFixed(
															2
														)}
													</td>
													<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
														{order.isPaid
															? order.paidAt.substring(
																	0,
																	10
															  )
															: 'No'}
													</td>
													<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
														{order.isDelivered
															? order.deliveredAt.substring(
																	0,
																	10
															  )
															: 'No'}
													</td>
													<td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
														<button
															className="bg-[#f0c14b] rounded-md mt-4 w-[120px]  p-1  border border-[#a88734]  mx-auto "
															type="button"
															onClick={() => {
																navigate(
																	`/order/${order._id}`
																);
															}}
														>
															Details
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
