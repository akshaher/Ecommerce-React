import "./Categories.css";
import Apparel from  "/Apparel.avif";
import techGadget from "/techGadgets.avif";
import homeDecore from "/homeDecor.avif";
import luxuryWatch from "/luxuryWatch.avif"


export default function Categories() {

  const categories = [
    {
      title: "Apparel",
      image: Apparel,
    },
    {
      title: "Tech Gadgets",
      image: techGadget,
    },
    {
      title: "Home Decor",
      image: homeDecore,
    },
    {
      title: "Luxury Watches",
      image: luxuryWatch,
    },
  ];

  return (
    <section className="categories">

      <div className="category-header">
        <h2>Shop by Category</h2>
      </div>

      <div className="category-grid">

        {categories.map((item, index) => (
          <div className="category-card" key={index}>

            <img src={item.image} fetchPriority="high" alt={item.title} />

            <div className="category-overlay">
              <h3>{item.title}</h3>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}