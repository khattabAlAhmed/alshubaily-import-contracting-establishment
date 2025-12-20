import { redirect } from "next/navigation";
import { hasPermission } from "@/server/roles";
import { getAllProducts } from "@/actions/products";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default async function ProductDetailsPage() {
    const canView = await hasPermission("products.view");
    if (!canView) {
        redirect("/dashboard");
    }

    const products = await getAllProducts();

    return (
        <>
            <PageHeader
                titleEn="Product Details"
                titleAr="تفاصيل المنتجات"
                descriptionEn="View and manage property values for each product"
                descriptionAr="عرض وإدارة قيم الخصائص لكل منتج"
            />

            <div className="mb-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/products">
                        <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        Back
                    </Link>
                </Button>
            </div>

            {products.length === 0 ? (
                <EmptyState
                    titleEn="No products yet"
                    titleAr="لا توجد منتجات بعد"
                    descriptionEn="Create products first to add details"
                    descriptionAr="أنشئ منتجات أولاً لإضافة التفاصيل"
                    icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/dashboard/products/${product.id}/details`}
                            className="block p-4 border rounded-lg hover:border-primary transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {product.mainImage ? (
                                    <img
                                        src={product.mainImage.url}
                                        alt=""
                                        className="h-12 w-12 object-cover rounded"
                                    />
                                ) : (
                                    <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium">{product.titleEn}</h3>
                                    <p className="text-sm text-muted-foreground">{product.titleAr}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
