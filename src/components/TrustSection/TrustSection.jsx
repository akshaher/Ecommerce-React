import "./TrustSection.css";

export default function TrustSection() {
  const data = [
    {
      title: "Secure Checkout",
      desc: "Advanced encrypted payments",
    },
    {
      title: "Fast Delivery",
      desc: "Free shipping on orders",
    },
    {
      title: "24/7 Support",
      desc: "Dedicated expert assistance",
    },
  ];

  return (
    <section className="trust-section">

      {data.map((item, index) => (
        <div className="trust-card" key={index}>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}

    </section>
  );
}