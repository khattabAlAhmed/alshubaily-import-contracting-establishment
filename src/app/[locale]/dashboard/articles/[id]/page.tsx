import { redirect, notFound } from "next/navigation";
import { hasPermission, isAdmin } from "@/server/roles";
import { getArticleById, getAllArticleCategories, getAllAuthors, getCurrentUserAuthor } from "@/actions/articles";
import ArticleForm from "../new/form";

type EditArticlePageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const canEdit = await hasPermission("articles.edit");
    if (!canEdit) {
        redirect("/dashboard/articles");
    }

    const { id } = await params;

    const [article, categories, authors, userIsAdmin, currentUserAuthor] = await Promise.all([
        getArticleById(id),
        getAllArticleCategories(),
        getAllAuthors(),
        isAdmin(),
        getCurrentUserAuthor(),
    ]);

    if (!article) {
        notFound();
    }

    return (
        <ArticleForm
            mode="edit"
            existingArticle={article}
            categories={categories}
            authors={authors}
            isAdmin={userIsAdmin}
            currentAuthorId={currentUserAuthor.authorId}
        />
    );
}
