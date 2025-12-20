import { redirect } from "next/navigation";
import { hasPermission, isAdmin } from "@/server/roles";
import { getAllArticleCategories, getAllAuthors, getCurrentUserAuthor } from "@/actions/articles";
import ArticleForm from "./form";

export default async function NewArticlePage() {
    const canCreate = await hasPermission("articles.create");
    if (!canCreate) {
        redirect("/dashboard/articles");
    }

    const [categories, authors, userIsAdmin, currentUserAuthor] = await Promise.all([
        getAllArticleCategories(),
        getAllAuthors(),
        isAdmin(),
        getCurrentUserAuthor(),
    ]);

    return (
        <ArticleForm
            mode="create"
            categories={categories}
            authors={authors}
            isAdmin={userIsAdmin}
            currentAuthorId={currentUserAuthor.authorId}
        />
    );
}
