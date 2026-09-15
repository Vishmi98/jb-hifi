"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Award, FolderTree, GitCommit, Images, Layers, LogOut, Store, Tag } from 'lucide-react';
import Image from 'next/image';

import { handleCleanCookie } from '@/utils/cookie.util';
import { ProfileLink, SidebarProps } from '@/constants/types';


const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  const profileLinks: ProfileLink[] = [
    { id: 'categories', label: "Categories", href: '/admin/categories', icon: <FolderTree className="h-4 w-4 mr-2" /> },
    { id: 'mainCategories', label: "Main Categories", href: '/admin/mainCategories', icon: <Layers className="h-4 w-4 mr-2" /> },
    { id: 'subCategories', label: "Sub Categories", href: '/admin/subCategories', icon: <GitCommit className="h-4 w-4 mr-2" /> },
    { id: 'leafCategories', label: "Leaf Categories", href: '/admin/leafCategories', icon: <Tag className="h-4 w-4 mr-2" /> },
    { id: 'brands', label: "Brands", href: '/admin/brands', icon: <Award className="h-4 w-4 mr-2" /> },
    { id: 'stores', label: "Stores", href: '/admin/stores', icon: <Store className="h-4 w-4 mr-2" /> },
    { id: 'bannerCollection', label: "Banner Collection", href: '/admin/bannerCollection', icon: <Images className="h-4 w-4 mr-2" /> },
  ];

  const handleLogOut = () => {
    handleCleanCookie();
    window.location.href = '/sign_in';
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`h-full max-h-screen fixed top-0 left-0 w-64 bg-white shadow-md md:rounded-2xl p-5 flex flex-col justify-between gap-4 z-40
                   transform transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                   md:translate-x-0 md:static md:flex md:z-auto`}
      >
        {/* Added flex flex-col min-h-0 to wrapper to constrain the inner nav scroll */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-center gap-3 mt-5 md:mt-0 pb-4 shrink-0">
            <Image src="/logo1.png" alt="logo" width={155} height={155} />
          </div>

          {/* nav now correctly takes available space and scrolls internally */}
          <nav className="flex-1 overflow-y-auto pr-1 no-scrollbar">
            <ul className="flex flex-col gap-1">
              {profileLinks.map((link: ProfileLink) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`p-3 flex items-center gap-3 rounded-md text-slate-500 hover:bg-gray-200 hover:text-black transition-colors ${pathname === link.href ? 'bg-black text-white' : ''
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    <p className="text-sm">{link.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout Button pinned to bottom */}
        <button
          onClick={handleLogOut}
          className="shrink-0 flex items-center p-3 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="text-sm">Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;