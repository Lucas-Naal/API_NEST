import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/roles/entities/roles.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from "bcryptjs";
import { plainToInstance } from 'class-transformer';
import { AdminUserView } from './entities/admin_user_view';
import { NonAdminUserView } from './entities/non_admin_users_view';
import { ActiveUsers_View } from './entities/view_active_users';
import { MailsService } from 'src/mails/mails.service';
import * as crypto from 'crypto';
const token = crypto.randomBytes(32).toString('hex');


@Injectable()

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(AdminUserView)
    private readonly adminUserViewRepository: Repository<AdminUserView>,
    @InjectRepository(NonAdminUserView)
    private readonly nonAdminUserViewRepository: Repository <NonAdminUserView>,

    @InjectRepository(ActiveUsers_View)
    private readonly activeUserViewRepository: Repository<ActiveUsers_View>,

    @InjectRepository(Role) 
    private readonly roleRepository: Repository<Role>,

    private readonly mailService:  MailsService,

  ) { }

  async create(createUserDto: CreateUserDto): Promise<{ message: string; user: User }> {
    const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
    });

    if (existingUser) {
        throw new ConflictException('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const role = await this.roleRepository.findOne({
        where: { id: createUserDto.role },
        relations: ['permissions'], 
    });

    if (!role) {
        throw new NotFoundException(`Role ${createUserDto.role} not found`);
    }

    const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role,
        is_active: createUserDto.is_active ?? true,
    });

    await this.userRepository.save(newUser);

    const transformedUser = plainToInstance(User, newUser, {
        excludeExtraneousValues: true,
    });

    return {
        message: 'User created successfully',
        user: transformedUser,
    };
}


  async findOnlyAdmin(): Promise<AdminUserView[]> {
    const admins = await this.adminUserViewRepository.find();

    if (admins.length === 0) {
        throw new NotFoundException('No admin users found');
    }

    return admins;
}

async findOnlyNonAdmin(): Promise<NonAdminUserView[]> {
  const nonadmin = await this.nonAdminUserViewRepository.find();

  if (nonadmin.length === 0) {
      throw new NotFoundException('No admin users found');
  }

  return nonadmin;
}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({where: {email}});
    if(!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  const user = await this.findOne(id);

  if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
  }

  if(user.deleted_at) {
    throw new BadRequestException(`User with ID ${id} is deleted and cannot be updated`);
  }

  if(updateUserDto.email) {
    const existingUser = await this.userRepository.findOne({where: {email: updateUserDto.email}});
    if(existingUser && existingUser.id !== id){
      throw new ConflictException('Email is already taken');
    }
  }

  if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
  }

  Object.assign(user, updateUserDto);

  user.updated_at = new Date() as any;

  return this.userRepository.save(user);
}

async remove(ids: number | number[]): Promise<{ message: string }> {
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const users = await this.userRepository.findByIds(idsArray);

  if (users.length !== idsArray.length) {
      throw new NotFoundException('Some users not found');
  }

  await this.userRepository.update(idsArray, { deleted_at: new Date() });

  return { message: `Users with IDs ${idsArray.join(", ")} marked as deleted` };
}


  async updateStatus(
    id: number | number[], 
    updateUserDto: UpdateUserDto
  ): Promise<{ message: string; is_active: boolean }[]> {

    const ids = Array.isArray(id) ? id : [id];
  
    const updatedUsers: { message: string; is_active: boolean }[] = [];
  
    for (const userId of ids) {
      const user = await this.findOne(userId);
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      if (user.deleted_at) {
        throw new BadRequestException(`User with ID ${userId} is deleted and cannot be updated`);
      }
  
      if (updateUserDto.is_active !== undefined) {
        user.is_active = updateUserDto.is_active;
      }
  
      await this.userRepository.save(user);
  
      updatedUsers.push({
        message: 'User status updated successfully',
        is_active: user.is_active,
      });
    }
  
    return updatedUsers;
  }
  
  
  async findAll(
    startCreatedAt?: string,
    endCreatedAt?: string,
    exactCreatedAt?: string, 
    startUpdatedAt?: string,
    endUpdatedAt?: string,
    exactUpdatedAt?: string, 
    name?: string,
    role?: string,
    email?: string,
    isActive?: boolean
  ): Promise<ActiveUsers_View[]> {
    const queryBuilder = this.activeUserViewRepository.createQueryBuilder('ActiveUsers_View');
  
    if (startCreatedAt && endCreatedAt) {
      queryBuilder.andWhere(
        'DATE(ActiveUsers_View.created_at) BETWEEN :startCreatedAt AND :endCreatedAt',
        { startCreatedAt, endCreatedAt }
      );
    }
  
    if (exactCreatedAt) {
      queryBuilder.andWhere('DATE(ActiveUsers_View.created_at) = :exactCreatedAt', { exactCreatedAt });
    }
  
    if (startUpdatedAt && endUpdatedAt) {
      queryBuilder.andWhere(
        'DATE(ActiveUsers_View.updated_at) BETWEEN :startUpdatedAt AND :endUpdatedAt',
        { startUpdatedAt, endUpdatedAt }
      );
    }
  
    if (exactUpdatedAt) {
      queryBuilder.andWhere('DATE(ActiveUsers_View.updated_at) = :exactUpdatedAt', { exactUpdatedAt });
    }
  
    if (name) {
      queryBuilder.andWhere('LOWER(ActiveUsers_View.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }
  
    if (role) {
      queryBuilder.andWhere('LOWER(ActiveUsers_View.role_name) LIKE LOWER(:role)', { role: `%${role}%` });
    }
  
    if (email) {
      queryBuilder.andWhere('LOWER(ActiveUsers_View.email) LIKE LOWER(:email)', { email: `%${email}%` });
    }
  
    if (isActive !== undefined) {
      queryBuilder.andWhere('ActiveUsers_View.is_active = :isActive', { isActive });
    }
  
    return queryBuilder.orderBy('ActiveUsers_View.id', 'ASC').getMany();
  }
  


  async requestPasswordReset(email: string, host: string) {
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      throw new BadRequestException('User not found');
    }
  
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 3600000); 
    await this.userRepository.save(user);
  
    await this.mailService.sendResetPasswordEmail(email, token, host);
  
    return { message: 'Password reset link sent to email' };
  }
  
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { resetToken: token } });
  
    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }
    
  
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await this.userRepository.save(user);
  
    return { message: 'Password reset successfully' };
  }
  



}
