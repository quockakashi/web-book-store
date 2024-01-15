const productModel = require('../../models/productModel');
const categoryModel = require('../../models/categoryModel');
const reviewModel = require('../../models/reviewModel');
const toDataUri = require('../../utils/dataUri');
const cloudinary = require('../../configs/cloudinary')
const mongoose = require('mongoose');

const NUMBER_PRODUCT_PER_PAGE = 8;
const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/dsv2f6qxf/image/upload/v1702191078/book-store-system/products/709158-200_dbqhpd.png';
const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/dsv2f6qxf/image/upload/v1700707173/book-store-system/avatars/default-avatar.png';

// render index page
const renderIndexPage = async (req, res, next) => {
    try {
        let { page, sortBy, sortDir, search, catId } = req.query;
        page = parseInt(page) || 1;
        sortBy = sortBy || "name";
        sortDir = sortDir || "asc";

        const categories = await (categoryModel.find().sort({name: 1}).lean())

        let matchedProducts = [];
        if (search) {
            if (mongoose.Types.ObjectId.isValid(search)) {
                const product = await productModel.findById(search).lean();
                if (product) {
                    matchedProducts.push(product);
                }
            } else {
                matchedProducts = await productModel.find({
                    $or: [
                        { name: new RegExp(`.*${search.toLowerCase()}.*`, 'i') },
                        { publisher: new RegExp(`.*${search.toLowerCase()}.*`, 'i') }
                    ]
                }).lean();
            }
        }
        else {
            matchedProducts = await productModel
                .find()
                .sort([[sortBy, sortDir == 'asc' ? 1 : -1]])
                .lean();
        }

        if(catId) {
            matchedProducts = matchedProducts.filter(product => {
                const categories = product.categories.map(cat => cat.toString());
                return categories.includes(catId);
            })
        }

        const products = matchedProducts.slice((page - 1) * NUMBER_PRODUCT_PER_PAGE, (page - 1) * NUMBER_PRODUCT_PER_PAGE + NUMBER_PRODUCT_PER_PAGE).map(product => {
            if(product.image) {
                product.image = product.image.url;
            } else{
                product.image = 'https://res.cloudinary.com/dsv2f6qxf/image/upload/v1702191078/book-store-system/products/709158-200_dbqhpd.png';
            }
            return product;
        });
        
        // get review information
        for(const product of products) {
            const reviews = await reviewModel.find({product: product._id}).lean();
            if(reviews.length > 0) {
                let rating = 0;
                let count = 0;
                reviews.forEach(review => {
                    if(review.rating >= 1) {
                        rating += review.rating;
                        count++;
                    }
                })
                rating = (rating /count).toFixed(1);
                product.rating = rating;
                product.reviews = reviews.length;
            }

        }

        const totalPage = Math.ceil(matchedProducts.length / NUMBER_PRODUCT_PER_PAGE);

        const prevPage = page === 1 ? null : page - 1;
        const nextPage = page === totalPage ? null : page + 1;

        res.render('admin/products/index', {
            layout: 'admin/layouts/index', title: 'Product Management', user: req.user, component: { name: 'Products', subtitle: 'Product Management', }, products, categories, meta: {
                showPagination: totalPage > 1,
                page,
                totalPage,
                prevPage,
                nextPage,
                isEmpty: true,
                sortBy,
                sortDir,
                noPrev: !prevPage,
                noNext: !nextPage,
                search,
                hasSearch: !!search,
                catId,
                sort: sortBy+'-'+sortDir,
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    };
};

// render add category page
const renderAddingPage = async (req, res) => {
    try {
        const categories = await categoryModel.find().sort({name: 1}).lean();
        res.render('admin/products/add-product',
            {
                user: req.user,
                layout: 'admin/layouts/index',
                title: 'Add Product',
                component: {
                    name: 'Products',
                    subtitle: 'Add new product'
                },
                categories: categories,
            }   
        )
    } catch(err) {
        console.error(err);
        next(err);
    }
}

// render edit page
const renderEditProductPage = async(req , res, next) => {
    try {
        const { id } = req.params;
        if(id) {
            const product = await productModel.findOne({_id: id}).lean();
            if(product) {
                product.categories = product.categories.map(id => {
                    id = id.toString();
                    return id;
                });
                product.image = product.image ? product.image.url : DEFAULT_IMAGE_URL;
                if(product.publishDate) {
                    product.publishDate = product.publishDate.toISOString().slice(0, 10);
                }

                if(product.authors) {
                    product.authors = product.authors.join(', ')
                }
                const categories = (await categoryModel.find().sort({"name": 1}).lean()).map(category => {
                    category._id = category._id.toString();
                    return category;
                });

                return res.render('products/edit-product', {user: req.user, layout: 'layouts/index', title: 'Edit Product', component: {name: 'Products', subtitle: `Edit product #${id}`}, product, categories});
            }
        }
        res.render('error/404'); 
    } catch(err) {
        next(err);
    }
}

// render detail page
const renderDetailPage = async(req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id).populate('categories').lean();
        if(product) {
            if(product.authors) {
                product.authors = product.authors.join(', ');
            }
            if(product.publishDate) {
                product.publishDate = product.publishDate.toLocaleDateString('vi-VN');
            }

            if(product.image?.public_id) {
                const url = product.image.url;
                product.image = url;
            } else {
                console.log('sorry')
                product.image = DEFAULT_IMAGE_URL;
            }

            const reviews = await reviewModel.find({product: product._id}).populate('user').lean();
            console.log(reviews)
            reviews.forEach(review => {
                if(review.user.avatar?.public_id) {
                    review.user.avatar = review.user.avatar.url;
                } else {
                    review.user.avatar = DEFAULT_AVATAR_URL;
                }
            })

            if(reviews.length > 0) {
                let rating = 0;
                let count = 0;
                reviews.forEach(review => {
                    if(review.rating >= 1) {
                        rating += review.rating;
                        count++;
                    }
                })
                rating = (rating /count).toFixed(1);
                product.rating = rating;
            }
            product.reviews = reviews;
            

            return res.render('admin/products/product-detail', {
                user: req.user,
                layout: 'admin/layouts/index',
                title: 'Product Detail',
                component: {
                    name: 'Products',
                    subtitle: `Product ID #${product._id}`,
                },
                product,
            })
        }
        return res.render('errors/404')
    } catch(err) {
        console.error(err);
        next(err);
    }
}

/**APIs */
// add product
const addProduct = async (req, res, next) => {
    try {
        let {
            name,
            price,
            authors,
            publisher,
            publishDate,
            pages,
            language,
            categories,
            description,
            stock,
            preview,
        } = req.body;
        if(stock) {
            stock = parseInt(stock);
        };
        if(price) {
            price = parseFloat(price);
        }
        if(pages) {
            pages = parseInt(pages);
        }
        if(categories) {
            categories = JSON.parse(categories);
        }
        if(authors) {
            authors = JSON.parse(authors);
        }
        
        let image = req.files?.image;

        if(image) {
            image = toDataUri(image);
            const result = await cloudinary.uploader.upload(image, {
                folder: 'book-store-system/products',
            });

            image = {public_id: result.public_id, url: result.secure_url};
        }

        const product = await productModel.create({name, authors, publisher, publishDate, categories, price, language, description, pages, stock, image, preview});

        if (product) {
            return res.status(201).json({
                message: `Product ${name} created!`,
                data: {
                    _id: product._id,
                }
            });
        } else {
            return res.status(400).json({
                message: 'Created failed!',
            })
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const deleteProduct = async(req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if(!product) {
            return res.status(404).json({
                message: `Product ${id} not found!`,
            })
        }
        // delete image before delete this product
        if(product.image) {
            cloudinary.uploader.destroy(product.image.public_id);
        }

        await productModel.deleteOne({_id: id});
        res.status(200).json({
            message: `Product "${product.name}" has been deleted`,
        })
    } catch(err) {
        console.log(err);
        next(err);
    }
};

// edit product
const editProduct = async(req, res, next) => {
    try {
        const { id } = req.params;
        let {
            name,
            price,
            authors,
            publisher,
            publishDate,
            pages,
            language,
            categories,
            description,
            stock,
            preview
        } = req.body;

        // check stored product
        let product = await productModel.findById(id);
        if(!product) {
            return res.status(404).json({
                message: `product ${id} not found`,
            })
        };

        // handle received data
        if(stock) {
            stock = parseInt(stock);
        };
        if(price) {
            price = parseFloat(price);
        }
        if(pages) {
            pages = parseInt(pages);
        }
        if(categories) {
            categories = JSON.parse(categories);
        }
        if(authors) {
            authors = JSON.parse(authors);
        }
        
        let image = req.files?.image;

        if(image) {
            // remove stored image if product already has an image
            if(product.image?.public_id) {
                await cloudinary.uploader.destroy(product.image.public_id);
            }
            console.log('End')
            // covert binary file to base64
            image = toDataUri(image);
            const result = await cloudinary.uploader.upload(image, {
                folder: 'book-store-system/products',
            });
            image = {public_id: result.public_id, url: result.secure_url};
        }


        product = await productModel.findOneAndUpdate({_id: id}, {name, authors, publisher, publishDate, categories, price, language, description, pages, stock, image, preview});
        return res.status(200).json({
            message: `Product "${product.name}" updated`,
            data: {
                _id: product._id,
            }
        })
    } catch(err) {
        console.error(err);
        next(err);
    }
} 

module.exports = {
    renderIndexPage,
    renderAddingPage,
    renderEditProductPage,
    renderDetailPage,
    addProduct,
    deleteProduct,
    editProduct,
}