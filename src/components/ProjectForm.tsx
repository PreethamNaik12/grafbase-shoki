'use client'

import Image from "next/image";
import { FormState, SessionInterface } from "../../common.types";
import FormField from "./FormField";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import { useState } from "react";

type Props = {
    type: string;
    session: SessionInterface;
}
const ProjectForm = ({type, session}: Props) => {

    const handleformSubmit = (e: React.FormEvent) => {

    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    }

    const [isSubmitting, setisSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        image: '',
        category: '',
        liveSiteUrl: '',
        githubUrl: '',
    })

    const handleStateChange = (fieldName: string, value: string) => {
        setForm(prevState) => 
        ({...prevState, [fieldName]: value})
    }


    return (
        <form onSubmit={handleformSubmit} className="flexStart form">
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
                type = "Title"
                title = "text"
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
                type = "select"
                title = "Category"
                state = {form.category}
                filters = {categoryFilters}
                placeholder = "Select a category"
                setState = {(value) => handleStateChange('category', value)}
            />

            <div className="flexStart w-full">
                <button>Create</button>
            </div>
        </form>
    )
}

export default ProjectForm