'use client';

import { LogOut } from 'lucide-react';

import { useLogout } from '@/src/hooks/auth/useLogout';

import { LoadingButton } from '../ui/loading-states/LoadingButton';

interface LogoutButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	showIcon?: boolean;
}

export function LogoutButton({
	variant = 'ghost',
	showIcon = true,
	className,
	...props
}: LogoutButtonProps) {
	const { logout, isLoading } = useLogout();

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		logout();
	};

	return (
		<LoadingButton
			variant={variant}
			onClick={handleLogout}
			isLoading={isLoading}
			loadingText="Logging out..."
			className={className}
			{...props}
		>
			{showIcon && <LogOut className="mr-2 h-4 w-4" />}
			Log out
		</LoadingButton>
	);
}
