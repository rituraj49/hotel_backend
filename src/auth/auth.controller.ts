import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ResponseService } from 'src/common/response.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUserDto';
import { CreateUserDto } from './dto/CreateUserDto';

@Controller({
    path: 'auth',
    version: '1'
})
export class AuthController {
    constructor(
        private authService: AuthService,
        private responseService: ResponseService
    ) {}

    @Post('/register')
    async registerUser(@Body() createUserDto: CreateUserDto) {
        try {

            const data = await this.authService.registerUser(createUserDto);
            return this.responseService.success('User registered successfully', data);
        } catch (error) {
            console.error('error:', error)
            return this.responseService.error(error?.message, error);
        }
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() loginUserDto: LoginUserDto) {
        console.log('login dto:', loginUserDto);
        try {
            const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
            if(!user) {
                return this.responseService.error('Invalid credentials');
            }

            const {access_token} = await this.authService.loginUser(user);

            return this.responseService.success('User logged in successfully', { access_token, user });
        } catch (error) {
            return this.responseService.error(error?.message, error)
        }
    }
}
