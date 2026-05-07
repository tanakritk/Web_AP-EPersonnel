import api from "../axios-service"
import apiformdata from "../axios-formdata-service";
import { BaseQueryModel, BaseSearchModel, BaseSearchQueryModel } from "../interface";

export interface DocumentModel {
    id?: number;
    name?: string;
    userId?: number;
    createdDate?: string;
    updatedDate?: string;
    deletedDate?: string;
}

const rootApi = '/document'
const _DocumentApi = () => {
    return {
        search: async (body: BaseSearchModel) => {
            return await api().post<BaseSearchModel, BaseSearchQueryModel>(`${rootApi}/search`, body)
        },

        create: async (body: FormData) => {
            return await apiformdata.post<BaseQueryModel>(rootApi, body)
        },

        delete: async (id: number) => {
            return await api().delete<unknown, BaseQueryModel>(`${rootApi}/${id}`)
        },
    }
}

export default _DocumentApi
