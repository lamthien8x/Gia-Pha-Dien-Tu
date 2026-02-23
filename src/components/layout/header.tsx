'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function Header() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 pl-14 md:pl-4 lg:px-6">
            {/* Left side */}
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-muted-foreground truncate">
                    Dòng họ Hồ
                </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle theme"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
            </div>
        </header>
    );
}
