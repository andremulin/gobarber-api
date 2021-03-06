import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';
import User from '../infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';

interface Request{
    user_id: string;
    avatarFilename: string;
}

export class UserMap {
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

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename}: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if (!user){
            throw new AppError('Only authenticated users can change avatar.', 401);
        }

        if (user.avatar){
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if (userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
