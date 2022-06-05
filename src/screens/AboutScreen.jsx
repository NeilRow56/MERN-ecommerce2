import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const About = () => {
	return (
		<>
			<Header />
			<div className="w-full max-w-[1500px] mx-auto bg-green-100 ">
				<h1 className="text-3xl pt-[50px]">About us.</h1>
			</div>
			<Footer />
		</>
	);
};

export default About;
