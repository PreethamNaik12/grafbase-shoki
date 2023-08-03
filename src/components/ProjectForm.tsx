'use client'

import Image from "next/image";
import { FormState, SessionInterface } from "../../common.types";
import FormField from "./FormField";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import { useState } from "react";
import Button from "./Button";
import { createNewProject, editProject, fetchToken } from "../../lib/actions";
import { useRouter } from "next/navigation";
import { ProjectInterface } from "../../common.types";

type Props = {
    type: string;
    session: SessionInterface;
    project?: ProjectInterface;
}
const ProjectForm = ({type, session, project}: Props) => {

    const router = useRouter();

    const handleformSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        //getting the token
        const { token } = await fetchToken();
        
        try {
            //creating a new project
            if (type === 'create') {
                await createNewProject(form, session?.user?.id, token);

                router.push('/');
            }
            
            if (type === 'edit') {
                //editing an existing project
                await editProject(form, project?.id as string, token);
                
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files?.[0]//select the first file from the array of files

        if (!file) return; //if no file is selected, return

        if(!file.type.includes('image')) {
            return alert('Please select an image file');
        } //if file is not an image, return

        const reader = new FileReader(); //create a new file reader

        reader.readAsDataURL(file); //read the file as a data url

        reader.onload = () => {
            const result = reader.result as string; //get the result, which is a base64 encoded string

            handleStateChange('image', result);
        }

    }

    
    const handleStateChange = (fieldName: string, value: string) => {
        setForm((prevState) => 
        ({...prevState, [fieldName]: value}))
    }
    

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: project?.title ||  '',
        description: project?.description ||  '',
        image: project?.image ||  '',
        category: project?.category ||  '',
        liveSiteUrl: project?.liveSiteUrl ||  '',
        githubUrl: project?.githubUrl ||  '',
    });



    return (
        <form 
            onSubmit={handleformSubmit} 
            className="flexStart form"
        >
            <div className="flexStart form_image-container">
                <label htmlFor="poster" className="flexCenter form_image-label">
                    {!form.image && 'Choose a poster for your project'}
                </label>
                <input 
                    type="file"
                    id = 'image'
                    accept="image/*"
                    required = {type === 'create'}
                    onChange={handleImageChange}
                    className="form_image-input"
                />
                {form.image && (
                    <Image 
                        src={form?.image}
                        className="sm:p-10 object-contain z-20"
                        fill
                        alt="Project poster"
                    />
                )}
            </div>
            <FormField 
                title = "Title"
                type = "text"
                state = {form.title} 
                placeholder = "Enter a title for your project"
                setState = {(value) => handleStateChange('title', value)}
            />
            <FormField 
                type = "text"
                title = "Description"
                state = {form.description} 
                placeholder = "Showcase and discover remarkable developer projects"
                setState = {(value) => handleStateChange('description', value)}
            />
            <FormField 
                type = "url"
                title = "Website URL"
                state = {form.liveSiteUrl} 
                placeholder = "https://example.com"
                setState = {(value) => handleStateChange('liveSiteUrl', value)}
            />
            <FormField 
                type = "url"
                title = "Github URL"
                state = {form.githubUrl} 
                placeholder = "https://github.com/username/project"
                setState = {(value) => handleStateChange('githubUrl', value)}
            />

            <CustomMenu 
                title = "Category"
                state = {form.category}
                filters = {categoryFilters}
                setState = {(value) => handleStateChange('category', value)}
            />

            <div className="flexStart w-full">
                <Button 
                    title = {
                        isSubmitting 
                        ? `${type === 'create' 
                            ? 'Creating' : 'Updating'} project...` 
                        : `${type === 'create' 
                            ? 'Create' : 'Update'} project`
                    }
                    type = 'submit'
                    leftIcon = {isSubmitting ?
                    "" : '/plus.svg'}
                    isSubmitting = 
                    {isSubmitting}
                />
            </div>
        </form>
    )
}

export default ProjectForm