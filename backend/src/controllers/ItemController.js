import BaseController from './BaseController.js';
import ItemRepository from '../repositories/ItemRepository.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import HTTP_STATUS from '../utils/httpStatus.js';

class ItemController extends BaseController {
  constructor() {
    super(new ItemRepository());
  }

  create = asyncHandler(async (req, res) => {
    const newItemData = { ...req.body, sellerId: req.user._id };

    const createdItem = await this.repository.create(newItemData);

    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          createdItem,
          'Item created successfully!'
        )
      );
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    const updatedItem = await this.repository.updateItem(id, userId, updates);

    res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, updatedItem, 'Item updated!'));
  });
}

export default new ItemController();
