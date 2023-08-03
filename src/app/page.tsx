import ProjectCard from "@/components/ProjectCard";
import { ProjectInterface } from "../../common.types";
import { fetchAllProjects } from "../../lib/actions"
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";

type ProjectSearch = {
  projectSearch: {
    edges: {node: ProjectInterface}[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    }
  }
}

type SearchParams = {
  category?: string;
  endcursor?: string;
}

type Props = {
  searchParams: SearchParams
}

export default async function Home({searchParams: { category, endcursor }}: Props) {
  const data = await fetchAllProjects(category, endcursor) as ProjectSearch;

  console.log(data);

  const projectsToDisplay = data?.projectSearch?.edges || [];

  if (projectsToDisplay.length === 0) {
    return  (
      <section className="flex-start flex-col paddings">
        <Categories />

        <p className="no-result-text text-center">No projects found, go create some first</p>
      </section>
    )
  }

  const pagination = data?.projectSearch?.pageInfo;

  
  return (
    <section className="flex-start flex-col paddings mb-16">
      <Categories />

      <section className="projects-grid">
        {projectsToDisplay.map(({node}: {node: ProjectInterface}) => (
          <ProjectCard 
            key={node?.id}
            id={node?.id}
            image= {node?.image}
            title={node?.title}
            name={node?.createdBy?.name}
            avatarUrl={node?.createdBy?.avatarUrl}
            userId={node?.createdBy?.id}
          />
        ))}
      </section>
      
      <LoadMore
        startCursor = {pagination.startCursor}
        endCursor = {pagination.endCursor}
        hasPreviousPage = {pagination.hasPreviousPage}
        hasNextPage = {pagination.hasNextPage}
      />
    </section>
  )
}
