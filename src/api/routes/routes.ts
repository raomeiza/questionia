/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { formController } from './../controllers/forms.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { userController } from './../controllers/user.controller';
import type { RequestHandler } from 'express';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Input": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "label": {"dataType":"string","required":true},
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["email"]},{"dataType":"enum","enums":["password"]},{"dataType":"enum","enums":["text"]},{"dataType":"enum","enums":["mobile"]},{"dataType":"enum","enums":["date"]},{"dataType":"enum","enums":["time"]},{"dataType":"enum","enums":["date"]},{"dataType":"enum","enums":["datetime"]},{"dataType":"enum","enums":["radio"]},{"dataType":"enum","enums":["select"]},{"dataType":"enum","enums":["file"]},{"dataType":"enum","enums":["button"]},{"dataType":"enum","enums":["radiogroup"]},{"dataType":"enum","enums":["autocomplete"]},{"dataType":"enum","enums":["emailOrMobile"]},{"dataType":"enum","enums":["checkbox"]},{"dataType":"enum","enums":["textarea"]},{"dataType":"enum","enums":["number"]},{"dataType":"enum","enums":["switch"]},{"dataType":"enum","enums":["slider"]},{"dataType":"enum","enums":["rating"]},{"dataType":"enum","enums":["color"]},{"dataType":"enum","enums":["submit"]},{"dataType":"enum","enums":["reset"]},{"dataType":"enum","enums":["buttonGroup"]}],"required":true},
            "helperText": {"dataType":"string"},
            "Variant": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["outline"]},{"dataType":"enum","enums":["standard"]},{"dataType":"enum","enums":["contained"]},{"dataType":"enum","enums":["text"]}]},
            "sx": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
            "fullWidth": {"dataType":"boolean"},
            "validation": {"dataType":"any"},
            "onClick": {"dataType":"string"},
        },
        "additionalProperties": {"dataType":"any"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StandardForm": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string"},
            "url": {"dataType":"string"},
            "inputs": {"dataType":"array","array":{"dataType":"refObject","ref":"Input"},"required":true},
            "btnTxt": {"dataType":"string"},
            "noSubmit": {"dataType":"boolean"},
            "onSubmitSuccess": {"dataType":"string"},
            "onSubmitFailure": {"dataType":"string"},
            "beforeSubmit": {"dataType":"string"},
            "clearForm": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICreate": {
        "dataType": "refObject",
        "properties": {
            "form": {"ref":"StandardForm","required":true},
            "header": {"dataType":"string","required":true},
            "sx": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
            "activationDate": {"dataType":"string"},
            "expiryDate": {"dataType":"string"},
            "social": {"dataType":"nestedObjectLiteral","nestedProperties":{"telegram":{"dataType":"boolean","required":true},"whatsapp":{"dataType":"boolean","required":true}}},
            "webHooks": {"dataType":"array","array":{"dataType":"string"}},
            "collectionGroup": {"dataType":"string"},
            "userId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdate": {
        "dataType": "refObject",
        "properties": {
            "form": {"ref":"StandardForm","required":true},
            "header": {"dataType":"string","required":true},
            "sx": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},
            "activationDate": {"dataType":"string"},
            "expiryDate": {"dataType":"string"},
            "social": {"dataType":"nestedObjectLiteral","nestedProperties":{"telegram":{"dataType":"boolean","required":true},"whatsapp":{"dataType":"boolean","required":true}}},
            "webHooks": {"dataType":"array","array":{"dataType":"string"}},
            "collectionGroup": {"dataType":"string"},
            "userId": {"dataType":"string","required":true},
            "formId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDelete": {
        "dataType": "refObject",
        "properties": {
            "formId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IFillForm": {
        "dataType": "refObject",
        "properties": {
            "formId": {"dataType":"string","required":true},
            "data": {"dataType":"object","required":true},
            "fillId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISignup": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "repeatPassword": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IVerifyAccount": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "token": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPatchUser": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "repeatPassword": {"dataType":"string","required":true},
            "token": {"dataType":"string","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "mobile": {"dataType":"string","required":true},
            "blocked": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IForgotPassword": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILogin": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGetUser": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.post('/form/create',
            ...(fetchMiddlewares<RequestHandler>(formController)),
            ...(fetchMiddlewares<RequestHandler>(formController.prototype.create)),

            function formController_create(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"201","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"500","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"object","required":true},"message":{"dataType":"string","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    payload: {"in":"body","name":"payload","required":true,"ref":"ICreate"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new formController();


              const promise = controller.create.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/form/:id',
            ...(fetchMiddlewares<RequestHandler>(formController)),
            ...(fetchMiddlewares<RequestHandler>(formController.prototype.update)),

            function formController_update(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"500","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"object","required":true},"message":{"dataType":"string","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    payload: {"in":"body","name":"payload","required":true,"ref":"IUpdate"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new formController();


              const promise = controller.update.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/form/:id',
            ...(fetchMiddlewares<RequestHandler>(formController)),
            ...(fetchMiddlewares<RequestHandler>(formController.prototype.delete)),

            function formController_delete(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"401","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"object","required":true},"message":{"dataType":"string","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    payload: {"in":"body","name":"payload","required":true,"ref":"IDelete"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new formController();


              const promise = controller.delete.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/form/:id',
            ...(fetchMiddlewares<RequestHandler>(formController)),
            ...(fetchMiddlewares<RequestHandler>(formController.prototype.get)),

            function formController_get(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"500","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"object","required":true},"message":{"dataType":"string","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new formController();


              const promise = controller.get.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/form',
            ...(fetchMiddlewares<RequestHandler>(formController)),
            ...(fetchMiddlewares<RequestHandler>(formController.prototype.getAll)),

            function formController_getAll(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"201","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"400","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"object","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new formController();


              const promise = controller.getAll.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/form/fill/:formId',
            ...(fetchMiddlewares<RequestHandler>(formController)),
            ...(fetchMiddlewares<RequestHandler>(formController.prototype.fill)),

            function formController_fill(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"201","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"500","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"object","required":true},"message":{"dataType":"string","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    payload: {"in":"body","name":"payload","required":true,"ref":"IFillForm"},
                    formId: {"in":"path","name":"formId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new formController();


              const promise = controller.fill.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/user/signup',
            ...(fetchMiddlewares<RequestHandler>(userController)),
            ...(fetchMiddlewares<RequestHandler>(userController.prototype.signup)),

            function userController_signup(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"201","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"400","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"object","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    payload: {"in":"body","name":"payload","required":true,"ref":"ISignup"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new userController();


              const promise = controller.signup.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/user/verify',
            ...(fetchMiddlewares<RequestHandler>(userController)),
            ...(fetchMiddlewares<RequestHandler>(userController.prototype.verifyToken)),

            function userController_verifyToken(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"409","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"object","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    payload: {"in":"body","name":"payload","required":true,"ref":"IVerifyAccount"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new userController();


              const promise = controller.verifyToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/user/update-profile',
            ...(fetchMiddlewares<RequestHandler>(userController)),
            ...(fetchMiddlewares<RequestHandler>(userController.prototype.createProfile)),

            function userController_createProfile(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"409","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"object","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    payload: {"in":"body","name":"payload","required":true,"ref":"IPatchUser"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new userController();


              const promise = controller.createProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/user/forgot-password',
            ...(fetchMiddlewares<RequestHandler>(userController)),
            ...(fetchMiddlewares<RequestHandler>(userController.prototype.forgotPassword)),

            function userController_forgotPassword(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"409","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"object","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    payload: {"in":"body","name":"payload","required":true,"ref":"IForgotPassword"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new userController();


              const promise = controller.forgotPassword.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/user/login',
            ...(fetchMiddlewares<RequestHandler>(userController)),
            ...(fetchMiddlewares<RequestHandler>(userController.prototype.login)),

            function userController_login(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"409","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"object","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    payload: {"in":"body","name":"payload","required":true,"ref":"ILogin"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new userController();


              const promise = controller.login.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/user/user/:userId',
            ...(fetchMiddlewares<RequestHandler>(userController)),
            ...(fetchMiddlewares<RequestHandler>(userController.prototype.getUser)),

            function userController_getUser(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"409","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"object","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new userController();


              const promise = controller.getUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/user/delete',
            ...(fetchMiddlewares<RequestHandler>(userController)),
            ...(fetchMiddlewares<RequestHandler>(userController.prototype.deleteUser)),

            function userController_deleteUser(request: any, response: any, next: any) {
            const args = {
                    sendSuccess: {"in":"res","name":"200","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"any","required":true},"success":{"dataType":"enum","enums":[true],"required":true}}},
                    sendError: {"in":"res","name":"409","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"object","required":true},"status":{"dataType":"double","required":true},"success":{"dataType":"enum","enums":[false],"required":true}}},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    payload: {"in":"body","name":"payload","required":true,"ref":"IGetUser"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new userController();


              const promise = controller.deleteUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200)
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
