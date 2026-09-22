import React from 'react';

import ProductOverviewClient from './ProductOverviewClient';
import { ProductOverviewProps } from '../products.types';


const ProductOverview = (props: ProductOverviewProps) => {
    return <ProductOverviewClient {...props} />;
};

export default ProductOverview;