import api from "../axios-service"
import { BaseQueryModel, BaseSearchModel, BaseSearchQueryModel } from "../interface";

export interface EducationModel {
    id?: number;
    level?: string;
    location?: string;
    branch?: string;
    endYear?: string;
    grage?: string;
    userId?: number;
    createdDate?: string;
    updatedDate?: string;
    deletedDate?: string;
}

const rootApi = '/education'
const _EducationApi = () => {
    return {
        search: async (body: BaseSearchModel) => {
            return await api().post<BaseSearchModel, BaseSearchQueryModel>(`${rootApi}/search`, body)
        },

        create: async (body: EducationModel) => {
            return await api().post<EducationModel, BaseQueryModel>(rootApi, body)
        },

        update: async (id: number, body: EducationModel) => {
            return await api().put<EducationModel, BaseQueryModel>(`${rootApi}/${id}`, body)
        },

        delete: async (id: number) => {
            return await api().delete<unknown, BaseQueryModel>(`${rootApi}/${id}`)
        },
    }
}

export default _EducationApi
