'use client';

import { useState } from "react";
import { Plus } from "lucide-react";

import CategoriesTable from "./CategoriesTable";
import AddCategoryModal from "./AddCategoryModal";


const Categories = () => {
    const [open, setOpen] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleReload = () => setReloadTable((prev) => !prev);

    return (
        <>
            <div className="overflow-y-auto w-full h-full scrollbar-hide">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-lg">Categories</h2>
                    <div className="flex justify-end">
                        <button
                            onClick={handleClickOpen}
                            className="flex items-center gap-2 bg-black hover:bg-black/80 cursor-pointer text-white text-sm px-3 py-1 rounded-md shadow"
                        >
                            <Plus className="w-5 h-5" />
                            Add Category
                        </button>
                        <AddCategoryModal
                            isOpen={open}
                            onClose={handleClose}
                            handleReload={handleReload}
                        />
                    </div>
                </div>
                <CategoriesTable reload={reloadTable} />
            </div>
        </>
    );
};

export default Categories;
