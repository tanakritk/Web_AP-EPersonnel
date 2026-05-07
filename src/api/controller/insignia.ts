import api from "../axios-service";
import {
  BaseQueryModel,
  BaseSearchModel,
  BaseSearchQueryModel,
} from "../interface";

export interface InsigniaModel {
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

const rootApi = "/insignia";
const _InsigniaApi = () => {
  return {
    search: async (body: BaseSearchModel) => {
      return await api().post<BaseSearchModel, BaseSearchQueryModel>(
        `${rootApi}/search`,
        body,
      );
    },

    create: async (body: InsigniaModel) => {
      return await api().post<InsigniaModel, BaseQueryModel>(rootApi, body);
    },

    update: async (id: number, body: InsigniaModel) => {
      return await api().put<InsigniaModel, BaseQueryModel>(
        `${rootApi}/${id}`,
        body,
      );
    },

    delete: async (id: number) => {
      return await api().delete<unknown, BaseQueryModel>(`${rootApi}/${id}`);
    },
  };
};

export default _InsigniaApi;
