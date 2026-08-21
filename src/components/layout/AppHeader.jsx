import { Menu } from 'lucide-react';
import { MspLogo } from '../brand/MspLogo';

export function AppHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-50 bg-msp-green px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <div className="flex items-center">
          <MspLogo className="h-9 w-auto" />
        </div>
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-white transition hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}

