import api from "../axios-service";
import {
  BaseQueryModel,
  BaseSearchModel,
  BaseSearchQueryModel,
} from "../interface";
import { MasterUserModel } from "./master-user";

export interface LeaveModel {
  id?: number;
  leaveType?: string | number;
  reasonLeave?: string;
  startDate?: string;
  endDate?: string;
  userId?: number;
  statusLeaveId?: number;
  leaderApprove?: boolean;
  leaderReason?: string;
  headerApprove?: boolean;
  headerReason?: string;
  directorApprove?: boolean;
  directorReason?: string;
  leaveFormat?: string;
  createdDate?: string;
  updatedDate?: string;
  deletedDate?: string;
  no?: number;
  mas_user?: MasterUserModel;
  mas_statusleave?: any;
}

const rootApi = "/leave";
const _LeaveApi = () => {
  return {
    search: async (body: BaseSearchModel) => {
      return await api().post<BaseSearchModel, BaseSearchQueryModel>(
        `${rootApi}/search`,
        body,
      );
    },

    create: async (body: LeaveModel) => {
      return await api().post<LeaveModel, BaseQueryModel>(rootApi, body);
    },

    update: async (id: number, body: LeaveModel) => {
      return await api().put<LeaveModel, BaseQueryModel>(
        `${rootApi}/${id}`,
        body,
      );
    },

    delete: async (id: number) => {
      return await api().delete<unknown, BaseQueryModel>(`${rootApi}/${id}`);
    },
  };
};

export default _LeaveApi;
