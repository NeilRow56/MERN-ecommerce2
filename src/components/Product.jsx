import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
	const { product } = props;

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { cartItems },
	} = state;

	const addToCartHandler = async (item) => {
		const existItem = cartItems.find((x) => x._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${item._id}`);
		if (data.countInStock < quantity) {
			window.alert('Sorry. Product is out of stock');
			return;
		}
		ctxDispatch({
			type: 'CART_ADD_ITEM',
			payload: { ...item, quantity },
		});
	};

	return (
		<div
			className="flex flex-col border border-[#404040] m-4 max-w-[410px
							]"
			key={product.slug}
		>
			<Link to={`/product/${product.slug}`}>
				<img
					className="w-full max-w-[400px]"
					src={product.image}
					alt={product.name}
				/>
			</Link>
			<div className="p-4">
				<Link to={`/proroduct/${product.slug}`}>
					<p>{product.name}</p>
				</Link>
				<Rating
					rating={product.rating}
					numReviews={product.numReviews}
				/>

				<p>
					<strong> £ {product.price} </strong>
				</p>
				{product.countInStock === 0 ? (
					<button
						variant="light"
						disabled
						className="bg-blue-600 text-white rounded-md my-3 w-[150px] mx-auto p-2 border border-[#a88734]"
					>
						Out of stock
					</button>
				) : (
					<button
						onClick={() => addToCartHandler(product)}
						className="bg-[#f0c14b] rounded-md my-3 w-[150px] mx-auto p-2 border border-[#a88734]"
					>
						Add to cart
					</button>
				)}
			</div>
		</div>
	);
}
export default Product;
