import "./PageHero.css";

const PageHero = ({ eyebrow, title, description }) => {
  return (
    <section className="page-hero">
      <div className="page-hero-content">
        {eyebrow && <span className="page-hero-eyebrow">{eyebrow}</span>}

        <h1>{title}</h1>

        {description && <p>{description}</p>}
      </div>
    </section>
  );
};

export default PageHero;
