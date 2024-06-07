import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserDoc } from 'src/users/model/user.model';
import { AuthService } from '../service/auth.service';
import { LoginDto, RefreshAccessTokenDto } from '../dto/auth.dto';
import {
  createUserValidator,
  loginValidator,
  refreshAccessTokenValdator,
} from '../validator/auth.validator';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Response } from 'express';
import { UserService } from 'src/users/service/user.service';
import { Public } from 'src/utils/decorators/routePrivacy.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateWalletDto } from 'src/wallet/dto/wallet.dto';
import { EventEnum } from 'src/utils/enums/event.enum';
import { TokenService } from 'src/app/token/service/token.service';
import { ApiResponse } from 'src/utils/common/interface/apiResponse.interface';
import { ObjectValidationPipe } from 'src/utils/pipes/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService:  TokenService,
    private readonly userService:  UserService,
    private readonly evenEmitter: EventEmitter2,
  ) { }
  @Get('google-signin')
  @Public()
  async googleAuth(@Res() res:  Response) {
    // Redirect user to Google OAuth consent screen
    const redirectUrl = process.env.GOOGLE_REDIRECT_URL;
    return res.redirect(redirectUrl);
  }
  @Public()
  @Get('google-redirect')
  async googleAuthRedirect(@Query('code') code: string, @Res() res: Response) {
    const user = await this.authService.authenticateWithGoogle(code);
    const tokenData = this.tokenService.generateTokenData(user);
    const authToken = await this.tokenService.tokenize({
      data: tokenData,
    });
    const refreshToken = await this.tokenService.refreshToken({
      id: user.id,
    });
    const createWalletPayload: CreateWalletDto = {
      user: user.id,
    };
    this.evenEmitter.emit(EventEnum.CreateUserWalletEvent, createWalletPayload);
    //update user refreshtoken
    await this.userService.updateRefreshToken(user.id, refreshToken);
    res.send({
      user,
      authToken,
      refreshToken,
    });
  }
  @Post('sign-up')
  // @Public()
  async createUser(
    @Body(new ObjectValidationPipe(createUserValidator))
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserDoc>> {
    const response = await this.authService.userSignUp(createUserDto);
    const createWalletPayload: CreateWalletDto = {
      user: response.data.id,
    };
    this.evenEmitter.emit(EventEnum.CreateUserWalletEvent, createWalletPayload);
    return response;
  }

  @Post('sign-in')
  @Public()
  async signIn(
    @Body(new ObjectValidationPipe(loginValidator))
    loginDto: LoginDto,
  ): Promise<ApiResponse> {
    const user = await this.authService.userSignIn(loginDto);
    const tokenData = this.tokenService.generateTokenData(user);
    const authToken = await this.tokenService.tokenize({
      data: tokenData,
    });
    const refreshToken = await this.tokenService.refreshToken({ id: user.id });
    //update user refreshtoken
    await this.userService.updateRefreshToken(user.id, refreshToken);
    return {
      status: 'success',
      data: {
        user,
        authToken,
        refreshToken,
      },
    };
  }
  @Get('facebook/signin')
  @Public()
  async facebookSignup(@Res() res) {
    const redirectUrl = process.env.FACEBOOK_REDIRECT_URL;
    return res.redirect(redirectUrl);
  }
  @Get('facebook/redirect')
  @Public()
  async facebookAuthRedirect(@Query('code') code: string, @Res() res) {
    try {
      const user = await this.authService.authenticateWithFacebook(code);
      const tokenData = this.tokenService.generateTokenData(user);
      const authToken = await this.tokenService.tokenize({
        data: tokenData,
      });
      const refreshToken = await this.tokenService.refreshToken({
        id: user.id,
      });
      await this.userService.updateRefreshToken(user.id, refreshToken);
      res.send({
        user,
        authToken,
        refreshToken,
      });
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('refresh-access-token')
  @Public()
  async refreshAccessToken(
    @Body(new ObjectValidationPipe(refreshAccessTokenValdator))
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<ApiResponse> {
    //verify refresh token
    const { refreshToken: token } = refreshAccessTokenDto;
    const { id } = await this.tokenService.verifyRefreshToken(token);
    //get user details
    const user = await this.userService.findById(id);
    if (user.refreshToken !== token)
      throw new BadRequestException('invalid refresh token');
    //generate new refresh token
    const refreshToken = await this.tokenService.refreshToken({ id: user.id });
    //generate new access token
    const data = this.tokenService.generateTokenData(user);
    const authToken = await this.tokenService.tokenize({ data });
    //update user refreshtoken
    await this.userService.updateRefreshToken(id, refreshToken);
    return {
      status: 'success',
      data: {
        authToken,
        refreshToken,
      },
    };
  }
}
