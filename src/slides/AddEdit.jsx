import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { slideService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    
    // form validation rules 
    // fields necessary: title, date created, created by, date modified, 
    // modified by, projects cell is related to, description, attachements/uploads
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('title is required'),
        dateCreated: Yup.date()
            .required('date created is required')
            .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'date created must be a valid date in the format YYYY-MM-DD'),
        userCreated: Yup.string()
            .required('userCreated is required'),
        dateModified: Yup.date()
            .required('date modified is required')
            .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'date created must be a valid date in the format YYYY-MM-DD'),
        projects: Yup.string()
            .required('project tags are required'),
        description: Yup.string()
            .required('description is required'),
        attachments: Yup.string()
            .required('a attachments is required')
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        resolver: yupResolver(validationSchema)
    });

    function onSubmit(data) {
        return isAddMode
            ? createSlide(data)
            : updateSlide(id, data);
    }

    function createSlide(data) {
        return slideService.create(data)
            .then(() => {
                alertService.success('Slide added', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(alertService.error);
    }

    function updateSlide(id, data) {
        return slideService.update(id, data)
            .then(() => {
                alertService.success('slide updated', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(alertService.error);
    }

    const [slide, setSlide] = useState({});

    useEffect(() => {
        if (!isAddMode) {
            // get slide and set form fields
            // fields necessary: name, date created, created by, date modified, 
            // modified by, projects cell is related to, description, attachments/uploads
            slideService.getById(id).then(slide => {
                const fields = ['title', 'dateCreated', 'userCreated', 'dateModified',
                'projects', 'description', 'attachments'];
                fields.forEach(field => setValue(field, slide[field]));
                setSlide(slide);
            });
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Add Slide' : 'Edit Slide'}</h1>

            <div className="form-row">
                <div className="form-group col">
                    <label>Title</label>
                    <input name="title" type="text" ref={register} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.title?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Date created</label>
                    <input name="dateCreated" type="text" ref={register} className={`form-control ${errors.dateCreated ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.dateCreated?.message}</div>
                </div>
                <div className="form-group col">
                    <label>userCreated</label>
                    <input name="userCreated" type="text" ref={register} className={`form-control ${errors.userCreated ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.userCreated?.message}</div>
                </div>  
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label>dateModified</label>
                    <input name="dateModified" type="text" ref={register} className={`form-control ${errors.dateModified ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.dateModified?.message}</div>
                </div>
                <div className="form-group col">
                    <label>projects</label>
                    <select  name="projects" type="text" ref={register} className={`form-control ${errors.projects ? 'is-invalid' : ''}`}>
                        <option value=""></option>
                        <option value="project 1">Project 1</option>
                        <option value="project 2">Project 2</option>
                        <option value="project 3">Project 3</option>
                    </select>
                    <div className="invalid-feedback">{errors.projects?.message}</div>
                </div>
                <div className="form-group col">
                    <label>description</label>
                    <input name="description" type="text" ref={register} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.description?.message}</div>
                </div>  
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label>attachments</label>
                    <input name="attachments" type="text" ref={register} className={`form-control ${errors.attachments ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.attachments?.message}</div>
                </div>
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}

export { AddEdit };