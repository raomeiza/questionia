import { handleErrorResponse, handleSuccessResponse } from '../utils/response-handler'
import formsServices from '../services/forms.services'
// import * as validations from '../validations/fom.validation'
import decodeTokenMiddleware from '../middlewares/auth'
import { Route, Res, TsoaResponse, Request, Body, Response, Tags, Example, Controller, Get, Post, Delete, Query, Path, Patch, Header } from 'tsoa'
import IFormService, { ICreate, IDelete, IResponse, IGet, IGetAll } from '../interfaces/forms.interface'
import { signToken } from '../utils/tokenizer'

@Route('form')
@Tags('Forms')
export class formController extends Controller {
  /**
   * @description - creates a form and returns the form id if successfull
   * */
  @Post('create')
  @Response(201, 'Form created successfully')
  @Response(409, 'Failed to create form')
  public async create(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string, error: object }>,
    @Body() payload: ICreate,
    @Request() request: any
  ): Promise<any> {
    try {
      let token = request.headers['x-auth-token']
      // authenticate the user
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized',error: {} })
      }
      // await validations.
      const form = await formsServices.create({ ...payload, userId: request.decodedUser.userId })
      const jwt = await signToken({ userId: request.decodedUser.userId, email: request.decodedUser.email, is_admin: request.decodedUser.is_admin || false })
      // send the user a verification email
      sendSuccess(201, { success: true, data: form }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
 * @description - updates an existing form
 * */
  @Patch(':id')
  @Response(201, 'Form updated successfully')
  @Response(409, 'Failed to update form')
  public async update(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string, error: object  }>,
    @Body() payload: ICreate,
    @Request() request: any
  ): Promise<any> {
    try {
      //await validations.signup.validateAsync(payload)
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized', error: {} })
      }
      // await validations.
      const form = await formsServices.Update(payload, request.params.id, request.decodedUser.userId)
      const jwt = await signToken({ userId: request.decodedUser.userId, email: request.decodedUser.email, is_admin: request.decodedUser.is_admin || false })
      // send the user a verification email
      //const jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      // send the user a verification email
      sendSuccess(200, { success: true, data: form }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - deletes a form from the server and returns the form
   * */
  @Delete(':id')
  @Response(201, 'Form deleted successfully')
  @Response(409, 'Failed to delete form')
  public async delete(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401, { success: false, status: number, message: string, error: object }>,
    @Body() payload: IDelete,
    @Request() request: any
  ): Promise<any> {
    try {
      //await validations.signup.validateAsync(payload)
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized', error: {} })
      }
      // await validations.
      const form = await formsServices.delete(payload)
      const jwt = await signToken(request.decodedUser)
      // send the user a verification email
      //const jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      // send the user a verification email
      sendSuccess(200, { success: true, data: form }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
 * @description - first step to validating a pre registered account
 * */
  @Get(':id')
  @Response(200, 'Form loaded successfully')
  @Response(409, 'Failed to load form')
  @Response(401, 'Access denied',{success: false, status: 401, message: 'Access denied', error: {message: 'invalid or no token provided', place: 'request>headers>x-auth-token'}})
  public async get(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string, error: object }>,
    @Path() id: string,
    @Request() request: any
  ): Promise<any> {
    try {
      const form = await formsServices.get({ formId: id})
      let jwt = request.decodedUser ? await signToken(request.decodedUser) : ''
      // send the user a verification email
      //const jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      // send the user a verification email
      sendSuccess(200, { success: true, data: form }, /* set the jwt */ { ...(jwt && {'x-auth-token': jwt })})
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
 * @description - first step to validating a pre registered account
 * */
  @Get()
  @Response(200, 'Forms fetched successfully')
  @Response(409, 'Failed to fetch forms')
  @Response(401, 'Access denied')
  public async getAll(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401, { success: false, status: number, message: string, error: object }>,
    @Request() request: any
  ): Promise<any> {
    try {
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized', error: {message: 'invalid or no token provided', place: 'request>headers>x-auth-token'} })
      }
      //await validations.signup.validateAsync(payload)
      // create the user
      const form = await formsServices.getAll({ userId: request.decodedUser.userId })
      //const jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      // send the user a verification email
      sendSuccess(201, { success: true, data: form }, /* set the jwt */)
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  // routes for filling of forms
  @Tags('Forms', 'Response')
  @Post('/response/:formId')
  @Response(201, 'Response created successfully')
  @Response(409, 'Failed to create response')
  public async response(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string, error: object }>,
    @Body() payload: IResponse,
    @Path('formId') formId: string,
  ): Promise<any> {
    try {
      //await validations.signup.validateAsync(payload)
      // await decodeTokenMiddleware(request)
      // if (!request.decodedUser.userId) {
      //   console.log('no user id', request.decodedUser)
      //   return sendError(401, { success: false, status: 401, message: 'unauthorized', error: {} })
      // }
      // await validations.
      const response = await formsServices.fillForm(payload)
      // const jwt = await signToken({ userId: request.decodedUser.userId, email: request.decodedUser.email, is_admin: request.decodedUser.is_admin || false })
      // send the user a verification email
      sendSuccess(201, { success: true, data: response }, /* set the jwt  { 'x-auth-token': jwt }*/)
    } catch (err: any) {
      console.log('error', err)
      return await handleErrorResponse(sendError, err)
    }
  }

  // route for fetching form response by form id
  @Tags('Forms', 'Response')
  @Get('/response/:formId/:responseId')
  @Response(200, 'Response fetched successfully')
  @Response(409, 'Failed to fetch response')
  @Response(401, 'Access denied')
  public async getResponse(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string, error: object }>,
    @Path('formId') formId: string,
    @Path('responseId') responseId: string,
    @Request() request: any
  ): Promise<any> {
    try {
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized', error: {} })
      }
      // create the user
      const response = await formsServices.getResponse({ responseId })
      const jwt = await signToken({ userId: request.decodedUser.userId, email: request.decodedUser.email, is_admin: request.decodedUser.is_admin || false })
      // send the user a verification email
      sendSuccess(200, { success: true, data: response }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  // route for fetching all form response by form id
  @Tags('Forms', 'Response')
  @Get('/response/:formId')
  @Response(200, 'Responses fetched successfully')
  @Response(409, 'Failed to fetch responses')
  @Response(401, 'Access denied')
  public async getAllResponse(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string, error: object }>,
    @Path('formId') formId: string,
    @Request() request: any
  ): Promise<any> {
    try {
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized', error: {} })
      }
      // create the user
      const responses = await formsServices.getAllResponses({ formId })
      const jwt = await signToken({ userId: request.decodedUser.userId, email: request.decodedUser.email, is_admin: request.decodedUser.is_admin || false })
      // send the user a verification email
      sendSuccess(200, { success: true, data: responses }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  // route for counting form response by form id
  @Tags('Forms', 'Response')
  @Get('/response/count/:formId')
  @Response(200, 'Responses fetched successfully')
  @Response(409, 'Failed to fetch responses')
  @Response(401, 'Access denied')
  public async countResponse(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string, error: object }>,
    @Path('formId') formId: string,
    @Request() request: any
  ): Promise<any> {
    try {
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized', error: {} })
      }
      // create the user
      const count = await formsServices.countResponses({ formId })
      const jwt = await signToken({ userId: request.decodedUser.userId, email: request.decodedUser.email, is_admin: request.decodedUser.is_admin || false })
      // send the user a verification email
      sendSuccess(200, { success: true, data: count }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  // route for changing the active status of a form
  @Tags('Forms')
  @Patch('/:formId/active-status')
  @Response(200, 'Form state changed successfully')
  @Response(409, 'Failed to change form state')
  @Response(401, 'Access denied')
  public async activate(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string, error: object }>,
    @Path('formId') formId: string,
    @Body() payload: { newState: boolean },
    @Request() request: any,  // so that use can test the route with swagger
    @Header('Authorization') token?: string
  ): Promise<any> {
    try {
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized', error: {} })
      }
      // create the user
      const form = await formsServices.changeActivationStatus({ formId, userId: request.decodedUser.userId, newState: payload.newState })
      const jwt = await signToken({ userId: request.decodedUser.userId, email: request.decodedUser.email, is_admin: request.decodedUser.is_admin || false })
      // send the user a verification email
      sendSuccess(200, { success: true, data: form }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  // route for changing the public status of a form
  @Tags('Forms')
  @Patch('/:formId/public-status')
  @Response(200, 'Form state changed successfully')
  @Response(409, 'Failed to change form state')
  @Response(401, 'Access denied')
  public async makePublic(
    @Res() sendSuccess: TsoaResponse<200, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string, error: object }>,
    @Path('formId') formId: string,
    @Body() payload: { newState: boolean },
    @Request() request: any
  ): Promise<any> {
    try {
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized', error: {} })
      }
      // create the user
      const form = await formsServices.changePublicStatus({ formId, userId: request.decodedUser.userId, newState: payload.newState })
      const jwt = await signToken({ userId: request.decodedUser.userId, email: request.decodedUser.email, is_admin: request.decodedUser.is_admin || false })
      // send the user a verification email
      sendSuccess(200, { success: true, data: form }, /* set the jwt */ { 'x-auth-token': jwt })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }
}

//export the controller
export default new formController()