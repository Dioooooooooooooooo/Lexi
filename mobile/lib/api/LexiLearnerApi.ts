/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterDto {
  /**
   * Username
   * @minLength 8
   * @example "johndoe1"
   */
  username: string;
  /**
   * User first name
   * @minLength 1
   * @example "John"
   */
  first_name: string;
  /**
   * User last name
   * @minLength 1
   * @example "Doe"
   */
  last_name: string;
  /**
   * User email
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * User password
   * @example "securePassword123"
   */
  password: string;
  /**
   * Password confirmation
   * @example "securePassword123"
   */
  confirm_password: string;
  /**
   * User role
   * @example "Pupil"
   */
  role: "Pupil" | "Teacher";
}

export interface UserResponseDto {
  /**
   * User ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /** Email */
  email: string | null;
  /** First name */
  first_name: string | null;
  /** Last name */
  last_name: string | null;
  /** User role */
  role: string | null;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Created at
   * @format date-time
   */
  updated_at?: string;
}

export interface AuthResponseDto {
  /** Access token */
  access_token: string;
  /** User info */
  user: UserResponseDto;
  /** Refresh token */
  refresh_token?: string;
}

export interface ErrorResponseDto {
  /**
   * Status of the response
   * @example "error"
   */
  status: string;
  /**
   * Error message
   * @example "Invalid credentials"
   */
  message: string;
}

export interface LoginDto {
  /**
   * User email
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * User password
   * @example "securePassword123"
   */
  password: string;
}

export interface SuccessResponseDto {
  /**
   * Success message
   * @example "User created successfully"
   */
  message: string;
  /** Returned data payload */
  data: object;
}

export interface RefreshTokenDto {
  /** Refresh token */
  refresh_token: string;
}

export interface ForgotPasswordDto {
  /**
   * User email
   * @example "john.doe@example.com"
   */
  email: string;
}

export interface ResetPasswordDto {
  /** Reset token */
  token: string;
  /**
   * New password
   * @example "newSecurePassword123"
   */
  new_password: string;
}

export interface UpdateProfileDto {
  /**
   * Username
   * @minLength 8
   * @example "janes123"
   */
  username?: string;
  /**
   * First name
   * @example "Jane"
   */
  first_name?: string;
  /**
   * Last name
   * @example "Smith"
   */
  last_name?: string;
  /** Email address */
  email?: string;
  /** Avatar */
  avatar?: string;
}

export interface ChangePasswordDto {
  /** Current password */
  current_password: string;
  /** New password */
  new_password: string;
}

export interface UpdatePupilProfileDto {
  /**
   * Age
   * @example 10
   */
  age: number;
  /**
   * Grade Level
   * @example 6
   */
  grade_level: number;
}

export interface CreateClassroomDto {
  /**
   * Classroom Name
   * @example "Section Maya"
   */
  name: string;
  /**
   * Classroom Name
   * @example "Section Maya"
   */
  description: string;
}

export type UpdateClassroomDto = object;

