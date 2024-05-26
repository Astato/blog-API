const newUserReducer = (state, action) => {
  if (action.type === "NEW_USER") {
    return {
      ...state,
      name: action.name,
      lastname: action.lastname,
      email: action.email,
      password: action.password,
    };
  } else {
    throw Error("Uknown action:" + action.type);
  }
};

export default newUserReducer;
