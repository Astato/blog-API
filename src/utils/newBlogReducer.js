const newBlogReducer = (state, action) => {
  if (action.type === "NEW_BLOG") {
    return {
      ...state,
      creator: action.user,
      title: action.title,
      description: action.description,
      categories: action.categories,
      creatorID: action.creatorID,
      creatorName: action.creatorName,
      blog_content: action.blog_content,
    };
  } else {
    throw Error("Uknown action:" + action.type);
  }
};

export default newBlogReducer;
