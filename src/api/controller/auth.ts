import api from "../axios-service"

const rootApi = "auth/login"

export interface LoginRequestModel{
    username: string
    password: string
}

export interface LoginResponseModel extends Record<string, any> {
    token?: string;
    profile?: Record<string, any>;
}

const _AuthApi = () => {
    return {
        login: async(body: LoginRequestModel) => {
            return await api().post<LoginRequestModel, LoginResponseModel>(rootApi, body)
        }
    }
}

export default _AuthApi