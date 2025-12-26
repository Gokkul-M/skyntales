import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { slug } = useParams();

  return (
    <div>
      <h1>Product Page</h1>
      <p>Product slug: {slug}</p>
    </div>
  );
};

export default ProductPage;