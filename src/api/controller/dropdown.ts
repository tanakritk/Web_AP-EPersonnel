import api from "../axios-service";
import { BaseQueryModel } from "../interface";

export interface DropdownModel {
  value: number;
  label: string;
}

const _DropdownApi = () => {
  const rootApi = "/dropdown";
  return {
    user: async () => {
      return await api().get<BaseQueryModel>(`${rootApi}/user`);
    },
    statusLeave: async () => {
      return await api().get<BaseQueryModel>(`${rootApi}/status-leave`);
    },

    leaveType: async () => {
      return await api().get<BaseQueryModel>(`${rootApi}/leave-type`);
    },
  };
};

export default _DropdownApi;
