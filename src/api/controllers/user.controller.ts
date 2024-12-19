import { handleErrorResponse, handleSuccessResponse } from '../utils/response-handler'
import userService from '../services/user.service'
import * as password from '../utils/password'
import * as validations from '../validations/user.validation'
import decodeTokenMiddleware from '../middlewares/auth'
import { Route, Res, TsoaResponse, Request, Body, Response, Tags, Example, Controller, Get, Post, Delete, Query, Path, Patch, Header } from 'tsoa'
import { ISignup, IVerifyAccount, IGetUser, IForgotPassword, IPatchUser, ILogin, IResetPassword } from '../interfaces/user'
import { signToken, verifyToken, refreshToken } from '../utils/tokenizer'
import sendEmail from '../utils/email'
import { NEXT_APP_ID } from '../../config'

@Route('user')
@Tags('USERS')
export class userController extends Controller {
  @Post('signup')
  @Response(201, 'Registered successfully')
  // email already in use
  @Response(409, 'email already in use')
  public async signup(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any } >,
    @Res() sendError: TsoaResponse<400, { success: false, status: number, message: object } >,
    @Body() payload: ISignup,
    @Request() request: any
  ): Promise<any> {
    try {
      if (payload.password !== payload.repeatPassword) {
        sendError(400, { success: false, status: 400, message: { password: 'passwords do not match' } })
      }
      await validations.signup.validateAsync(payload)
      // hash the payload.password
      const hashedPassword = await password.hashPassword(payload.password)
      // create the user
      const user = await userService.signup({ ...payload, password: hashedPassword })
      const jwt = await signToken({ userId: user.user.userId, email: user.user.email, is_admin: user.user.is_admin || false })
      // send the user a verification email
      sendSuccess(201, { success: true, data: user } , /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  @Post('verify')
  @Response(201, 'Verified successfully')
  // token not valid
  @Response(409, 'token not valid')
  public async verifyToken(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any } >,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object } >,
    @Body() payload: IVerifyAccount
  ): Promise<any> {
    try {
      await validations.verifyToken.validateAsync(payload)
      // verify the token
      const user = await userService.verifyToken({...payload, tokenRoute: 'email'})
      const jwt = await signToken({ userId: user.userId, email: user.email, is_admin: user.is_admin || false })
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - upload profile details
   **/
  @Example({
    email: 'customer@peddle.com',
    firstName: 'John',
    lastName: 'Doe',
    mobile: '08012345678',
    address: 'No 1, John Doe Street, Lagos, Nigeria',
    nationality: 'Nigeria',
    state: 'Lagos',
    city: 'Lagos',
    zipCode: '23401',
  })
  @Post('update-profile')
  @Response(201, 'Profile updated successfully')
  // token not valid
  @Response(409, 'token not valid')
  public async createProfile(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any } >,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object } >,
    @Body() payload: IPatchUser,
    @Header('x-auth-token') token: string,
  ): Promise<any> {
    try {
      if(!token) {
        throw { status: 401, message: 'Unauthorized' }
      }
      const jwt = await refreshToken(token)
      await validations.profile.validateAsync(payload)
      // verify the token
      const user = await userService.createProfile(payload)
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - send a password reset link to the user's email
   **/
  @Example({
    email: 'customer@peddle.com',
  })
  @Post('forgot-password')
  @Response(201, 'Password reset link sent successfully')
  // token not valid
  @Response(409, 'token not valid')
  public async forgotPassword(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any } >,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object } >,
    @Body() payload: IForgotPassword
  ): Promise<any> {
    try {
      await validations.forgotPassword.validateAsync(payload)
      // verify the token
      const user = await userService.forgotPassword(payload)
      sendSuccess(200, { success: true, data: user })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - login a user
   * */
  @Example({
    email: 'customer@peddle.com',
    password: '123456qwerty'
  })
  @Post('login')
  @Response(201, 'Logged in successfully')
  // email not found
  @Response(404, 'email not found')
  // password incorrect
  @Response(409, 'password incorrect')
  public async login(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any } >,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object } >,
    @Body() payload: ILogin,
    @Header('x-app-id') appId: string,
  ): Promise<any> {
    try {
      await validations.login.validateAsync(payload)
      // verify the token
      const user = await userService.login(payload)
      const jwt = await signToken({ userId: user.user.userId, email: user.user.email, is_admin: user.user.is_admin || false }, appId === NEXT_APP_ID ? '30d' : '24h')
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - login a user
   * */
  @Example({
    userId: '60a1c1c1c1c1c1c1c1c1c1c1',
  })
  @Get('user/{userId}')
  @Response(201, 'Profile fetched successfully')
  // email not found
  @Response(404, 'User not found')
  public async getUser(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any } >,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object } >,
    @Path() userId: string,
    @Header('x-auth-token') token: string,
  ): Promise<any> {
    try {
      if(!token) {
        throw { status: 401, message: 'Unauthorized' }
      }
      const jwt = await refreshToken(token)
      // authenticate the user

      await validations.isMongoIdValid(userId)
      // verify the token
      const user = await userService.getUser({userId})
      sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - delete a user
   * */
  @Example({
    userId: '60a1c1c1c1c1c1c1c1c1c1c1',
  })
  @Delete('delete')
  @Response(201, 'User deleted successfully')
  // email not found
  @Response(404, 'User not found')
  public async deleteUser(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any } >,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object } >,
    @Header('x-auth-token') token: string,
    @Body() payload: IGetUser
  ): Promise<any> {
    try {
      if(!token) {
        throw { status: 401, message: 'Unauthorized' }
      }
      const thisUser = await verifyToken(token)
      if(!thisUser.is_admin) {
        throw { status: 401, message: 'Unauthorized' }
      }
      const jwt = await refreshToken(token)
      await validations.isMongoIdValid(payload.userId)
      // verify the token
      const user = await userService.delete(payload)
        sendSuccess(200, { success: true, data: user }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  // create an endpoint for refreshing token
  @Post('refresh-token')
  @Response(201, 'Token refreshed successfully')
  @Response(401, 'Unauthorized')
  public async refreshToken(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any } >,
    @Res() sendError: TsoaResponse<400 | 404 | 409, { success: false, status: number, message: object } >,
    @Header('x-auth-token') token: string,
  ): Promise<any> {
    try {
      if(!token) {
        throw { status: 401, message: 'Unauthorized' }
      }
      const jwt = await refreshToken(token)
      sendSuccess(200, { success: true, data: { jwt } }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  @Post('initiate-password-reset')
  // @Example<IUserResponse>(userResponse)
  @Response(201, 'password reset initiated successfully an email has been sent to the user with the reset token')
  public async initiatePasswordReset(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400, { success: false, status: number, message: object }>,
    @Body() payload: { email: string }
  ): Promise<any> {
    try {
      validations.forgotPassword.validateAsync(payload) // validate the payload
      const emailToken = await userService.forgotPassword(payload)
      const sent = await sendEmail('Password Reset Token', `Your password reset token is ${emailToken}`, payload.email)
      sendSuccess(201, { success: true, data: null })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @function Change password for a user
   * @implements adminService.ChangePassword
   * @param email user email
   * @param password user password
   * @return {Promise<object>} user profile jsoned object
   */
  // @Example<IUserPayload>(userPayload)
  @Patch('change-password')
  // @Example<IUserResponse>(userResponse)
  @Response(201, 'password changed successfully')
  public async changePassword(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400, { success: false, status: number, message: object }>,
    @Body() payload: IResetPassword
  ): Promise<any> {
    try {
      validations.resetPassword.validateAsync(payload) // validate the payload
      const updatedUser = await userService.resetPassword(payload)
      sendSuccess(201, { success: true, data: updatedUser }, /* set the jwt */ )
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

}

//export the controller
export default new userController();