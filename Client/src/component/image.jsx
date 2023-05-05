import { useEffect, useState } from "react";

const Image = (props) => {
	const [imageSrc, setImageSrc] = useState("");

	useEffect(() => {
		const reader = new FileReader();
		const blob = new Blob([props.blob], { type: props.type });
		reader.readAsDataURL(blob);
		reader.onloadend = () => {
			const src = reader.result;
			setImageSrc(src);
		};
	}, [props.blob]);
	return <img src={imageSrc} alt={props.fileName} />;
};

export default Image;
