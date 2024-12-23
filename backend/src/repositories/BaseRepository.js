class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    return this.model.find({});
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async findByIdWithPassword(id) {
    return this.model.findById(id).select('+password');
  }

  async findByEmail(email) {
    return this.model.findOne({ email });
  }

  async findByEmailWithPassword(email) {
    return this.model.findOne({ email }).select('+password');
  }

  async create(data) {
    return this.model.create(data);
  }

  async updateById(id, updateData) {
    return this.model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}

export default BaseRepository;