export interface CreateMinigameLogDto {
  /** Minigame ID */
  minigame_id: string;
  /** Pupil ID */
  pupil_id: string;
  /** Reading Session ID */
  reading_session_id: string;
  /** Minigame Result in JSON format */
  result: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:3000",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title LexiLearner API
 * @version 1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @baseUrl http://localhost:3000
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Health
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: "GET",
      ...params,
    });

  health = {
    /**
     * No description
     *
     * @tags Health
     * @name AppControllerHealthCheck
     * @request GET:/health
     */
    appControllerHealthCheck: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/health`,
        method: "GET",
        ...params,
      }),
  };
  auth = {
    /**
     * @description Create a new user account with email and password
     *
     * @tags Authentication
     * @name AuthControllerRegister
     * @summary Register a new user
     * @request POST:/auth/register
     */
    authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, ErrorResponseDto>({
        path: `/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticate user with email and password
     *
     * @tags Authentication
     * @name AuthControllerLogin
     * @summary User login
     * @request POST:/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a new access token using refresh token
     *
     * @tags Authentication
     * @name AuthControllerRefreshToken
     * @summary Refresh access token
     * @request POST:/auth/refresh
     * @secure
     */
    authControllerRefreshToken: (
      data: RefreshTokenDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/refresh`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Send a password reset link to user email
     *
     * @tags Authentication
     * @name AuthControllerForgotPassword
     * @summary Request password reset
     * @request POST:/auth/forgot-password
     * @secure
     */
    authControllerForgotPassword: (
      data: ForgotPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/forgot-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Reset user password using reset token
     *
     * @tags Authentication
     * @name AuthControllerResetPassword
     * @summary Reset password
     * @request POST:/auth/reset-password
     */
    authControllerResetPassword: (
      data: ResetPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Request email verification token
     *
     * @tags Authentication
     * @name AuthControllerRequestEmailVerification
     * @summary Request email verification
     * @request POST:/auth/request-email-verification
     * @secure
     */
    authControllerRequestEmailVerification: (params: RequestParams = {}) =>
      this.request<SuccessResponseDto, any>({
        path: `/auth/request-email-verification`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Verify user email using verification token
     *
     * @tags Authentication
     * @name AuthControllerVerifyEmail
     * @summary Verify email
     * @request GET:/auth/verify-email
     */
    authControllerVerifyEmail: (
      query: {
        /**
         * Email verification token
         * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
         */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/verify-email`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the authenticated user profile information
     *
     * @tags Authentication
     * @name AuthControllerGetProfile
     * @summary Get current user profile
     * @request GET:/auth/me
     * @secure
     */
    authControllerGetProfile: (params: RequestParams = {}) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update the authenticated user profile information
     *
     * @tags Authentication
     * @name AuthControllerUpdateProfile
     * @summary Update user profile
     * @request PATCH:/auth/me
     * @secure
     */
    authControllerUpdateProfile: (
      data: UpdateProfileDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/me`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Change the authenticated user password
     *
     * @tags Authentication
     * @name AuthControllerChangePassword
     * @summary Change user password
     * @request POST:/auth/change-password
     * @secure
     */
    authControllerChangePassword: (
      data: ChangePasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/change-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logout the authenticated user and optionally revoke refresh token
     *
     * @tags Authentication
     * @name AuthControllerLogout
     * @summary User logout
     * @request POST:/auth/logout
     * @secure
     */
    authControllerLogout: (
      data?: {
        /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." */
        refresh_token?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/logout`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Verify if the provided JWT token is valid and return user info
     *
     * @tags Authentication
     * @name AuthControllerVerifyToken
     * @summary Verify JWT token
     * @request GET:/auth/verify-token
     * @secure
     */
    authControllerVerifyToken: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example true */
          valid?: boolean;
          user?: UserResponseDto;
        },
        ErrorResponseDto
      >({
        path: `/auth/verify-token`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Check if user and auth provider exist for debugging
     *
     * @tags Authentication
     * @name AuthControllerDebugLogin
     * @summary Debug login issues
     * @request GET:/auth/debug-login/{email}
     */
    authControllerDebugLogin: (email: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/debug-login/${email}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Check if database tables exist and are accessible
     *
     * @tags Authentication
     * @name AuthControllerDebugDatabase
     * @summary Debug database connection
     * @request GET:/auth/debug-db
     */
    authControllerDebugDatabase: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/debug-db`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Check if a user exists by email or username
     *
     * @tags Authentication
     * @name AuthControllerCheckUserExists
     * @summary Check if user exists
     * @request GET:/auth/check-user
     */
    authControllerCheckUserExists: (
      query: {
        /** Type of field to check (email or username) */
        fieldType: "email" | "username";
        /**
         * Value to check
         * @example "user@example.com"
         */
        fieldValue: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/auth/check-user`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the authenticated user profile information - use /auth/me instead
     *
     * @tags Authentication
     * @name AuthControllerGetProfileLegacy
     * @summary Get user profile (legacy)
     * @request GET:/auth/profile
     * @deprecated
     * @secure
     */
    authControllerGetProfileLegacy: (params: RequestParams = {}) =>
      this.request<UserResponseDto, ErrorResponseDto>({
        path: `/auth/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  pupils = {
    /**
     * No description
     *
     * @tags Pupils
     * @name PupilsControllerGetPupilProfile
     * @summary Get user pupil profile
     * @request GET:/pupils/me
     * @secure
     */
    pupilsControllerGetPupilProfile: (params: RequestParams = {}) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/pupils/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Pupils
     * @name PupilsControllerUpdatePupilProfile
     * @summary Update user pupil profile
     * @request PATCH:/pupils/me
     * @secure
     */
    pupilsControllerUpdatePupilProfile: (
      data: UpdatePupilProfileDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/pupils/me`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Pupils
     * @name PupilsControllerGetGlobalPupilLeaderboard
     * @summary Get global pupil leaderboard
     * @request GET:/pupils/leaderboard
     * @secure
     */
    pupilsControllerGetGlobalPupilLeaderboard: (params: RequestParams = {}) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/pupils/leaderboard`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Pupils
     * @name PupilsControllerGetPupilLeaderBoardByPupilId
     * @summary Get pupil leaderboard by pupil ID
     * @request GET:/pupils/leaderboard/{pupilId}
     * @secure
     */
    pupilsControllerGetPupilLeaderBoardByPupilId: (
      pupilId: string,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/pupils/leaderboard/${pupilId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Pupils
     * @name PupilsControllerGetUserByUsername
     * @summary Get public pupil profile
     * @request GET:/pupils/{username}
     * @secure
     */
    pupilsControllerGetUserByUsername: (
      username: string,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/pupils/${username}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  classrooms = {
    /**
     * @description Create classroom with its name and description
     *
     * @tags Classrooms
     * @name ClassroomsControllerCreate
     * @summary Create classroom
     * @request POST:/classrooms
     * @secure
     */
    classroomsControllerCreate: (
      data: CreateClassroomDto,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseDto, ErrorResponseDto>({
        path: `/classrooms`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Classrooms
     * @name ClassroomsControllerFindAll
     * @request GET:/classrooms
     */
    classroomsControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/classrooms`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Classrooms
     * @name ClassroomsControllerFindOne
     * @request GET:/classrooms/{id}
     */
    classroomsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/classrooms/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Classrooms
     * @name ClassroomsControllerUpdate
     * @request PATCH:/classrooms/{id}
     */
    classroomsControllerUpdate: (
      id: string,
      data: UpdateClassroomDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/classrooms/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Classrooms
     * @name ClassroomsControllerRemove
     * @request DELETE:/classrooms/{id}
     */
    classroomsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/classrooms/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  minigames = {
    /**
     * No description
     *
     * @tags Minigames
     * @name MinigamesControllerFindMinigamesByMaterialId
     * @summary Get 3 random minigames for a specific reading material
     * @request GET:/minigames/readingmaterials/{readingMaterialID}/random
     * @secure
     */
    minigamesControllerFindMinigamesByMaterialId: (
      readingMaterialId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/minigames/readingmaterials/${readingMaterialId}/random`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Minigames
     * @name MinigamesControllerFindMinigamesBySessionId
     * @summary Get 3 random minigames for a specific reading session
     * @request GET:/minigames/{readingSessionID}/random
     * @secure
     */
    minigamesControllerFindMinigamesBySessionId: (
      readingSessionId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/minigames/${readingSessionId}/random`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Minigames
     * @name MinigamesControllerFindWordsFromLettersMinigame
     * @summary Get WordsFromLetters minigame for a specific reading material
     * @request GET:/minigames/{readingMaterialID}/wordsFromLetters
     * @secure
     */
    minigamesControllerFindWordsFromLettersMinigame: (
      readingMaterialId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/minigames/${readingMaterialId}/wordsFromLetters`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Minigames
     * @name MinigamesControllerGetMinigamesCompletion
     * @summary Create a completion status of minigames for a specific reading session
     * @request POST:/minigames/{readingSessionID}/complete
     * @secure
     */
    minigamesControllerGetMinigamesCompletion: (
      readingSessionId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/minigames/${readingSessionId}/complete`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Minigames
     * @name MinigamesControllerCreateSentenceRearrangementLog
     * @summary Create a log for SentenceRearrangement minigame
     * @request POST:/minigames/logs/SentenceRearrangement
     * @secure
     */
    minigamesControllerCreateSentenceRearrangementLog: (
      data: CreateMinigameLogDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/minigames/logs/SentenceRearrangement`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Minigames
     * @name MinigamesControllerCreateChoicesLog
     * @summary Create a log for Choices minigame
     * @request POST:/minigames/logs/Choices
     * @secure
     */
    minigamesControllerCreateChoicesLog: (
      data: CreateMinigameLogDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/minigames/logs/Choices`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Minigames
     * @name MinigamesControllerCreateWordsFromLettersLog
     * @summary Create a log for WordsFromLetters minigame
     * @request POST:/minigames/logs/WordsFromLetters
     * @secure
     */
    minigamesControllerCreateWordsFromLettersLog: (
      data: CreateMinigameLogDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/minigames/logs/WordsFromLetters`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
