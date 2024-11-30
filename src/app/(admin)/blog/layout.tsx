import { QueryProvider } from '@/src/context/QueryProvider';
import { ThemeProvider } from '@/src/contexts/theme-provider';
import { ReactNode } from 'react';

interface BlogLayoutProps {
	children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<QueryProvider>
				<div className="min-h-screen bg-background">
					<main className="flex-1">{children}</main>
				</div>
			</QueryProvider>
		</ThemeProvider>
	);
}