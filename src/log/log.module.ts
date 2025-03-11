import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogService } from './log.service';
// import { LogController } from './log.controller';
import { Log } from './entities/log.entity';
import { ModulesModule } from 'src/modules/modules.module';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { ModulesService } from 'src/modules/modules.service';
import { Role } from 'src/roles/entities/roles.entity';
import { Permission } from 'src/permissions/entities/permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Log, User, Role, Permission]),
    ModulesModule,  
    forwardRef(() => UserModule),
  ],
  providers: [LogService, ModulesService],
  exports: [LogService],
})
export class LogModule {}

