class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //1) Filtering
  filter() {
    //A) Filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]); //example how to exclude fields

    //B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //regular expression

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  //2) Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); //default: asc, put '-': dsc
    } else {
      //default
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  //3) Field limit
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // '-': exclude field
    }

    return this;
  }

  //4) Paging
  paginate() {
    const page = this.queryString.page * 1 || 1; //convert to number, default value
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; //ex) page 2: starts from 11

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
