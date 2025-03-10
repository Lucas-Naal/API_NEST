import { IsEnum, IsObject, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { ActionType } from './action-type.enum';  

export class CreateLogDto {
    @IsEnum(ActionType)  
    action_name: ActionType;

    @IsOptional()  
    @IsObject()    
    original_data: Record<string, any> | null; 

    @IsNotEmpty()  
    @IsObject()  
    updated_data: Record<string, any>; 

    @IsNumber() 
    module_id: number;

    @IsNumber() 
    usuario_id: number;
}
