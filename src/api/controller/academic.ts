import api from "../axios-service";
import {
  BaseQueryModel,
  BaseSearchModel,
  BaseSearchQueryModel,
} from "../interface";

export interface AcademicModel {
  id?: number;
  name?: string;
  receiptDate?: string;
  dueDate?: string;
  note?: string;
  isActive?: boolean;
  userId?: number;
  createdDate?: string;
  updatedDate?: string;
  deletedDate?: string;
  no?: number;
}

const rootApi = "/academic";
const _AcademicApi = () => {
  return {
    search: async (body: BaseSearchModel) => {
      return await api().post<BaseSearchModel, BaseSearchQueryModel>(
        `${rootApi}/search`,
        body,
      );
    },

    create: async (body: AcademicModel) => {
      return await api().post<AcademicModel, BaseQueryModel>(rootApi, body);
    },

    update: async (id: number, body: AcademicModel) => {
      return await api().put<AcademicModel, BaseQueryModel>(
        `${rootApi}/${id}`,
        body,
      );
    },

    delete: async (id: number) => {
      return await api().delete<unknown, BaseQueryModel>(`${rootApi}/${id}`);
    },
  };
};

export default _AcademicApi;
