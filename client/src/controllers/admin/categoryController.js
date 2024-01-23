const categoryModel = require("../../models/categoryModel");
const productModel = require('../../models/productModel');
const mongoose = require('mongoose');
/**render pages */
const NUMBER_CAT_PER_PAGE = 5;
// render categories management page
const renderCategoriesPage = async (req, res, next) => {
  try {
    let { page, sortBy, sortDir, search } = req.query;
    page = parseInt(page) || 1;
    sortBy = sortBy || "name";
    sortDir = sortDir || "asc";

    let matchedCategories = [];
    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        const category = await categoryModel.findById(search).lean();
        if (category) {
          matchedCategories.push(category);
        }
      } else {
        matchedCategories = await categoryModel
          .find({
            $or: [
              { name: new RegExp(`.*${search.toLowerCase()}.*`, "i") },
            ],
          })
          .lean();
      }
    } else {
      matchedCategories = await categoryModel
        .find()
        .sort([[sortBy, sortDir == "asc" ? 1 : -1]])
        .lean();
    }

    // get number of products of each category
    for(const category of matchedCategories) {
        const products = await productModel.find({categories: {$in: [category._id]}}).lean();
        category.numProducts = products.length;
    };

    const categories = matchedCategories.slice(
      (page - 1) * NUMBER_CAT_PER_PAGE,
      (page - 1) * NUMBER_CAT_PER_PAGE + NUMBER_CAT_PER_PAGE
    );

    const totalPage = Math.ceil(matchedCategories.length / NUMBER_CAT_PER_PAGE);

    const prevPage = page === 1 ? null : page - 1;
    const nextPage = page === totalPage ? null : page + 1;

    res.render("admin/categories/index", {
      layout: "admin/layouts/index",
      title: "Category Management",
      component: {
        name: "Categories",
        subtitle: "Categories Management",
      },
      user: req.user,
      categories,
      meta: {
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
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const renderEditPage = async(req, res, next) => {
    try {
        const { id } = req.params;
        
        const category = await categoryModel.findById(id).lean();
        if(category) {
            return res.render('admin/categories/edit-category', {layout: 'admin/layouts/index', title: 'Edit Category', component: {name: 'Categories', subtitle: `Edit category #${id}`}, category, user: req.user})
        }
        res.render('error/404'); 
    } catch(err) {
        console.log(err);
        next(err);
    }
}

// render add category page
const renderAddingPage = async (req, res) => {
    res.render('admin/categories/add-category', 
    {
        layout: 'admin/layouts/index',
        title: 'Add Category',
        component: {
            name: 'Categories',
            subtitle: 'Add new category'
        },
        user: req.user
    }
    )
}

/**apis */
// render edit page
const editCategory = async(req, res, next) => {
    try {
        const { id } = req.params;

        const { name, description } = req.body;
        
        const category = await categoryModel.findByIdAndUpdate(id, {name, description});

        if(category) {
            res.status(200).json({
                message: `Category ${id} updated successfully!`,
            })
        } else {
            res.status(404).json({
                message: `Category ${id} not found!`,
            })
        }
    } catch(err) {
        console.err;
        res.status(500).json({
            message: 'Sever internal error',
        })
    }
};

const removeCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findByIdAndDelete(id);

        if(category) {
            return res.status(200).json({
                message: `Category ${category.name}`
            })
        } else {
            return res.status(404).json({
                message: `Category ${id} not found`,
            })
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
}

// add category
const addCategory = async(req, res, next) => {
    try {
        const {name, description} = req.body;
        const category = await categoryModel.create({name, description});

        if(category) {
            return res.status(201).json({
                message: `Category ${name} created!`,
                data: {
                    _id: category._id,
                }
            });
        } else {
            return res.status(400).json({
                message: 'Created failed!',
            })
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
}

module.exports = {
    renderCategoriesPage,
    renderEditPage,
    renderAddingPage,
    editCategory,
    removeCategory,
    addCategory,
};