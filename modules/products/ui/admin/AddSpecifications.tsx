// "use client"

// import React, { useState } from 'react';
// import { Plus, Trash2, X, Loader2 } from 'lucide-react';

// import { AddSpecificationModalProps, ProductSpecificationDataType } from '../../products.types';
// import { addProductSpecifications } from '../../products.service';


// export const AddSpecificationModal: React.FC<AddSpecificationModalProps> = ({
//     isOpen,
//     onClose,
//     product,
//     reloadData,
// }) => {
//     // Pre-fill existing specifications if available
//     const [specifications, setSpecifications] = useState<ProductSpecificationDataType[]>(() =>
//         product?.specifications && product.specifications.length > 0
//             ? product.specifications.map((s) => ({ name: s.name, value: s.value }))
//             : [{ name: '', value: '' }]
//     );
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [errorMsg, setErrorMsg] = useState<string | null>(null);

//     if (!isOpen || !product) return null;

//     const handleAddPair = () => {
//         setSpecifications((prev) => [...prev, { name: '', value: '' }]);
//     };

//     const handleRemovePair = (index: number) => {
//         setSpecifications((prev) => prev.filter((_, i) => i !== index));
//     };

//     const handleChange = (index: number, field: 'name' | 'value', val: string) => {
//         setSpecifications((prev) => {
//             const updated = [...prev];
//             updated[index][field] = val;
//             return updated;
//         });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setErrorMsg(null);

//         // Filter out empty rows
//         const validSpecs = specifications.filter(
//             (spec) => spec.name.trim() !== '' && spec.value.trim() !== ''
//         );

//         if (validSpecs.length === 0) {
//             setErrorMsg('Please add at least one valid specification pair.');
//             return;
//         }

//         setIsSubmitting(true);

//         try {
//             const formData = new FormData();
//             formData.append('productId', String(product.id));
//             formData.append('specifications', JSON.stringify(validSpecs));

//             const res = await addProductSpecifications(formData);

//             if (res.success) {
//                 reloadData();
//                 onClose();
//             } else {
//                 setErrorMsg(res.message || 'Failed to update specifications.');
//             }
//         } catch (err) {
//             console.error('Error adding specifications:', err);
//             setErrorMsg('An unexpected error occurred. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
//             <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3">
//                 <div className="flex justify-between items-center p-4 border-b">
//                     <h2 className="font-semibold text-lg">Add Specifications</h2>
//                     <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={onClose} />
//                 </div>

//                 {/* Body Form */}
//                 <form onSubmit={handleSubmit}>
//                     <div className='className="flex flex-col overflow-hidden"'>
//                         <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto p-4">
//                             <p className="text-xs text-gray-500 font-medium truncate max-w-[320px]">
//                                 Product: {product.title}
//                             </p>
//                             {errorMsg && (
//                                 <div className="text-xs text-red-600">
//                                     {errorMsg}
//                                 </div>
//                             )}

//                             <div className="max-h-[350px] overflow-y-auto space-y-1 pr-1">
//                                 {specifications.map((spec, index) => (
//                                     <div key={index} className="flex items-center gap-2">
//                                         <input
//                                             type="text"
//                                             placeholder="Key (e.g. Battery)"
//                                             value={spec.name}
//                                             onChange={(e) => handleChange(index, 'name', e.target.value)}
//                                             className="w-1/2 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="Value (e.g. 5000mAh)"
//                                             value={spec.value}
//                                             onChange={(e) => handleChange(index, 'value', e.target.value)}
//                                             className="w-1/2 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => handleRemovePair(index)}
//                                             disabled={specifications.length === 1}
//                                             className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:hover:text-red-500 p-1 transition-colors"
//                                             title="Remove Specification"
//                                         >
//                                             <Trash2 size={16} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                             {/* Add Dynamic Row */}
//                             <button
//                                 type="button"
//                                 onClick={handleAddPair}
//                                 className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-black hover:text-gray-700 transition-colors"
//                             >
//                                 <Plus size={14} /> Add Another Attribute
//                             </button>
//                         </div>

//                         {/* Footer Actions */}
//                         <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50">
//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg w-full cursor-pointer transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className="px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg w-full cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                             >
//                                 {isSubmitting && <Loader2 size={14} className="animate-spin" />}
//                                 Save Specifications
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };