import "./SlideCard.css";

const SlideCard = ({ title, desc, cover, className }) => {
  return (
    <div className={`slide-box ${className}`}>
      <div className="slide-left">
        <h1>{title}</h1>
        <p>{desc}</p>
        <button className="btn-primary">Visit Collections</button>
      </div>
      <div className="slide-right">
        <img src={cover} alt="Slide" />
      </div>
    </div>
  );
};

export default SlideCard;
