import React, { Component } from "react";
import './FaceDetect.css';
const Loader = require('react-loader');
const FaceDetect = (props) =>{
    console.log(props);
	const options = {
		lines: 13,
		length: 20,
		width: 10,
		radius: 15,
		scale: 1.00,
		corners: 1,
		color: '#fafafa',
		opacity: 0.5,
		rotate: 0,
		direction: 1,
		speed: 1,
		trail: 60,
		fps: 20,
		zIndex: 2e9,
		top: '30%',
		left: '70%',
		shadow: false,
		hwaccel: false,
		position: 'absolute'
	};
    const boxes = props.box;
	const renderRect = boxes.map((box) =>{
       return(
		<div className = "bounding-boxes" style ={ {top: box.topRow, bottom: box.bottomRow, left: box.leftCol, right: box.rightCol}}></div>
	   );
	});

    return(
			<>
				<img  id="img-result" onLoad = {props.imageSize} className = "" src = {props.imgSrc}   alt =""/>
				<Loader loaded={props.isLoaded} options ={options} className="spinner">{renderRect}</Loader>
			</>		
    );
}

export default FaceDetect;