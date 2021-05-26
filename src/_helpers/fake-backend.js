import { Role } from './'

export function configureFakeBackend() {
    // array in local storage for slide records
    let slides = JSON.parse(localStorage.getItem('slides')) || [{ 
        id: 1,
        title: 'slide 1',
        dateCreated: '2020/01/01',
        userCreated: 'Mark',
        dateModified: '2020/02/01',
        projects: 'Project 1',
        description: 'Description for slide 1',
        attachments: 'A text box, holding place for attachments'
    }];

    // monkey patch fetch to setup fake backend
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                const { method } = opts;
                switch (true) {
                    case url.endsWith('/slides') && method === 'GET':
                        return getSlides();
                    case url.match(/\/slides\/\d+$/) && method === 'GET':
                        return getSlideById();
                    case url.endsWith('/slides') && method === 'POST':
                        return createSlide();
                    case url.match(/\/slides\/\d+$/) && method === 'PUT':
                        return updateSlide();
                    case url.match(/\/slides\/\d+$/) && method === 'DELETE':
                        return deleteSlide();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function getSlides() {
                return ok(slides);
            }

            function getSlideById() {
                let slide = slides.find(x => x.id === idFromUrl());
                return ok(slide);
            }
    
            function createSlide() {
                const slide = body();

                if (slides.find(x => x.title === slide.title)) {
                    return error(`Slide with the title ${slide.title} already exists`);
                }

                // assign slide id and a few other properties then save
                slide.id = newSlideId();
                slide.dateCreated = new Date().toISOString();
                slides.push(slide);
                localStorage.setItem('slides', JSON.stringify(slides));

                return ok();
            }
    
            function updateSlide() {
                let params = body();
                let slide = slides.find(x => x.id === idFromUrl());

                // update and save slide
                Object.assign(slide, params);
                localStorage.setItem('slides', JSON.stringify(slides));

                return ok();
            }
    
            function deleteSlide() {
                slides = slides.filter(x => x.id !== idFromUrl());
                localStorage.setItem('slides', JSON.stringify(slides));

                return ok();
            }
    
            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) });
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function body() {
                return opts.body && JSON.parse(opts.body);    
            }

            function newSlideId() {
                return slides.length ? Math.max(...slides.map(x => x.id)) + 1 : 1;
            }
        });
    }
};