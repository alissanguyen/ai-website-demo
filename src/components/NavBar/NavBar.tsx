/* eslint-disable @next/next/no-img-element */
'use client'
import * as React from 'react';
import { Fragment, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Logo from "../../assets/logo.png"
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserContext } from '@/contexts/UserContext';


const navigation = [
    { name: 'Dashboard', href: '/', current: true },
    { name: 'AI', href: '/ai', current: false },
    { name: 'Profile', href: '/account', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}


const NavBar: React.FC = () => {
    const { userId, fullName, avatarUrl } = React.useContext(UserContext);

    const currentRoute = usePathname();

    useEffect(() => {
        const setCurrentRoute = () => {
            navigation.forEach(item => {
                item.current = item.href === currentRoute;
            });
        };

        setCurrentRoute();
    }, [currentRoute]);

    return (
        <div>
            <Disclosure as="nav" className="NavBar absolute top-0">
                {({ open }) => (
                    <>
                        <div className="mx-auto px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden z-[200] text-blue-700">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <Image
                                            className="h-10 w-auto"
                                            src={Logo}
                                            alt="logo"
                                        />
                                    </div>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {navigation.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-slate-800 text-white'
                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                                    {/* Profile dropdown */}
                                    {userId ? (<Menu as="div" className="relative ml-3">
                                        <div className='flex flex-rows items-center gap-3'>
                                            <p className='hidden sm:flex text-white'>{fullName}</p>
                                            <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    src={avatarUrl as string}
                                                    alt="avatar"
                                                />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-center">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="/account"
                                                            className={classNames(
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm text-white/90 hover:bg-gray-800'
                                                            )}
                                                        >
                                                            Your Profile
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <form
                                                    action="/auth/signout"
                                                    method='post'
                                                >
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button className={classNames(
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm text-cyan-400 w-full hover:bg-gray-800'
                                                            )}>Sign out</button>
                                                        )}
                                                    </Menu.Item>
                                                </form>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>) : null}

                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden z-50">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? 'bg-slate-800 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    );
};

export default NavBar;