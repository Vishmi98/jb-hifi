import React from 'react';

import { LoaderProps } from '@/constants/types';


const Loader: React.FC<LoaderProps> = ({ h = 30 }) => {
    return (
        <div
            className="inline-block animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            style={{ height: `${h}px`, width: `${h}px` }}
            role="status"
        >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
            </span>
        </div>
    );
};

export default Loader;
