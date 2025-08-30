'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Quem Somos', href: '/quem-somos' },
  { name: 'Nossos Serviços', href: '/servicos' },
  { name: 'Blog', href: '/blog' },
  { name: 'Fale Conosco', href: '/contato' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#003366] text-white shadow-lg sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <Car className="h-8 w-8 text-white" />
            <span className="font-bold text-xl">JUNIOR Peças & Serviços</span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-white hover:text-[#1E90FF] transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button 
            asChild
            className="bg-gradient-to-r from-[#0093e9] to-[#1E90FF] hover:from-[#007acc] hover:to-[#1874CD] text-white border-0 font-semibold px-6 py-2 transition-all duration-300"
          >
            <Link href="/contato">
              Solicitar Orçamento
            </Link>
          </Button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#003366] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <Car className="h-8 w-8 text-white" />
                <span className="font-bold text-xl text-white">JUNIOR</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/20">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-[#0093e9] to-[#1E90FF] hover:from-[#007acc] hover:to-[#1874CD] text-white border-0 font-semibold"
                  >
                    <Link href="/contato" onClick={() => setMobileMenuOpen(false)}>
                      Solicitar Orçamento
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}