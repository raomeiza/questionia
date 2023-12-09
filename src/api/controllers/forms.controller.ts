import { handleErrorResponse, handleSuccessResponse } from '../utils/response-handler'
import formsServices from '../services/forms.services'
// import * as validations from '../validations/fom.validation'
import decodeTokenMiddleware from '../middlewares/auth'
import { Route, Res, TsoaResponse, Request, Body, Response, Tags, Example, Controller, Get, Post, Delete, Query, Path, Patch } from 'tsoa'
import IFormService, { ICreate, IDelete, IGet, IGetAll, IUpdate } from '../interfaces/forms.interface'
import { signToken } from '../utils/tokenizer'

@Route('form')
@Tags('Forms')
export class formController extends Controller {
  /**
   * @description - creates a form and returns the form id if successfull
   * */
  @Post('create')
  @Response(201, 'Form created successfully')
  // email already in use
  @Response(409, 'Failed to create form')
  public async create(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string }>,
    @Body() payload: ICreate,
    @Request() request: any
  ): Promise<any> {
    try {
      let token = request.headers['x-auth-token']
      // authenticate the user
      await decodeTokenMiddleware(request)
      if (!request.decodedUser.userId) {
        return sendError(401, { success: false, status: 401, message: 'unauthorized' })
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
  // email already in use
  @Response(409, 'Failed to update form')
  public async update(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400 | 401 | 500, { success: false, status: number, message: string,  }>,
    @Body() payload: IUpdate
  ): Promise<any> {
    try {
      //await validations.signup.validateAsync(payload)
      // create the user
      const form = await formsServices.Update(payload)
      //const jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      // send the user a verification email
      sendSuccess(201, { success: true, data: form }, /* set the jwt */ )
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
   * @description - deletes a form from the server and returns the form
   * */
  @Delete(':id')
  @Response(201, 'Form deleted successfully')
  // email already in use
  @Response(409, 'Failed to delete form')
  public async delete(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400, { success: false, status: number, message: object }>,
    @Body() payload: IDelete
  ): Promise<any> {
    try {
      //await validations.signup.validateAsync(payload)
      // create the user
      const form = await formsServices.delete(payload)
      //const jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      // send the user a verification email
      sendSuccess(201, { success: true, data: form })
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
 * @description - first step to validating a pre registered account
 * */
  @Get(':id')
  @Response(201, 'Form created successfully')
  // email already in use
  @Response(409, 'Failed to create form')

  public async get(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400, { success: false, status: number, message: object }>,
    @Query() id: string
  ): Promise<any> {
    try {
      //await validations.signup.validateAsync(payload)
      // create the user
      const form = await formsServices.get({formId: id})
      //const jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      // send the user a verification email
      sendSuccess(201, { success: true, data: form }, /* set the jwt */ )
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }

  /**
 * @description - first step to validating a pre registered account
 * */
  @Get()
  @Response(201, 'Forms fetched successfully')
  // email already in use
  @Response(409, 'Failed to fetch forms')
  public async getAll(
    @Res() sendSuccess: TsoaResponse<201, { success: true, data: any }>,
    @Res() sendError: TsoaResponse<400, { success: false, status: number, message: object }>,
  ): Promise<any> {
    try {
      //await validations.signup.validateAsync(payload)
      // create the user
      const form = await formsServices.getAll()
      //const jwt = await signToken({ userId: user._id, email: user.email, is_admin: user.is_admin || false })
      // send the user a verification email
      sendSuccess(201, { success: true, data: form }, /* set the jwt */)
    } catch (err: any) {
      return await handleErrorResponse(sendError, err)
    }
  }
}

//export the controller
export default new formController()