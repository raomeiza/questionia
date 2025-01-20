import { FormService } from './forms.services';
import Forms, { ResponseModel } from '../models/forms.model';
import { signToken } from '../utils/tokenizer';
import { Types } from 'mongoose';
import { sampleCreate } from '../interfaces/forms.interface';

jest.mock('../models/forms.model');
jest.mock('../utils/tokenizer');

describe('FormService', () => {
    let formService: FormService;

    beforeEach(() => {
        formService = new FormService();
    });

    describe('create', () => {
        it('should create a form', async () => {
            const resource = { title: 'Test Form' };
            (Forms.create as jest.Mock).mockResolvedValue(resource);

            const result = await formService.create(sampleCreate);

            expect(result).toEqual(resource);
            expect(Forms.create).toHaveBeenCalledWith(resource);
        });

        it('should throw an error if form creation fails', async () => {
            const resource = { title: 'Test Form' };
            const error = new Error('Form not created');
            (Forms.create as jest.Mock).mockRejectedValue(error);

            await expect(formService.create(sampleCreate)).rejects.toEqual({
                message: 'Form not created',
                error,
                status: 404,
            });
        });
    });

    describe('Update', () => {
        it('should update a form', async () => {
            const resource = { title: 'Updated Form' };
            const formId = '123';
            const userId = '456';
            const updatedForm = { ...resource, _id: formId, userId };
            (Forms.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedForm);

            const result = await formService.Update(sampleCreate, formId, userId);

            expect(result).toEqual(updatedForm);
            expect(Forms.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: formId, userId },
                { $set: { ...resource, updatedAt: expect.any(Date) } },
                { new: true }
            );
        });

        it('should throw an error if form update fails', async () => {
            const resource = { title: 'Updated Form' };
            const formId = '123';
            const userId = '456';
            const error = new Error('Form not update');
            (Forms.findOneAndUpdate as jest.Mock).mockRejectedValue(error);

            await expect(formService.Update(sampleCreate, formId, userId)).rejects.toEqual({
                message: 'Form not update',
                error,
                status: 404,
            });
        });
    });

    describe('get', () => {
        it('should get a form by id', async () => {
            const resource = { formId: '123' };
            const form = { _id: '123', title: 'Test Form' };
            (Forms.findByIdAndUpdate as jest.Mock).mockResolvedValue(form);

            const result = await formService.get(resource);

            expect(result).toEqual(form);
            expect(Forms.findByIdAndUpdate).toHaveBeenCalledWith(resource.formId, { $inc: { views: 1 } });
        });

        it('should throw an error if form is not found', async () => {
            const resource = { formId: '123' };
            (Forms.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(formService.get(resource)).rejects.toEqual({
                message: 'form not found',
                status: 404,
            });
        });
    });

    describe('delete', () => {
        it('should delete a form by id', async () => {
            const resource = { formId: '123' };
            const form = { _id: '123', title: 'Test Form' };
            (Forms.findByIdAndDelete as jest.Mock).mockResolvedValue(form);

            const result = await formService.delete(resource);

            expect(result).toEqual(form);
            expect(Forms.findByIdAndDelete).toHaveBeenCalledWith(resource.formId);
        });

        it('should throw an error if form deletion fails', async () => {
            const resource = { formId: '123' };
            const error = new Error('Failed to delete');
            (Forms.findByIdAndDelete as jest.Mock).mockRejectedValue(error);

            await expect(formService.delete(resource)).rejects.toEqual({
                message: 'Failed to delete',
                error,
                status: 404,
            });
        });
    });

    describe('getAll', () => {
        it('should get all forms for a user', async () => {
            const resource = { userId: '456', limit: 10, page: 1 };
            const forms = [{ _id: '123', title: 'Test Form' }];
            (Forms.aggregate as jest.Mock).mockResolvedValue(forms);

            const result = await formService.getAll(resource);

            expect(result).toEqual(forms);
            expect(Forms.aggregate).toHaveBeenCalledWith(expect.any(Array));
        });

        it('should throw an error if fetching forms fails', async () => {
            const resource = { userId: '456', limit: 10, page: 1 };
            const error = new Error('Failed to fetch forms');
            (Forms.aggregate as jest.Mock).mockRejectedValue(error);

            await expect(formService.getAll(resource)).rejects.toEqual({
                message: 'Failed to fetch forms',
                error,
                status: 404,
            });
        });
    });

    describe('fillForm', () => {
        it('should fill a form', async () => {
            const resource = { formId: '123', response: 'Test Response' };
            const form = { _id: '123', isActive: true };
            const filledResponse = { ...resource, _id: '456' };
            (Forms.findById as jest.Mock).mockResolvedValue(form);
            (ResponseModel.create as jest.Mock).mockResolvedValue(filledResponse);

            const result = await formService.fillForm();

            expect(result).toEqual(filledResponse);
            expect(Forms.findById).toHaveBeenCalledWith(resource.formId);
            expect(ResponseModel.create).toHaveBeenCalledWith(resource);
            expect(Forms.findByIdAndUpdate).toHaveBeenCalledWith(resource.formId, { $inc: { responseCount: 1 } });
        });

        it('should throw an error if form is not active', async () => {
            const resource = { formId: '123', response: 'Test Response' };
            const form = { _id: '123', isActive: false };
            (Forms.findById as jest.Mock).mockResolvedValue(form);

            await expect(formService.fillForm(resource)).rejects.toEqual({
                message: 'form is not active',
                status: 400,
            });
        });

        it('should throw an error if form is not found', async () => {
            const resource = { formId: '123', response: 'Test Response' };
            (Forms.findById as jest.Mock).mockResolvedValue(null);

            await expect(formService.fillForm(resource)).rejects.toEqual({
                message: 'form not found',
                status: 404,
            });
        });
    });

    describe('getAllResponses', () => {
        it('should get all responses for a form', async () => {
            const resource = { formId: '123', page: 1, pageSize: 10 };
            const responses = [{ _id: '456', response: 'Test Response' }];
            (ResponseModel.aggregate as jest.Mock).mockResolvedValue(responses);

            const result = await formService.getAllResponses(resource);

            expect(result).toEqual(responses);
            expect(ResponseModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
        });

        it('should throw an error if fetching responses fails', async () => {
            const resource = { formId: '123', page: 1, pageSize: 10 };
            const error = new Error('Failed to fetch responses');
            (ResponseModel.aggregate as jest.Mock).mockRejectedValue(error);

            await expect(formService.getAllResponses(resource)).rejects.toEqual({
                message: 'Failed to fetch responses',
                error,
                status: 404,
            });
        });
    });

    describe('countResponses', () => {
        it('should count responses for a form', async () => {
            const resource = { formId: '123' };
            const responseCount = { responseCount: 10 };
            (Forms.findById as jest.Mock).mockResolvedValue(responseCount);

            const result = await formService.countResponses(resource);

            expect(result).toEqual(responseCount);
            expect(Forms.findById).toHaveBeenCalledWith(resource.formId);
        });

        it('should throw an error if counting responses fails', async () => {
            const resource = { formId: '123' };
            const error = new Error('Failed to fetch responses');
            (Forms.findById as jest.Mock).mockRejectedValue(error);

            await expect(formService.countResponses(resource)).rejects.toEqual({
                message: 'Failed to fetch responses',
                error,
                status: 404,
            });
        });
    });

    describe('getResponse', () => {
        it('should get a response by id', async () => {
            const resource = { responseId: '456' };
            const response = { _id: '456', response: 'Test Response' };
            (ResponseModel.findById as jest.Mock).mockResolvedValue(response);

            const result = await formService.getResponse(resource);

            expect(result).toEqual(response);
            expect(ResponseModel.findById).toHaveBeenCalledWith(resource.responseId);
        });

        it('should throw an error if fetching response fails', async () => {
            const resource = { responseId: '456' };
            const error = new Error('Failed to fetch responses');
            (ResponseModel.findById as jest.Mock).mockRejectedValue(error);

            await expect(formService.getResponse(resource)).rejects.toEqual({
                message: 'Failed to fetch responses',
                error,
                status: 404,
            });
        });
    });

    describe('changeActivationStatus', () => {
        it('should change the activation status of a form', async () => {
            const resource = { formId: '123', userId: '456', newState: true };
            const form = { _id: '123', isActive: true };
            (Forms.findOneAndUpdate as jest.Mock).mockResolvedValue(form);

            const result = await formService.changeActivationStatus(resource);

            expect(result).toEqual(form);
            expect(Forms.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: resource.formId, userId: resource.userId },
                { isActive: resource.newState },
                { new: true }
            );
        });

        it('should throw an error if changing activation status fails', async () => {
            const resource = { formId: '123', userId: '456', newState: true };
            const error = new Error('Failed to change the activation status');
            (Forms.findOneAndUpdate as jest.Mock).mockRejectedValue(error);

            await expect(formService.changeActivationStatus(resource)).rejects.toEqual({
                message: 'Failed to change the activation status',
                error,
                status: 404,
            });
        });
    });

    describe('changePublicStatus', () => {
        it('should change the public status of a form', async () => {
            const resource = { formId: '123', userId: '456', newState: true };
            const form = { _id: '123', isPublic: true };
            (Forms.findOneAndUpdate as jest.Mock).mockResolvedValue(form);

            const result = await formService.changePublicStatus(resource);

            expect(result).toEqual(form);
            expect(Forms.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: resource.formId, userId: resource.userId },
                { isPublic: resource.newState },
                { new: true }
            );
        });

        it('should throw an error if changing public status fails', async () => {
            const resource = { formId: '123', userId: '456', newState: true };
            const error = new Error('Failed to change the activation status');
            (Forms.findOneAndUpdate as jest.Mock).mockRejectedValue(error);

            await expect(formService.changePublicStatus(resource)).rejects.toEqual({
                message: 'Failed to change the activation status',
                error,
                status: 404,
            });
        });
    });
});
