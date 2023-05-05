import { useEffect, useState } from "react";

const Image = (props) => {
	const [imageSrc, setImageSrc] = useState("");

	useEffect(() => {
		console.log(props.blob);
		const reader = new FileReader();
		const blob = new Blob([props.blob], { type: props.type });
		reader.readAsDataURL(blob);
		reader.onloadend = () => {
			const src = reader.result;
			setImageSrc(src);
		};
		console.log(imageSrc);
	}, [props.blob]);
	return <img src={imageSrc} alt={props.fileName} />;
};

export default Image;
