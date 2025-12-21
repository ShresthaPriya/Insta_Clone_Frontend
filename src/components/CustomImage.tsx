import { useEffect, useState } from "react";
import fallbackImg from "../assets/pi.jpg";

type ImgProps = {
  imgSrc?: string | null;
  fallBack?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
};

const CustomImage = ({
  imgSrc,
  fallBack = fallbackImg,
  alt = "fallback image",
  className = "",
  onClick,
}: ImgProps) => {
  const [src, setSrc] = useState(imgSrc && imgSrc !== "" ? imgSrc : fallBack);

  const handleError = () => setSrc(fallBack);

  useEffect(() => {
    if (imgSrc && imgSrc !== "") {
      setSrc(`${imgSrc}?t=${Date.now()}`); 
    }
  }, [imgSrc]);

  return <img src={src} alt={alt} className={className} onError={handleError} onClick={onClick} />;
};

export default CustomImage;
