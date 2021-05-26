import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { slideService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [slides, setSlides] = useState(null);

    useEffect(() => {
        slideService.getAll().then(x => setSlides(x));
    }, []);

    function deleteSlide(id) {
        setSlides(slides.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        slideService.delete(id).then(() => {
            setSlides(u => slides.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Slides</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Slide</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '13%' }}>Slide Name</th>
                        <th style={{ width: '13%' }}>Date Created</th>
                        <th style={{ width: '13%' }}>User Created</th>
                        <th style={{ width: '13%' }}>Date Modified</th>
                        <th style={{ width: '13%' }}>Tags (projects)</th>
                        <th style={{ width: '13%' }}>Description</th>
                        <th style={{ width: '13%' }}>Attachements</th>
                        <th style={{ width: '9%' }}></th>


                    </tr>
                </thead>
                <tbody>
                    {slides && slides.map(slide =>
                        <tr key={slide.id}>
                            <td>{slide.title}</td>
                            <td>{slide.dateCreated}</td>
                            <td>{slide.userCreated}</td>
                            <td>{slide.dateModified}</td>
                            <td>{slide.projects}</td>
                            <td>{slide.description}</td>
                            <td>{slide.attachments}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${slide.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteSlide(slide.id)} className="btn btn-sm btn-danger btn-delete-slide" disabled={slide.isDeleting}>
                                    {slide.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!slides &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {slides && !slides.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No slides To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };