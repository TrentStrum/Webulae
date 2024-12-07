'use client';

import { formatDistanceToNow } from 'date-fns';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { getSupabase } from '@/src/lib/supabase';

import type { BlogPost } from '@/src/types/blog.types';

export default function ArticlePage(): JSX.Element {
	const { slug } = useParams();
	const [article, setArticle] = useState<BlogPost | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadArticle(): Promise<void> {
			try {
				if (!getSupabase()) throw new Error('Supabase client not initialized');
				const { data, error } = await getSupabase()
					.from('blog_posts')
					.select(
						`
            *,
            profiles (
              username,
              full_name
            )
          `
					)
					.eq('slug', slug)
					.single();

				if (error) throw error;
				setArticle(data);

				if (data?.id) {
					const {
						data: { session },
					} = await getSupabase().auth.getSession();
					await getSupabase()
						.from('blog_post_views')
						.insert({
							post_id: data.id,
							viewer_id: session?.user?.id || null,
						});
				}
			} catch (error) {
				console.error('Error loading article:', error);
			} finally {
				setLoading(false);
			}
		}

		if (slug) {
			loadArticle();
		}
	}, [slug]);

	if (loading) {
		return (
			<div className="container py-8">
				<div className="max-w-4xl mx-auto">
					<Card className="animate-pulse">
						<CardHeader>
							<div className="h-8 bg-muted rounded w-3/4" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="h-4 bg-muted rounded w-full" />
								<div className="h-4 bg-muted rounded w-5/6" />
								<div className="h-4 bg-muted rounded w-4/6" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!article) {
		return (
			<div className="container py-8">
				<div className="max-w-4xl mx-auto">
					<Card>
						<CardContent className="py-8 text-center text-muted-foreground">
							Article not found.
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<div className="max-w-4xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle className="text-3xl">{article.title}</CardTitle>
						<div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
							<span>By {article.profiles?.full_name || article.profiles?.username}</span>
							<span>•</span>
							<time dateTime={article.published_at || undefined}>
								{article.published_at &&
									formatDistanceToNow(new Date(article.published_at), {
										addSuffix: true,
									})}
							</time>
						</div>
					</CardHeader>
					<CardContent>
						<div className="prose prose-neutral dark:prose-invert max-w-none">
							{article.content}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
