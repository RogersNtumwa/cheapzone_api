class apiFeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          title: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryobj = { ...this.queryString };
    const excludefields = ["page", "limit", "sort", "fields", "keyword"];

    excludefields.forEach((el) => delete queryobj[el]);

    // console.log(queryobj);
    let queryStr = JSON.stringify(queryobj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // EXECUTE A QUERY
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagnation(resPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);

    
    return this;
  }
}

module.exports = apiFeatures;
