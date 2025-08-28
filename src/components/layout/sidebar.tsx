'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Home, 
  Users, 
  Settings, 
  Menu, 
  X, 
  User,
  ChevronDown,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  userRole: 'ADMIN' | 'CLIENT';
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export function Sidebar({ userRole, onLogout, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['ADMIN', 'CLIENT'],
    },
    {
      title: 'Usuários',
      href: '/users',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      title: 'Configurações',
      href: '/settings',
      icon: Settings,
      roles: ['ADMIN'],
    },
    {
      title: 'Perfil',
      href: '/profile',
      icon: User,
      roles: ['ADMIN', 'CLIENT'],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const SidebarContent = () => (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className={cn(
        "flex items-center p-4 border-b border-gray-200",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <h2 className={cn(
          "font-bold text-lg text-gray-800",
          isCollapsed ? "hidden" : "block"
        )}>
          Menu
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleCollapse(!isCollapsed)}
          className="hidden md:flex"
        >
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </Button>
      </div>

      <nav className={cn(
        "flex-1 space-y-2",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-50",
                isCollapsed ? "justify-center p-3" : "justify-start gap-3 px-3 py-2"
              )}
            >
              <Icon size={isCollapsed ? 24 : 20} />
              {!isCollapsed && (
                <span className="font-medium">{item.title}</span>
              )}
            </Link>
          );

          return isCollapsed ? (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                {linkContent}
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            linkContent
          );
        })}
      </nav>

      <div className={cn(
        "border-t border-gray-200",
        isCollapsed ? "p-2" : "p-4"
      )}>
{isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sair</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full flex items-center justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </Button>
        )}
      </div>
      </div>
    </TooltipProvider>
  );

  return (
    <>
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-300 bg-white shadow-lg",
          isCollapsed ? "w-20" : "w-64",
          "hidden md:block"
        )}
      >
        <SidebarContent />
      </aside>

      <div className="md:hidden">
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(true)}
            className="p-2"
          >
            <Menu size={20} />
          </Button>
        </div>

        {isMobileOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <aside className="fixed left-0 top-0 h-full w-64 z-50 bg-white shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-bold text-lg text-gray-800">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <X size={18} />
                </Button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </Button>
              </div>
            </aside>
          </>
        )}
      </div>
    </>
  );
}