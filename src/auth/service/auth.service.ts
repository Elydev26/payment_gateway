import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { LoginDto, RefreshAccessTokenDto } from '../dto/auth.dto';
import { UserService } from 'src/users/service/user.service';
import {
  hashPassword,
  verifyPassword,
} from 'src/utils/common/function/password.function';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { UserDoc } from 'src/users/model/user.model';
import { UserRoleEnum } from 'src/utils/enums/userRole.enum';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from 'src/utils/enums/envConfig.enum';
import { TokenService } from 'src/app/token/service/token.service';
import { ApiResponse } from 'src/utils/common/interface/apiResponse.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async userSignIn(loginDto: LoginDto): Promise<UserDoc> {
    const { email, password } = loginDto;
    //check if the user exist
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('invalid credentials');
    //compare passwords
    const valid = verifyPassword(password, user.password);
    if (!valid) throw new BadRequestException('invalid credentials');
    //user is valid
    return user;
  }
  async userSignUp(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserDoc>> {
    const { email, password } = createUserDto;
    //check if user email exist
    const emailExist = await this.userService.findOne({ email });
    if (emailExist)
      throw new ConflictException(
        'email already registered,try login to your account with the provided email',
      );
    //hash password
    const hashedPassword = await hashPassword(password);
    //create user
    const user = await this.userService.createuser({
      ...createUserDto,
      userRole: UserRoleEnum.client,
      password: hashedPassword,
    });
    return {
      status: 'success',
      data: user,
    };
  }

  async getUserGoogleData(accessToken: string) {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return data;
  }

  async authenticateWithGoogle(code: string): Promise<UserDoc> {
    try {
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: this.config.get<string>(EnvConfigEnum.GOOGLE_CLIENT_ID),
        client_secret: this.config.get<string>(
          EnvConfigEnum.GOOGLE_CLIENT_SECRET,
        ),
        redirect_uri: this.config.get<string>(EnvConfigEnum.REDIRECT_URI),
        grant_type: 'authorization_code',
      });
      // Get user data using access token
      const userData = await this.getUserGoogleData(data.access_token);
      // Check if user already exists in the database
      let user = await this.userService.findByEmail(userData.email);
      if (!user)
        return await this.userService.createuser({
          ...userData,
          verified: true,
          firstName: userData.given_name,
          lastName: userData.family_name,
          profilePicture: userData.picture,
        });
      return user;
    } catch (error) {
      // Handle errors using NestJS's exception handling
      Logger.debug('Error during Google OAuth:', error);
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getUserFromToken(accessToken: string) {
    const fields = 'id,name,email';
    const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`;
    const response = await axios.get(url);
    return response.data;
  }
  async authenticateWithFacebook(code: string): Promise<UserDoc> {
    try {
      // Exchange authorization code for access token
      const { data } = await axios.get(
        'https://graph.facebook.com/v12.0/oauth/access_token',
        {
          params: {
            client_id: this.config.get<string>(
              EnvConfigEnum.FACEBOOK_CLIENT_ID,
            ),
            client_secret: this.config.get<string>(
              EnvConfigEnum.FACEBOOK_CLIENT_SECRET,
            ),
            redirect_uri: this.config.get<string>(
              EnvConfigEnum.FACEBOOK_REDIRECT_URI,
            ),
            code,
          },
        },
      );

      // Get user data using access token
      const userData = await this.getUserFromToken(data.access_token);
      const { id, name, email } = userData;
      let user = await this.userService.findByEmail(userData.email);

      if (!user) {
        // Create a new user if not found
        const [firstName, lastName] = name.split(' ');
        user = await this.userService.createuser({
          email,
          verified: true,
          lastName,
          firstName,
          profilePicture: `https://graph.facebook.com/${id}/picture?type=large`,
        });
        return user;
      }
    } catch (error) {
      Logger.debug('Error during Facebook OAuth:', error);
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async refreshAccessToken(token: RefreshAccessTokenDto):Promise<ApiResponse> {
  //   //verify refresh token
  //   const { id } = await this.tokenService.verifyRefreshToken(
  //     token.refreshToken,
  //   );
  //   //get user details
  //   const user = await this.userService.findById(id);
  //   if (user.refreshToken !== token.refreshToken)
  //     throw new BadRequestException('invalid refresh token');
  //   //generate new refresh token
  //   const refreshToken = await this.tokenService.refreshToken({ id: user.id });
  //   //generate new access token
  //   const authToken = await this.tokenService.tokenize({
  //     data: {
  //       id: user.id,
  //       userRole: user.userRole,
  //       accountStatus: user.accountStatus,
  //       verfired: user.verified,
  //     },
  //   });
  //   //update user refreshtoken
  //   await this.userService.updateRefreshToken(id, refreshToken);
  //   return {
  //     status: 'success',
  //     data: {
  //       authToken,
  //       refreshToken,
  //     },
  //   };
}
