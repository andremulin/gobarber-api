import { Router, request, response } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import User from '@modules/users/infra/typeorm/entities/Users';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const usersRouter = Router();
const upload = multer(uploadConfig);

class UserMap {
  public static toDomain(): User {}

  public static toPersistence(): User {}

  public static toDTO(user: User): any {
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    };
  }
}

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
        name,
        email,
        password,
    })
    return response.json(UserMap.toDTO(user));
});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
    });

    return response.json(UserMap.toDTO(user));
});

export default usersRouter;
