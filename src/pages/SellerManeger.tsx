import React, { useState } from 'react';

const SellerManeger = () => {
  const [productInfo, setProductInfo] = useState({
    images: [] as string[],
    title: '',
    category: '',
    status: 'NEW',
    description: '',
    tags: [] as string[],
    price: 0,
    includeShipping: false,
    canMeet: false,
    quantity: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('등록 데이터:', productInfo);
  };

  return <form onSubmit={handleSubmit} className="max-w-[1024px] mx-auto pb-20"></form>;
};
