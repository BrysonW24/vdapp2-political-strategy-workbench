import { UserEntity } from '../../users/entities/user.entity';
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserEntity;
}
