import api from "../axios-service";
import {
  BaseQueryModel,
  BaseSearchModel,
  BaseSearchQueryModel,
} from "../interface";

export interface LeaveApproveModel {
  note: string;
  statusLeaveId: number | null;
  leaveId: number;
  userId: number;
}

const rootApi = "/leave-approve";

const _LeaveApproveApi = () => {
  return {
    search: async (body: BaseSearchModel) => {
      return await api().post<BaseSearchModel, BaseSearchQueryModel>(
        `${rootApi}/search`,
        body,
      );
    },

    create: async (body: LeaveApproveModel) => {
      return await api().post<LeaveApproveModel, BaseQueryModel>(rootApi, body);
    },
  };
};

export default _LeaveApproveApi;
