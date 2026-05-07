import api from "../axios-service";
import {
  BaseQueryModel,
  BaseSearchModel,
  BaseSearchQueryModel,
} from "../interface";
import { MasterUserModel } from "./master-user";

export interface AttendenceModel {
  id?: number;
  attendanceDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status?: string;
  userId?: number;
  createdDate?: string;
  updatedDate?: string;
  deletedDate?: string;
  no?: number;
  mas_user?: MasterUserModel;
}

const rootApi = "/attendance";
const _AttendenceApi = () => {
  return {
    search: async (body: BaseSearchModel) => {
      return await api().post<BaseSearchModel, BaseSearchQueryModel>(
        `${rootApi}/search`,
        body,
      );
    },

    create: async (body: AttendenceModel) => {
      return await api().post<AttendenceModel, BaseQueryModel>(rootApi, body);
    },

    update: async (id: number, body: AttendenceModel) => {
      return await api().put<AttendenceModel, BaseQueryModel>(
        `${rootApi}/${id}`,
        body,
      );
    },

    delete: async (id: number) => {
      return await api().delete<unknown, BaseQueryModel>(`${rootApi}/${id}`);
    },
  };
};

export default _AttendenceApi;
