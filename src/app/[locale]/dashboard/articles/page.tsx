import { getAllArticles, getAllArticleCategories, getAllAuthors } from "@/actions/articles";
import ArticlesClient from "./client";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
    // Temporarily removing access check to debug data issue
    const [articles, categories, authors] = await Promise.all([
        getAllArticles(),
        getAllArticleCategories(),
        getAllAuthors(),
    ]);


    return <ArticlesClient articles={articles} categories={categories} authors={authors} />;
}
