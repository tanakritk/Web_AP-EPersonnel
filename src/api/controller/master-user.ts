import api from "../axios-service";
import {
  BaseQueryModel,
  BaseSearchModel,
  BaseSearchQueryModel,
} from "../interface";

export interface MasterUserModel {
  username?: string;
  password?: string;
  title?: string;
  firstname?: string;
  surname?: string;
  address?: string;
  idCardNumber?: string;
  phone?: string;
  nationality?: string;
  ethnicity?: string;
  birthday?: string; // หรือใช้ Date ถ้าคุณต้องการจัดการเป็น Object วันที่
  statusUser?: string;
  bloodGroup?: string;
  position?: string;
  statusWork?: string;
  professionalLicenseNo?: string;
  administratorLicenseNo?: string;
  supervisorLicenseNo?: string;
  professionalLicenseEndDate?: string;
  administratorLicenseEndDate?: string;
  supervisorLicenseEndDate?: string;
  yearService?: string;
  yearServiceStartDate?: string;
  subjects?: string;
  isActive?: boolean;
  isRefactorPassword?: boolean;
  class?: string;
  subjectGroupLeader?: string;
  headWorkDepartment?: string;
  deputyDirector?: string;
  sex?: string;
  role?: string;
  academicStanding?: string;
}

export interface MateAndChildModel {
  title?: string;
  firstname?: string;
  surname?: string;
  address?: string;
  idCardNumber?: string;
  phone?: string;
  nationality?: string;
  ethnicity?: string;
}

export interface MasterUserRelationModel extends MasterUserModel {
  id?: number;
  mate?: MateAndChildModel;
  child?: MateAndChildModel[];

  createdDate?: string;
  updatedDate?: string;
  deletedDate?: string;
  no?: number;
}

interface UpdatePasswordModel {
  password: string;
}

const rootApi = "/master-user";
const _MasterUserApi = () => {
  return {
    search: async (body: BaseSearchModel) => {
      return await api().post<BaseSearchModel, BaseSearchQueryModel>(
        `${rootApi}/search`,
        body,
      );
    },

    create: async (body: MasterUserModel) => {
      return await api().post<MasterUserModel, BaseQueryModel>(rootApi, body);
    },

    update: async (id: number, body: MasterUserModel) => {
      return await api().put<MasterUserModel, BaseQueryModel>(
        `${rootApi}/${id}`,
        body,
      );
    },

    delete: async (id: string) => {
      return await api().delete<unknown, BaseQueryModel>(`${rootApi}/${id}`);
    },

    // ------------------------------------------------------------------------------------- //

    resetPassword: async (id: number) => {
      return await api().put(`${rootApi}/reset-password/${id}`, {});
    },

    updatePassword: async (id: number, payload: UpdatePasswordModel) => {
      return await api().put(`${rootApi}/update-password/${id}`, payload);
    },

    createRelation: async (body: MasterUserRelationModel) => {
      return await api().post<MasterUserRelationModel, BaseQueryModel>(
        `${rootApi}/create-relation`,
        body,
      );
    },

    updateRelation: async (id: number, body: MasterUserRelationModel) => {
      return await api().put<MasterUserRelationModel, BaseQueryModel>(
        `${rootApi}/update-relation/${id}`,
        body,
      );
    },
  };
};

export default _MasterUserApi;
