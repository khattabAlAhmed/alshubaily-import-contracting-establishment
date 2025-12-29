import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { getHighlightedProjects } from "@/actions/projects";
import { ProjectsShowcaseContent } from "./ProjectsShowcaseContent";
import { ProjectsShowcaseSkeleton } from "./ProjectsShowcaseSkeleton";

async function ProjectsData() {
    const locale = await getLocale();
    const projects = await getHighlightedProjects(6);

    return <ProjectsShowcaseContent projects={projects} locale={locale} />;
}

export default function ProjectsShowcaseSection() {
    return (
        <section className="py-20 md:py-28 bg-background overflow-hidden" aria-label="Featured Projects">
            <Suspense fallback={<ProjectsShowcaseSkeleton />}>
                <ProjectsData />
            </Suspense>
        </section>
    );
}
