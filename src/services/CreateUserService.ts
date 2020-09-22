import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/Users';
import AppError from '../errors/AppError';


interface Request {
    name: string;
    email: string;
    password: string;
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

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User>{
        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where: {email},
        });

        if (checkUserExists){
            throw new AppError('This email already used.');
        }

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await usersRepository.save(user);

        return user;

    }

}

export default CreateUserService;
